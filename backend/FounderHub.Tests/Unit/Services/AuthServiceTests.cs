using System.Threading.Tasks;
using FluentAssertions;
using FounderHub.Application.DTOs.Auth;
using FounderHub.Application.Interfaces;
using FounderHub.Application.Services;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;
using FounderHub.Domain.Exceptions;
using Moq;
using Xunit;

namespace FounderHub.Tests.Unit.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IPasswordHasher> _passwordHasherMock;
        private readonly Mock<IJwtProvider> _jwtProviderMock;
        private readonly Mock<IFeedEventRepository> _feedEventsMock;
        private readonly Mock<IRefreshTokenRepository> _refreshTokenRepositoryMock;
        private readonly Mock<IDomainEventPublisher> _eventPublisherMock;
        private readonly AuthService _service;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _passwordHasherMock = new Mock<IPasswordHasher>();
            _jwtProviderMock = new Mock<IJwtProvider>();
            _feedEventsMock = new Mock<IFeedEventRepository>();
            _refreshTokenRepositoryMock = new Mock<IRefreshTokenRepository>();
            _eventPublisherMock = new Mock<IDomainEventPublisher>();

            _service = new AuthService(
                _userRepositoryMock.Object,
                _passwordHasherMock.Object,
                _jwtProviderMock.Object,
                _feedEventsMock.Object,
                _refreshTokenRepositoryMock.Object,
                _eventPublisherMock.Object);
        }

        [Fact]
        public async Task RegisterAsync_ValidRequest_Returns_TokenAndUser()
        {
            // Arrange
            var request = new RegisterRequest { Email = "test@test.com", Username = "testuser", Password = "password", Role = "Founder" };
            
            _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User)null);
            _userRepositoryMock.Setup(r => r.GetByUsernameAsync(It.IsAny<string>())).ReturnsAsync((User)null);
            _passwordHasherMock.Setup(h => h.Hash(It.IsAny<string>())).Returns("hashed_password");
            _jwtProviderMock.Setup(p => p.GenerateToken(It.IsAny<User>())).Returns("token");

            // Act
            var result = await _service.RegisterAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("token");
            result.Email.Should().Be("test@test.com");
            result.Role.Should().Be("Founder");
        }

        [Fact]
        public async Task RegisterAsync_DuplicateEmail_Throws_ConflictException()
        {
            // Arrange
            var request = new RegisterRequest { Email = "test@test.com", Username = "testuser", Password = "password", Role = "Founder" };
            _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(new User());

            // Act
            var act = () => _service.RegisterAsync(request);

            // Assert
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_Returns_Token()
        {
            // Arrange
            var request = new LoginRequest { Identifier = "test@test.com", Password = "password" };
            var user = new User { Email = "test@test.com", PasswordHash = "hashed_password", Role = UserRole.Founder };
            
            _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
            _passwordHasherMock.Setup(h => h.Verify("password", "hashed_password")).Returns(true);
            _jwtProviderMock.Setup(p => p.GenerateToken(user)).Returns("token");

            // Act
            var result = await _service.LoginAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("token");
        }

        [Fact]
        public async Task LoginAsync_InvalidPassword_Throws_AuthenticationException()
        {
            // Arrange
            var request = new LoginRequest { Identifier = "test@test.com", Password = "wrongpassword" };
            var user = new User { Email = "test@test.com", PasswordHash = "hashed_password" };
            
            _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
            _passwordHasherMock.Setup(h => h.Verify("wrongpassword", "hashed_password")).Returns(false);

            // Act
            var act = () => _service.LoginAsync(request);

            // Assert
            await act.Should().ThrowAsync<AuthenticationException>();
        }

        [Fact]
        public async Task LoginAsync_NonexistentUser_Throws_AuthenticationException()
        {
            // Arrange
            var request = new LoginRequest { Identifier = "test@test.com", Password = "password" };
            _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User)null);
            _userRepositoryMock.Setup(r => r.GetByUsernameAsync(It.IsAny<string>())).ReturnsAsync((User)null);

            // Act
            var act = () => _service.LoginAsync(request);

            // Assert
            await act.Should().ThrowAsync<AuthenticationException>();
        }
    }
}
