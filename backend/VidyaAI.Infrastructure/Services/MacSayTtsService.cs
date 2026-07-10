using System.Buffers.Binary;
using System.Diagnostics;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// Local, free, offline TTS using the macOS `say` command. Each segment is
// synthesized to its own WAV, its exact duration is read from the WAV header, and
// all the PCM is concatenated into one WAV in memory — so we get a single
// playable file plus a precise per-segment timeline with no external tools
// (no ffmpeg). Selected when Tts:Provider = "macos-say" (the default).
//
// All `say` output uses the same PCM format (16-bit LE, mono, 22050 Hz), which is
// what makes the in-process concatenation safe.
public sealed class MacSayTtsService(IConfiguration cfg, ILogger<MacSayTtsService> log) : ITtsService
{
    private const int SampleRate = 22050;
    private const short Channels = 1;
    private const short BitsPerSample = 16;
    private static readonly int BytesPerSecond = SampleRate * Channels * BitsPerSample / 8;

    private readonly string? _defaultVoice = string.IsNullOrWhiteSpace(cfg["Tts:Voice"]) ? null : cfg["Tts:Voice"];

    public IReadOnlyList<TtsVoice> GetVoices()
    {
        try
        {
            var output = RunSay("-v ?", null, captureStdout: true);
            // Each line: "Name              en_US    # Sample sentence."
            // Names can contain spaces, so anchor on the locale code + '#'.
            var rx = new Regex(@"^(?<name>.+?)\s+(?<lang>[a-z]{2}(?:[_-][A-Z]{2})?)\s+#", RegexOptions.Multiline);
            var voices = rx.Matches(output)
                .Select(m => new TtsVoice(m.Groups["name"].Value.Trim(), m.Groups["name"].Value.Trim(), m.Groups["lang"].Value))
                .GroupBy(v => v.Id).Select(g => g.First())
                .OrderByDescending(v => v.Language.StartsWith("en"))
                .ThenBy(v => v.Name)
                .ToList();
            return voices;
        }
        catch (Exception ex)
        {
            log.LogWarning(ex, "Could not list macOS `say` voices.");
            return Array.Empty<TtsVoice>();
        }
    }

    public async Task<TtsResult> SynthesizeAsync(
        IReadOnlyList<TtsSegment> segments, string? voiceId, CancellationToken ct = default)
    {
        var voice = string.IsNullOrWhiteSpace(voiceId) ? _defaultVoice : voiceId;
        var workDir = Path.Combine(Path.GetTempPath(), $"vidyaai-tts-{Guid.NewGuid():N}");
        Directory.CreateDirectory(workDir);

        var pcm = new MemoryStream();
        var timings = new List<TtsTiming>(segments.Count);
        var cursorMs = 0;

        try
        {
            foreach (var seg in segments)
            {
                ct.ThrowIfCancellationRequested();

                var text = seg.Text.Trim();
                if (string.IsNullOrEmpty(text))
                {
                    // Keep the timeline aligned with a tiny zero-length entry.
                    timings.Add(new TtsTiming(seg.Index, seg.ChunkIndex, seg.PageNumber, seg.Text, cursorMs, cursorMs));
                    continue;
                }

                var inPath = Path.Combine(workDir, $"seg-{seg.Index}.txt");
                var outPath = Path.Combine(workDir, $"seg-{seg.Index}.wav");
                await File.WriteAllTextAsync(inPath, text, ct);

                // Read text from a file (-f) to avoid shell quoting/length limits.
                var voiceArg = string.IsNullOrWhiteSpace(voice) ? "" : $"-v \"{voice}\" ";
                var args = $"{voiceArg}-f \"{inPath}\" -o \"{outPath}\" --file-format=WAVE --data-format=LEI16@{SampleRate}";
                RunSay(args, workDir, captureStdout: false);

                var bytes = await File.ReadAllBytesAsync(outPath, ct);
                var data = ExtractPcm(bytes);
                pcm.Write(data, 0, data.Length);

                var durationMs = (int)Math.Round(1000.0 * data.Length / BytesPerSecond);
                timings.Add(new TtsTiming(seg.Index, seg.ChunkIndex, seg.PageNumber, seg.Text, cursorMs, cursorMs + durationMs));
                cursorMs += durationMs;
            }

            var wav = BuildWav(pcm.ToArray());
            return new TtsResult(wav, "audio/wav", ".wav", cursorMs, timings);
        }
        finally
        {
            try { Directory.Delete(workDir, recursive: true); }
            catch (Exception ex) { log.LogWarning(ex, "Failed to clean up TTS temp dir {Dir}", workDir); }
        }
    }

    // Runs `say`; returns stdout when requested. Throws on a non-zero exit.
    private string RunSay(string arguments, string? workingDir, bool captureStdout)
    {
        var psi = new ProcessStartInfo
        {
            FileName = "say",
            Arguments = arguments,
            RedirectStandardOutput = captureStdout,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };
        if (!string.IsNullOrEmpty(workingDir)) psi.WorkingDirectory = workingDir;

        using var proc = Process.Start(psi)
            ?? throw new InvalidOperationException("Could not start the macOS `say` process. Is this running on macOS?");

        var stdout = captureStdout ? proc.StandardOutput.ReadToEnd() : string.Empty;
        var stderr = proc.StandardError.ReadToEnd();
        proc.WaitForExit();

        if (proc.ExitCode != 0)
            throw new InvalidOperationException(
                $"macOS `say` failed (exit {proc.ExitCode}): {stderr.Trim()}");

        return stdout;
    }

    // Returns the PCM sample bytes from a WAV file by locating its "data" chunk.
    private static byte[] ExtractPcm(byte[] wav)
    {
        if (wav.Length < 12 ||
            wav[0] != 'R' || wav[1] != 'I' || wav[2] != 'F' || wav[3] != 'F' ||
            wav[8] != 'W' || wav[9] != 'A' || wav[10] != 'V' || wav[11] != 'E')
            throw new InvalidOperationException("Unexpected `say` output: not a RIFF/WAVE file.");

        var pos = 12;
        while (pos + 8 <= wav.Length)
        {
            var id = System.Text.Encoding.ASCII.GetString(wav, pos, 4);
            var size = (int)BinaryPrimitives.ReadUInt32LittleEndian(wav.AsSpan(pos + 4, 4));
            var dataStart = pos + 8;
            if (id == "data")
            {
                var len = Math.Min(size, wav.Length - dataStart);
                return wav.AsSpan(dataStart, len).ToArray();
            }
            // Chunks are word-aligned (padded to even length).
            pos = dataStart + size + (size & 1);
        }
        throw new InvalidOperationException("WAV file has no 'data' chunk.");
    }

    // Wraps raw PCM in a canonical 44-byte WAV header.
    private static byte[] BuildWav(byte[] pcm)
    {
        var blockAlign = (short)(Channels * BitsPerSample / 8);
        using var ms = new MemoryStream(44 + pcm.Length);
        using var w = new BinaryWriter(ms);

        w.Write("RIFF"u8.ToArray());
        w.Write(36 + pcm.Length);              // RIFF chunk size
        w.Write("WAVE"u8.ToArray());

        w.Write("fmt "u8.ToArray());
        w.Write(16);                            // fmt chunk size (PCM)
        w.Write((short)1);                      // audio format = PCM
        w.Write(Channels);
        w.Write(SampleRate);
        w.Write(BytesPerSecond);                // byte rate
        w.Write(blockAlign);
        w.Write(BitsPerSample);

        w.Write("data"u8.ToArray());
        w.Write(pcm.Length);
        w.Write(pcm);
        w.Flush();
        return ms.ToArray();
    }
}
