using System;
using System.Threading.Tasks;
using FluentAssertions;
using FounderHub.Application.DTOs.Interests;
using FounderHub.Application.Interfaces;
using FounderHub.Application.Services;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;
using FounderHub.Domain.Exceptions;
using Moq;
using Xunit;

namespace FounderHub.Tests.Unit.Services
{
    public class InterestServiceTests
    {
        private readonly Mock<IInterestRepository> _interestRepositoryMock;
        private readonly Mock<IIdeaRepository> _ideaRepositoryMock;
        private readonly Mock<INotificationRepository> _notificationRepositoryMock;
        private readonly Mock<IConnectionRepository> _connectionRepositoryMock;
        private readonly Mock<IFeedEventRepository> _feedEventsMock;
        private readonly Mock<IDomainEventPublisher> _eventPublisherMock;
        private readonly InterestService _service;

        public InterestServiceTests()
        {
            _interestRepositoryMock = new Mock<IInterestRepository>();
            _ideaRepositoryMock = new Mock<IIdeaRepository>();
            _notificationRepositoryMock = new Mock<INotificationRepository>();
            _connectionRepositoryMock = new Mock<IConnectionRepository>();
            _feedEventsMock = new Mock<IFeedEventRepository>();
            _eventPublisherMock = new Mock<IDomainEventPublisher>();

            _service = new InterestService(
                _interestRepositoryMock.Object,
                _ideaRepositoryMock.Object,
                _notificationRepositoryMock.Object,
                _connectionRepositoryMock.Object,
                _feedEventsMock.Object,
                _eventPublisherMock.Object);
        }

        [Fact]
        public async Task ExpressInterestAsync_ValidInterest_Creates_Interest()
        {
            // Arrange
            var ideaId = "idea1";
            var investorId = "investor1";
            var request = new ExpressInterestRequest { Status = "Interested" };

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync(new Idea { Id = ideaId, FounderId = "founder1" });
            _interestRepositoryMock.Setup(r => r.GetInterestAsync(ideaId, investorId)).ReturnsAsync((Interest)null);

            // Act
            await _service.ExpressInterestAsync(ideaId, investorId, request);

            // Assert
            _interestRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Interest>()), Times.Once);
        }

        [Fact]
        public async Task ExpressInterestAsync_OwnIdea_Throws_ValidationException()
        {
            // Arrange
            var ideaId = "idea1";
            var investorId = "founder1";
            var request = new ExpressInterestRequest { Status = "Interested" };

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync(new Idea { Id = ideaId, FounderId = "founder1" });

            // Act
            var act = () => _service.ExpressInterestAsync(ideaId, investorId, request);

            // Assert
            await act.Should().ThrowAsync<ValidationException>();
        }

        [Fact]
        public async Task ExpressInterestAsync_InvalidStatus_Throws_ValidationException()
        {
            // Arrange
            var ideaId = "idea1";
            var investorId = "investor1";
            var request = new ExpressInterestRequest { Status = "InvalidStatus" };

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync(new Idea { Id = ideaId, FounderId = "founder1" });

            // Act
            var act = () => _service.ExpressInterestAsync(ideaId, investorId, request);

            // Assert
            await act.Should().ThrowAsync<ValidationException>();
        }

        [Fact]
        public async Task ExpressInterestAsync_HighlyInterested_Creates_Connection()
        {
            // Arrange
            var ideaId = "idea1";
            var investorId = "investor1";
            var request = new ExpressInterestRequest { Status = "HighlyInterested" };

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync(new Idea { Id = ideaId, FounderId = "founder1" });
            _interestRepositoryMock.Setup(r => r.GetInterestAsync(ideaId, investorId)).ReturnsAsync((Interest)null);
            _connectionRepositoryMock.Setup(r => r.GetConnectionAsync("founder1", investorId)).ReturnsAsync((Connection)null);

            // Act
            await _service.ExpressInterestAsync(ideaId, investorId, request);

            // Assert
            _connectionRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Connection>()), Times.Once);
        }

        [Fact]
        public async Task GetInterestCountAsync_Returns_Counts()
        {
            // Arrange
            var ideaId = "idea1";
            var founderId = "founder1";

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync(new Idea { Id = ideaId, FounderId = founderId });
            _interestRepositoryMock.Setup(r => r.GetInterestedCountAsync(ideaId)).ReturnsAsync(10);
            _interestRepositoryMock.Setup(r => r.GetMaybeCountAsync(ideaId)).ReturnsAsync(5);

            // Act
            var result = await _service.GetInterestCountAsync(ideaId, founderId);

            // Assert
            result.Should().NotBeNull();
            result.InterestedCount.Should().Be(10);
            result.MaybeCount.Should().Be(5);
        }
    }
}
