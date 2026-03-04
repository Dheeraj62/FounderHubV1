using System;
using System.ComponentModel.DataAnnotations;
using FounderHub.Domain.Enums;

namespace FounderHub.Application.DTOs.Interests
{
    public class ExpressInterestRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Interested / Maybe / Pass
    }

    public class InterestCountResponse
    {
        public int InterestedCount { get; set; }
        public int MaybeCount { get; set; }
    }
}
