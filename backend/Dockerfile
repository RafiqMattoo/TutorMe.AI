FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["VidyaAI.API/VidyaAI.API.csproj", "VidyaAI.API/"]
COPY ["VidyaAI.Application/VidyaAI.Application.csproj", "VidyaAI.Application/"]
COPY ["VidyaAI.Domain/VidyaAI.Domain.csproj", "VidyaAI.Domain/"]
COPY ["VidyaAI.Infrastructure/VidyaAI.Infrastructure.csproj", "VidyaAI.Infrastructure/"]
RUN dotnet restore "VidyaAI.API/VidyaAI.API.csproj"
COPY . .
RUN dotnet build "VidyaAI.API/VidyaAI.API.csproj" -c Release -o /app/build
RUN dotnet publish "VidyaAI.API/VidyaAI.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VidyaAI.API.dll"]
