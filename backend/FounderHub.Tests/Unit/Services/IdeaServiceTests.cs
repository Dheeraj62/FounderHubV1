using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using FounderHub.Application.Services;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Exceptions;
using Moq;
using Xunit;

namespace FounderHub.Tests.Unit.Services
{
    public class IdeaServiceTests
    {
        private readonly Mock<IIdeaRepository> _ideaRepositoryMock;
        private readonly Mock<IInvestorProfileRepository> _investorRepositoryMock;
        private readonly Mock<IInterestRepository> _interestRepositoryMock;
        private readonly Mock<IIdeaViewRepository> _ideaViewRepositoryMock;
        private readonly Mock<IFeedEventRepository> _feedEventsMock;
        private readonly Mock<IHtmlSanitizerService> _sanitizerMock;
        private readonly Mock<AutoMapper.IMapper> _mapperMock;
        private readonly Mock<IDomainEventPublisher> _eventPublisherMock;
        private readonly IdeaService _service;

        public IdeaServiceTests()
        {
            _ideaRepositoryMock = new Mock<IIdeaRepository>();
            _investorRepositoryMock = new Mock<IInvestorProfileRepository>();
            _interestRepositoryMock = new Mock<IInterestRepository>();
            _ideaViewRepositoryMock = new Mock<IIdeaViewRepository>();
            _feedEventsMock = new Mock<IFeedEventRepository>();
            _sanitizerMock = new Mock<IHtmlSanitizerService>();
            _mapperMock = new Mock<AutoMapper.IMapper>();
            _eventPublisherMock = new Mock<IDomainEventPublisher>();

            _sanitizerMock.Setup(s => s.Sanitize(It.IsAny<string>())).Returns((string input) => input);
            _mapperMock.Setup(m => m.Map<TrendingIdeaDto>(It.IsAny<Idea>())).Returns(new TrendingIdeaDto { Id = "test" });

            _service = new IdeaService(
                _ideaRepositoryMock.Object,
                _investorRepositoryMock.Object,
                _interestRepositoryMock.Object,
                _ideaViewRepositoryMock.Object,
                _feedEventsMock.Object,
                _sanitizerMock.Object,
                _mapperMock.Object,
                _eventPublisherMock.Object);
        }

        [Fact]
        public async Task CreateIdeaAsync_ValidRequest_Returns_IdeaDto()
        {
            // Arrange
            var founderId = "founder1";
            var request = new CreateIdeaRequest { Title = "Idea", Problem = "Problem", Solution = "Solution" };

            _mapperMock.Setup(m => m.Map<IdeaDto>(It.IsAny<Idea>())).Returns(new IdeaDto { Title = "Idea" });

            // Act
            var result = await _service.CreateIdeaAsync(founderId, request);

            // Assert
            result.Should().NotBeNull();
            _ideaRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Idea>()), Times.Once);
        }

        [Fact]
        public async Task UpdateIdeaAsync_NotOwner_Throws_ForbiddenException()
        {
            // Arrange
            var founderId = "hacker1";
            var ideaId = "idea1";
            var request = new UpdateIdeaRequest { Title = "Updated" };

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync(new Idea { Id = ideaId, FounderId = "founder1" });

            // Act
            var act = () => _service.UpdateIdeaAsync(founderId, ideaId, request);

            // Assert
            await act.Should().ThrowAsync<ForbiddenException>();
        }

        [Fact]
        public async Task DeleteIdeaAsync_NotFound_Throws_NotFoundException()
        {
            // Arrange
            var founderId = "founder1";
            var ideaId = "idea1";

            _ideaRepositoryMock.Setup(r => r.GetByIdAsync(ideaId)).ReturnsAsync((Idea)null);

            // Act
            var act = () => _service.DeleteIdeaAsync(founderId, ideaId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task GetTrendingAsync_Returns_SortedByScore()
        {
            // Arrange
            var ideasList = new List<Idea>
            {
                new Idea { Id = "idea1", Title = "Idea 1" },
                new Idea { Id = "idea2", Title = "Idea 2" }
            };
            
            _ideaRepositoryMock.Setup(r => r.GetIdeasAsync(null, null, null, null, null, 1, 200))
                .ReturnsAsync((ideasList, 2));

            _ideaViewRepositoryMock.Setup(r => r.GetIdeaViewCountAsync("idea1")).ReturnsAsync(10);
            _interestRepositoryMock.Setup(r => r.GetInterestedCountAsync("idea1")).ReturnsAsync(5);
            _interestRepositoryMock.Setup(r => r.GetMaybeCountAsync("idea1")).ReturnsAsync(0);

            _ideaViewRepositoryMock.Setup(r => r.GetIdeaViewCountAsync("idea2")).ReturnsAsync(100);
            _interestRepositoryMock.Setup(r => r.GetInterestedCountAsync("idea2")).ReturnsAsync(20);
            _interestRepositoryMock.Setup(r => r.GetMaybeCountAsync("idea2")).ReturnsAsync(0);

            _mapperMock.Setup(m => m.Map<TrendingIdeaDto>(It.Is<Idea>(i => i.Id == "idea1"))).Returns(new TrendingIdeaDto { Id = "idea1" });
            _mapperMock.Setup(m => m.Map<TrendingIdeaDto>(It.Is<Idea>(i => i.Id == "idea2"))).Returns(new TrendingIdeaDto { Id = "idea2" });

            // Act
            var result = await _service.GetTrendingAsync(10);

            // Assert
            result.Should().NotBeNull();
            var resultList = result.ToList();
            resultList.Count.Should().Be(2);
            resultList.First().Id.Should().Be("idea2"); // idea2 should have higher score
        }
    }
}
