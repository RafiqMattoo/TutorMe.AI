using System.Text.Json;

namespace VidyaAI.Application.Common;

// Extracts the list of "item" objects from whatever shape a local LLM returns
// when asked (in JSON mode) for a list of cards / questions. Small models are
// inconsistent — they may emit any of:
//
//   [ {...}, {...} ]                              a bare array          (ideal)
//   { "cards": [ {...}, {...} ] }                 a named array wrapper
//   { "front": "...", "back": "..." }             a SINGLE item object
//
// and a quiz item itself contains an "options" array of strings, which must NOT
// be mistaken for the item list. This normalises all of the above to a sequence
// of item objects.
internal static class JsonItems
{
    public static IEnumerable<JsonElement> Extract(JsonElement root)
    {
        if (root.ValueKind == JsonValueKind.Array)
            return Objects(root);

        if (root.ValueKind == JsonValueKind.Object)
        {
            // Prefer the first property whose value is an array CONTAINING objects
            // (e.g. {"cards":[{...}]}). This skips scalar arrays like a quiz item's
            // "options": ["A","B","C","D"].
            foreach (var prop in root.EnumerateObject())
                if (prop.Value.ValueKind == JsonValueKind.Array &&
                    HasObject(prop.Value))
                    return Objects(prop.Value);

            // No array-of-objects property — the object IS a single item.
            return new[] { root };
        }

        return Array.Empty<JsonElement>();
    }

    private static bool HasObject(JsonElement array)
    {
        foreach (var e in array.EnumerateArray())
            if (e.ValueKind == JsonValueKind.Object) return true;
        return false;
    }

    private static IEnumerable<JsonElement> Objects(JsonElement array)
    {
        foreach (var e in array.EnumerateArray())
            if (e.ValueKind == JsonValueKind.Object)
                yield return e;
    }
}
