using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(MongoDbContext context, IPasswordHasher passwordHasher)
        {
            // Seed SarahChen (Founder)
            var founderEmail = "sarahchen@example.com";
            var founderUsername = "sarahchen";
            
            var existingFounder = await (await context.Users.FindAsync(u => u.Username == founderUsername)).FirstOrDefaultAsync();
            if (existingFounder == null)
            {
                await context.Users.InsertOneAsync(new User
                {
                    Username = founderUsername,
                    Email = founderEmail,
                    PasswordHash = passwordHasher.Hash("founder123"),
                    Role = UserRole.Founder
                });
            }

            // Seed InvestorMark (Investor)
            var investorEmail = "investormark@example.com";
            var investorUsername = "investormark";
            
            var existingInvestor = await (await context.Users.FindAsync(u => u.Username == investorUsername)).FirstOrDefaultAsync();
            if (existingInvestor == null)
            {
                await context.Users.InsertOneAsync(new User
                {
                    Username = investorUsername,
                    Email = investorEmail,
                    PasswordHash = passwordHasher.Hash("investor123"),
                    Role = UserRole.Investor
                });
                existingInvestor = await (await context.Users.FindAsync(u => u.Username == investorUsername)).FirstAsync();
            }

            // Seed sample ideas for matching
            var ideaCount = await context.Ideas.CountDocumentsAsync(_ => true);
            if (ideaCount == 0 && existingFounder != null)
            {
                var sampleIdeas = new List<Idea>
                {
                    new Idea {
                        FounderId = existingFounder.Id,
                        Title = "GreenCharge AI",
                        Problem = "Inefficient EV charging networks.",
                        Solution = "AI-optimized power distribution for urban chargers.",
                        Industry = "AI/ML",
                        Stage = "MVP",
                        Location = "San Francisco",
                        FundingRange = "$500K - $2M",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Idea {
                        FounderId = existingFounder.Id,
                        Title = "HealthSync",
                        Problem = "Fragmented patient data across clinics.",
                        Solution = "Universal blockchain-based health record API.",
                        Industry = "Healthtech",
                        Stage = "Early-Traction",
                        Location = "Berlin",
                        FundingRange = "$1M - $5M",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Idea {
                        FounderId = existingFounder.Id,
                        Title = "FinFlow",
                        Problem = "Poor cashflow management for SMBs.",
                        Solution = "Automated invoice financing with real-time risk assessment.",
                        Industry = "Fintech",
                        Stage = "MVP",
                        Location = "London",
                        FundingRange = "$250K - $1M",
                        CreatedAt = DateTime.UtcNow
                    }
                };
                await context.Ideas.InsertManyAsync(sampleIdeas);
            }

            // Seed FounderProfile for SarahChen
            if (existingFounder != null)
            {
                var founderProfile = await (await context.FounderProfiles.FindAsync(p => p.UserId == existingFounder.Id)).FirstOrDefaultAsync();
                if (founderProfile == null)
                {
                    await context.FounderProfiles.InsertOneAsync(new FounderProfile
                    {
                        UserId = existingFounder.Id,
                        TechnicalFounder = true,
                        PreviousStartupCount = 1,
                        DomainExperienceYears = 5,
                        TeamSize = 2,
                        LinkedInVerified = true,
                        Bio = "Experienced AI engineer passionate about green tech.",
                        Location = "San Francisco"
                    });
                }
            }

            // Seed InvestorProfile for InvestorMark
            if (existingInvestor != null)
            {
                var investorProfile = await (await context.InvestorProfiles.FindAsync(p => p.UserId == existingInvestor.Id)).FirstOrDefaultAsync();
                if (investorProfile == null)
                {
                    await context.InvestorProfiles.InsertOneAsync(new InvestorProfile
                    {
                        UserId = existingInvestor.Id,
                        PreferredIndustries = new List<string> { "SaaS", "Fintech", "AI/ML" },
                        InvestmentStage = "Seed",
                        TicketSizeRange = "$100K - $500K",
                        Bio = "Focusing on high-growth technology startups.",
                        Location = "London"
                    });
                }
            }
        }
    }
}
