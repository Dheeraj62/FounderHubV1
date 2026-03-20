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
            headers.Append("Content-Security-Policy", "default-src 'self'");

            await _next(context);
        }
    }
}
