using System;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Auth;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;
using FounderHub.Domain.Exceptions;

namespace FounderHub.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IFeedEventRepository _feedEvents;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IDomainEventPublisher _eventPublisher;

        public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, IFeedEventRepository feedEvents, IRefreshTokenRepository refreshTokenRepository, IDomainEventPublisher eventPublisher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _feedEvents = feedEvents;
            _refreshTokenRepository = refreshTokenRepository;
            _eventPublisher = eventPublisher;
        }

        private static string ComputeSha256(string input)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(bytes);
        }

        private static string GenerateSecureToken()
        {
            var randomBytes = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        private async Task<string> CreateRefreshTokenAsync(string userId)
        {
            var rawToken = GenerateSecureToken();
            var tokenHash = ComputeSha256(rawToken);
            
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };
            
            await _refreshTokenRepository.CreateAsync(refreshToken);
            return rawToken;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Normalize
            var email = request.Email.ToLowerInvariant();
            var username = request.Username.ToLowerInvariant();

            // Validate uniqueness
            var existingByEmail = await _userRepository.GetByEmailAsync(email);
            if (existingByEmail != null) throw new ConflictException("Email already exists.");

            var existingByUsername = await _userRepository.GetByUsernameAsync(username);
            if (existingByUsername != null) throw new ConflictException("Username already exists.");

            if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
                throw new ValidationException("Invalid role. Must be 'Founder' or 'Investor'.");

            var user = new User
            {
                Email = email,
                Username = username,
                PasswordHash = _passwordHasher.Hash(request.Password),
                Role = role
            };

            await _userRepository.CreateAsync(user);

            if (user.Role == UserRole.Founder)
            {
                await _eventPublisher.PublishAsync(new FounderHub.Domain.Events.FounderRegisteredEvent(user.Id, user.CreatedAt));
            }

            var token = _jwtProvider.GenerateToken(user);
            var refreshToken = await CreateRefreshTokenAsync(user.Id);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var identifier = request.Identifier.ToLowerInvariant();
            
            // Allow login by email or username
            var user = await _userRepository.GetByEmailAsync(identifier) 
                       ?? await _userRepository.GetByUsernameAsync(identifier);

            if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
                throw new AuthenticationException("Invalid identifier or password.");

            var token = _jwtProvider.GenerateToken(user);
            var refreshToken = await CreateRefreshTokenAsync(user.Id);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            var hash = ComputeSha256(refreshToken);
            var storedToken = await _refreshTokenRepository.GetByTokenHashAsync(hash);
            
            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTime.UtcNow)
                throw new Domain.Exceptions.AuthenticationException("Invalid or expired refresh token.");
            
            // Rotate: revoke old token
            storedToken.IsRevoked = true;
            var newRawToken = GenerateSecureToken();
            storedToken.ReplacedByTokenHash = ComputeSha256(newRawToken);
            await _refreshTokenRepository.UpdateAsync(storedToken);
            
            // Create new refresh token
            var user = await _userRepository.GetByIdAsync(storedToken.UserId)
                ?? throw new Domain.Exceptions.AuthenticationException("User not found.");
            
            var newStoredToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = ComputeSha256(newRawToken),
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
            await _refreshTokenRepository.CreateAsync(newStoredToken);
            
            var accessToken = _jwtProvider.GenerateToken(user);
            
            return new AuthResponse
            {
                Token = accessToken,
                RefreshToken = newRawToken,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task RevokeTokenAsync(string userId)
        {
            await _refreshTokenRepository.RevokeAllByUserIdAsync(userId);
        }
    }
}
