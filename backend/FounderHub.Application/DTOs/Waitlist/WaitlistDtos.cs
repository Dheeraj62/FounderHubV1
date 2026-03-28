using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Waitlist
{
    public class SubscribeDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(256, ErrorMessage = "Email cannot exceed 256 characters")]
        public string Email { get; set; } = string.Empty;
    }
}
