# FounderHub Backend - .NET 10 Web API

## Overview
RESTful API with MongoDB and JWT authentication.

## Prerequisites
- .NET 10 SDK
- MongoDB (local or Atlas)
- An IDE (VS Code, Rider, or Visual Studio)

## Project Structure
```
backend/
├── FounderHub.Api/
│   ├── Program.cs                    # App entry, DI, middleware
│   ├── appsettings.json              # Configuration
│   ├── FounderHub.Api.csproj         # Project file
│   ├── Controllers/
│   │   ├── AuthController.cs         # POST /api/auth/login, /api/auth/register
│   │   ├── IdeasController.cs        # CRUD /api/ideas
│   │   ├── InterestsController.cs    # POST /api/ideas/{id}/interest
│   │   └── StatsController.cs        # GET /api/stats/founder
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Idea.cs
│   │   └── Interest.cs
│   ├── Dtos/
│   │   ├── LoginRequest.cs
│   │   ├── RegisterRequest.cs
│   │   ├── IdeaCreateRequest.cs
│   │   ├── IdeaUpdateRequest.cs
│   │   ├── InterestRequest.cs
│   │   └── AuthResponse.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── IdeaService.cs
│   │   ├── InterestService.cs
│   │   └── JwtService.cs
│   └── Config/
│       ├── MongoDbSettings.cs
│       └── JwtSettings.cs
```

## Setup Instructions

### 1. Create the project
```bash
cd backend
dotnet new webapi -n FounderHub.Api --framework net10.0
cd FounderHub.Api
```

### 2. Install NuGet packages
```bash
dotnet add package MongoDB.Driver
dotnet add package BCrypt.Net-Next
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
```

### 3. Configure appsettings.json
```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "founderhub"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyHereMustBe32CharsLong!!",
    "Issuer": "FounderHub",
    "Audience": "FounderHubApp",
    "ExpiryHours": 24
  },
  "AllowedHosts": "*"
}
```

### 4. Run the API
```bash
dotnet run
# API available at https://localhost:5001
```

### 5. Connect Frontend
Create `.env` in the React project root:
```
VITE_API_BASE_URL=https://localhost:5001
```

## API Endpoints

### Auth
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | /api/auth/register | { email, username, password, role } | No |
| POST | /api/auth/login | { identifier, password } | No |
### Ideas
| Method | Endpoint | Query Params | Auth |
|--------|----------|--------------|------|
| GET | /api/ideas | stage, industry, previouslyRejected, page, pageSize | Yes |
| GET | /api/ideas/mine | - | Yes (Founder) |
| POST | /api/ideas | IdeaCreateRequest body | Yes (Founder) |
| PUT | /api/ideas/{id} | IdeaUpdateRequest body | Yes (Founder) |
| DELETE | /api/ideas/{id} | - | Yes (Founder) |
### Interests
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | /api/ideas/{id}/interest | { status } | Yes (Investor) |
| GET | /api/interests/mine | - | Yes (Investor) |
### Stats
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/stats/founder | Yes (Founder) |
## MongoDB Collections

### users
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "username": "string (unique)",
  "passwordHash": "string (BCrypt)",
  "role": "string (Founder|Investor)",
  "createdAt": "DateTime"
}
```

### ideas
```json
{
  "_id": "ObjectId",
  "founderId": "string (ref users)",
  "title": "string",
  "problem": "string",
  "solution": "string",
  "stage": "string (Idea|MVP|Early Revenue)",
  "industry": "string",
  "previouslyRejected": "boolean",
  "rejectedBy": "string (VC|Accelerator|Angel|Other)",
  "rejectionReasonCategory": "string (Market|Traction|Team|Timing|Other)",
  "originalPitchDate": "string (date)",
  "whatChangedAfterRejection": "string",
  "fundingRange": "string",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### interests
```json
{
  "_id": "ObjectId",
  "ideaId": "string (ref ideas)",
  "investorId": "string (ref users)",
  "status": "string (Interested|Maybe|Pass)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

## MongoDB Indexes
```javascript
// Run in MongoDB shell
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.ideas.createIndex({ founderId: 1 });
db.ideas.createIndex({ stage: 1 });
db.ideas.createIndex({ industry: 1 });
db.ideas.createIndex({ previouslyRejected: 1 });
db.ideas.createIndex({ createdAt: -1 });
db.interests.createIndex({ ideaId: 1, investorId: 1 }, { unique: true });
db.interests.createIndex({ investorId: 1 });
```

## Key Implementation Notes

### Password Hashing (BCrypt)
```csharp
// In AuthService.cs
var hash = BCrypt.Net.BCrypt.HashPassword(password);
var isValid = BCrypt.Net.BCrypt.Verify(password, hash);
```

### JWT Token Generation
```csharp
// In JwtService.cs
var claims = new[]
{
    new Claim("userId", user.Id),
    new Claim("role", user.Role),
    new Claim("email", user.Email),
    new Claim("username", user.Username),
};
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
var token = new JwtSecurityToken(
    issuer: issuer,
    audience: audience,
    claims: claims,
    expires: DateTime.UtcNow.AddHours(expiryHours),
    signingCredentials: creds
);
return new JwtSecurityTokenHandler().WriteToken(token);
```

### Interest Enforcement
```csharp
// In InterestService.cs
// 1. Check idea exists
// 2. Ensure investor != founder (idea.FounderId != investorId)
// 3. Upsert: one interest per investor per idea
//    db.interests.ReplaceOne(
//      filter: ideaId + investorId,
//      replacement: newInterest,
//      options: new ReplaceOptions { IsUpsert = true }
//    )
```

### CORS Configuration
```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```