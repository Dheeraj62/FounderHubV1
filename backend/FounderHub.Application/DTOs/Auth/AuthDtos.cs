using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Auth
{
    public class LoginRequest
    {
        [Required]
        [MinLength(3, ErrorMessage = "Identifier must be at least 3 characters")]
        [MaxLength(256, ErrorMessage = "Identifier cannot exceed 256 characters")]
        public string Identifier { get; set; } = string.Empty; // Email OR Username

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [MaxLength(100, ErrorMessage = "Password cannot exceed 100 characters")]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        [Required, EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(256, ErrorMessage = "Email cannot exceed 256 characters")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters")]
        [MaxLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [MaxLength(100, ErrorMessage = "Password cannot exceed 100 characters")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(Founder|Investor)$", ErrorMessage = "Role must be 'Founder' or 'Investor'")]
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
