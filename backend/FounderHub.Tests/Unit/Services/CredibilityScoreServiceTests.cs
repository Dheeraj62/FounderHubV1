using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using FounderHub.Application.DTOs.Profiles;
using FounderHub.Application.Interfaces;
using FounderHub.Application.Services;
using FounderHub.Domain.Entities;
using Moq;
using Xunit;

namespace FounderHub.Tests.Unit.Services
{
    public class CredibilityScoreServiceTests
    {
        private readonly Mock<IIdeaRepository> _ideaRepositoryMock;
        private readonly Mock<IIdeaViewRepository> _ideaViewRepositoryMock;
        private readonly Mock<IInterestRepository> _interestRepositoryMock;
        private readonly Mock<IFounderProfileRepository> _founderProfileRepositoryMock;
        private readonly CredibilityScoreService _service;

        public CredibilityScoreServiceTests()
        {
            _ideaRepositoryMock = new Mock<IIdeaRepository>();
            _ideaViewRepositoryMock = new Mock<IIdeaViewRepository>();
            _interestRepositoryMock = new Mock<IInterestRepository>();
            _founderProfileRepositoryMock = new Mock<IFounderProfileRepository>();

            _service = new CredibilityScoreService(
                _ideaRepositoryMock.Object,
                _ideaViewRepositoryMock.Object,
                _interestRepositoryMock.Object,
                _founderProfileRepositoryMock.Object);
        }

        [Fact]
        public async Task ComputeAsync_FounderWithCompleteProfile_Returns_HighScore()
        {
            // Arrange
            var founderId = "founder1";
            _founderProfileRepositoryMock.Setup(r => r.GetByUserIdAsync(founderId))
                .ReturnsAsync(new FounderProfile { Bio = "Bio", LinkedInProfileUrl = "url", StartupWebsite = "url", LinkedInVerified = true, DomainExperienceYears = 5 });
            
            _ideaRepositoryMock.Setup(r => r.GetByFounderIdAsync(founderId))
                .ReturnsAsync(new List<Idea> { new Idea { Id = "idea1" }, new Idea { Id = "idea2" } });
            
            _ideaViewRepositoryMock.Setup(r => r.GetViewCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int> { { "idea1", 100 }, { "idea2", 100 } });
            
            _interestRepositoryMock.Setup(r => r.GetInterestedCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int> { { "idea1", 5 }, { "idea2", 5 } });
                
            _interestRepositoryMock.Setup(r => r.GetMaybeCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());

            // Act
            var result = await _service.ComputeAsync(founderId);

            // Assert
            result.Score.Should().BeGreaterThanOrEqualTo(60);
            result.Badge.Should().NotBe("New Founder");
        }

        [Fact]
        public async Task ComputeAsync_NewFounderNoProfile_Returns_Zero()
        {
            // Arrange
            var founderId = "founder1";
            _founderProfileRepositoryMock.Setup(r => r.GetByUserIdAsync(founderId))
                .ReturnsAsync((FounderProfile)null);
            
            _ideaRepositoryMock.Setup(r => r.GetByFounderIdAsync(founderId))
                .ReturnsAsync(new List<Idea>());
            
            _ideaViewRepositoryMock.Setup(r => r.GetViewCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());
            _interestRepositoryMock.Setup(r => r.GetInterestedCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());
            _interestRepositoryMock.Setup(r => r.GetMaybeCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());

            // Act
            var result = await _service.ComputeAsync(founderId);

            // Assert
            result.Score.Should().Be(0);
            result.Badge.Should().Be("New Founder");
        }

        [Fact]
        public async Task ComputeAsync_FounderWithIdeasButNoEngagement_Returns_IdeaScoreOnly()
        {
            // Arrange
            var founderId = "founder1";
            _founderProfileRepositoryMock.Setup(r => r.GetByUserIdAsync(founderId))
                .ReturnsAsync((FounderProfile)null);
            
            _ideaRepositoryMock.Setup(r => r.GetByFounderIdAsync(founderId))
                .ReturnsAsync(new List<Idea> { new Idea { Id = "idea1" }, new Idea { Id = "idea2" }, new Idea { Id = "idea3" } });
                
            _ideaViewRepositoryMock.Setup(r => r.GetViewCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());
            _interestRepositoryMock.Setup(r => r.GetInterestedCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());
            _interestRepositoryMock.Setup(r => r.GetMaybeCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());

            // Act
            var result = await _service.ComputeAsync(founderId);

            // Assert
            result.Score.Should().Be(15);
            result.IdeaScore.Should().Be(15);
        }

        [Fact]
        public async Task ComputeAsync_ScoreCappedAt100()
        {
            // Arrange
            var founderId = "founder1";
            _founderProfileRepositoryMock.Setup(r => r.GetByUserIdAsync(founderId))
                .ReturnsAsync(new FounderProfile { Bio = "Bio", LinkedInProfileUrl = "url", StartupWebsite = "url", LinkedInVerified = true, DomainExperienceYears = 5 });
            
            var ideas = new List<Idea>();
            for (int i = 0; i < 10; i++) ideas.Add(new Idea { Id = $"idea{i}" });

            _ideaRepositoryMock.Setup(r => r.GetByFounderIdAsync(founderId))
                .ReturnsAsync(ideas);
            
            _ideaViewRepositoryMock.Setup(r => r.GetViewCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int> { { "idea0", 1000 } });
            
            _interestRepositoryMock.Setup(r => r.GetInterestedCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int> { { "idea0", 100 } });
                
            _interestRepositoryMock.Setup(r => r.GetMaybeCountBatchAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new Dictionary<string, int>());

            // Act
            var result = await _service.ComputeAsync(founderId);

            // Assert
            result.Score.Should().Be(100);
            result.Badge.Should().Be("Elite Founder");
        }
    }
}
