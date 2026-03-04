# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["FounderHub.slnx", "./"]
COPY ["FounderHub.Api/FounderHub.Api.csproj", "FounderHub.Api/"]
COPY ["FounderHub.Application/FounderHub.Application.csproj", "FounderHub.Application/"]
COPY ["FounderHub.Domain/FounderHub.Domain.csproj", "FounderHub.Domain/"]
COPY ["FounderHub.Infrastructure/FounderHub.Infrastructure.csproj", "FounderHub.Infrastructure/"]

# Restore dependencies
RUN dotnet restore

# Copy everything else and build
COPY . .
WORKDIR "/src/FounderHub.Api"
RUN dotnet build "FounderHub.Api.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "FounderHub.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "FounderHub.Api.dll"]
