using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace FounderHub.Application.Services
{
    public interface IFileUploadService
    {
        Task<string> UploadImageAsync(IFormFile file, string subfolder);
    }

    public class FileUploadService : IFileUploadService
    {
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp", ".gif"
        };

        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public async Task<string> UploadImageAsync(IFormFile file, string subfolder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided.");

            if (file.Length > MaxFileSize)
                throw new ArgumentException("File size exceeds 5 MB limit.");

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(extension))
                throw new ArgumentException("Only JPG, PNG, WebP, and GIF images are allowed.");

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", subfolder);
            Directory.CreateDirectory(uploadsRoot);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsRoot, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the relative URL path
            return $"/uploads/{subfolder}/{fileName}";
        }
    }
}
