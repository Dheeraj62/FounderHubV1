using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace FounderHub.Api.Middleware
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var headers = context.Response.Headers;
            
            headers.Append("X-Frame-Options", "DENY");
            headers.Append("X-XSS-Protection", "1; mode=block");
            headers.Append("X-Content-Type-Options", "nosniff");
            headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

            // CSP: Allow self, Google Fonts, Google Analytics, and data URIs for inline images
            headers.Append("Content-Security-Policy",
                "default-src 'self'; " +
                "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' https://www.google-analytics.com; " +
                "frame-ancestors 'none'");

            await _next(context);
        }
    }
}
