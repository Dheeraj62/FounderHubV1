FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["FounderHub.Api/FounderHub.Api.csproj", "FounderHub.Api/"]
COPY ["FounderHub.Application/FounderHub.Application.csproj", "FounderHub.Application/"]
COPY ["FounderHub.Domain/FounderHub.Domain.csproj", "FounderHub.Domain/"]
COPY ["FounderHub.Infrastructure/FounderHub.Infrastructure.csproj", "FounderHub.Infrastructure/"]
RUN dotnet restore "FounderHub.Api/FounderHub.Api.csproj"
COPY . .
WORKDIR "/src/FounderHub.Api"
RUN dotnet build "./FounderHub.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./FounderHub.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FounderHub.Api.dll"]
