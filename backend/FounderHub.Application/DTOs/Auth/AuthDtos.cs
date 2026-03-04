using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Auth
{
    public class LoginRequest
    {
        [Required]
        public string Identifier { get; set; } = string.Empty; // Email OR Username

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty; // "Founder" or "Investor"
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
