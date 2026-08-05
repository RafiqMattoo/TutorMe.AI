using System.Text;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using VidyaAI.API.Middleware;
using VidyaAI.Application.Common.Behaviors;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Infrastructure.Data;
using VidyaAI.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        npg => npg.MigrationsAssembly("VidyaAI.Infrastructure")));


        builder.Services.AddScoped<IJwtService, JwtService>();
        builder.Services.AddHttpClient<IVideoService, VideoService>();
        builder.Services.AddHttpClient<IVideoService, VideoService>();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(VidyaAI.Application.Auth.Commands.LoginCommand).Assembly);
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(PerformanceBehavior<,>));
});
builder.Services.AddValidatorsFromAssembly(typeof(VidyaAI.Application.Auth.Commands.LoginCommandValidator).Assembly);

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, ValidateAudience = true,
            ValidateLifetime = true, ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUserService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());
builder.Services.AddScoped<VidyaAI.Infrastructure.Services.CategoryService>();

// ── RAG / Tutor wiring ────────────────────────────────────────────
builder.Services.AddSingleton<IPdfTextExtractor, PdfTextExtractor>();
builder.Services.AddSingleton<ITextChunker, TextChunker>();
builder.Services.AddScoped<IStorageService, LocalFileStorageService>();

// Email (registration/approval). SMTP when Smtp:Host is set; otherwise writes a
// local HTML preview so dev works without a mail server.
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
// Captcha verification — disabled (skipped) unless Captcha:SecretKey is configured.
builder.Services.AddHttpClient<ICaptchaVerifier, CaptchaVerifier>(c => c.Timeout = TimeSpan.FromSeconds(10));

// Text-to-speech for audio narration. Config-driven (Tts:Provider); the default
// "macos-say" uses the local macOS `say` command (free, offline). The interface
// lets a cross-platform/cloud engine be swapped in without touching the pipeline.
var ttsProvider = (builder.Configuration["Tts:Provider"] ?? "macos-say").Trim().ToLowerInvariant();
builder.Services.AddSingleton<ITtsService, MacSayTtsService>();
Log.Information("TTS provider: {Provider}", ttsProvider);

// AI provider is config-driven (AI:Provider = "ollama" | "gemini"). Both
// implement IEmbeddingService + ILlmChatService, so the rest of the pipeline is
// provider-agnostic. "ollama" keeps all book content local; "gemini" uses the
// free cloud tier. Switching providers requires re-embedding existing materials
// (different models produce incompatible vectors).
var aiProvider = (builder.Configuration["AI:Provider"] ?? "gemini").Trim().ToLowerInvariant();
if (aiProvider == "ollama")
{
    // Local LLM generation can be slow (model load + CPU inference) — allow more time.
    builder.Services.AddHttpClient<OllamaAiService>(c => c.Timeout = TimeSpan.FromSeconds(300));
    builder.Services.AddScoped<IEmbeddingService>(sp => sp.GetRequiredService<OllamaAiService>());
    builder.Services.AddScoped<ILlmChatService>(sp => sp.GetRequiredService<OllamaAiService>());
}
else
{
    builder.Services.AddHttpClient<GeminiService>(c => c.Timeout = TimeSpan.FromSeconds(60));
    builder.Services.AddScoped<IEmbeddingService>(sp => sp.GetRequiredService<GeminiService>());
    builder.Services.AddScoped<ILlmChatService>(sp => sp.GetRequiredService<GeminiService>());
}
Log.Information("AI provider: {Provider}", aiProvider);

// AI image generation for illustrated story scenes. Always Gemini-backed (image
// models aren't available via the local Ollama provider); degrades gracefully to
// text-only slides when no Gemini API key is configured.
builder.Services.AddHttpClient<IImageGenerationService, GeminiImageService>(c => c.Timeout = TimeSpan.FromSeconds(120));

builder.Services.AddCors(opt =>
    opt.AddPolicy("AllowFrontend", p =>
        p.WithOrigins(
            builder.Configuration["AllowedOrigins:Frontend"] ?? "http://localhost:5173",
            "http://localhost:3000")
         .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "VidyaAI API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header, Description = "Bearer {token}",
        Name = "Authorization", Type = SecuritySchemeType.ApiKey, Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {{
        new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
        Array.Empty<string>()
    }});
});

builder.Services.AddControllers()
    .AddJsonOptions(opt => opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");

// Serve uploaded files (Storage:Root) at Storage:PublicPath (default /files).
var configuredStorageRoot = builder.Configuration["Storage:Root"];
var storageRoot = string.IsNullOrWhiteSpace(configuredStorageRoot)
    ? Path.Combine(AppContext.BaseDirectory, "storage")
    : configuredStorageRoot;
Directory.CreateDirectory(storageRoot);
var publicPath = builder.Configuration["Storage:PublicPath"];
if (string.IsNullOrWhiteSpace(publicPath)) publicPath = "/files";
app.UseStaticFiles(new Microsoft.AspNetCore.Builder.StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(storageRoot),
    RequestPath = publicPath
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "VidyaAI API v1"));
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { }
