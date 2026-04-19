using System;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Auth;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;

namespace FounderHub.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IFeedEventRepository _feedEvents;

        public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, IFeedEventRepository feedEvents)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _feedEvents = feedEvents;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Normalize
            var email = request.Email.ToLowerInvariant();
            var username = request.Username.ToLowerInvariant();

            // Validate uniqueness
            var existingByEmail = await _userRepository.GetByEmailAsync(email);
            if (existingByEmail != null) throw new Exception("Email already exists");

            var existingByUsername = await _userRepository.GetByUsernameAsync(username);
            if (existingByUsername != null) throw new Exception("Username already exists");

            if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
                throw new Exception("Invalid role. Must be 'Founder' or 'Investor'.");

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
                await _feedEvents.CreateAsync(new FeedEvent
                {
                    Type = "NEW_FOUNDER",
                    UserId = user.Id,
                    ReferenceId = null,
                    CreatedAt = user.CreatedAt
                });
            }

            var token = _jwtProvider.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
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
                throw new Exception("Invalid identifier or password.");

            var token = _jwtProvider.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }
    }
}
