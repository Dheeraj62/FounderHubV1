using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using FounderHub.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace FounderHub.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            int statusCode;
            string message;

            switch (exception)
            {
                // Custom application exceptions — carry their own status code
                case AppException appEx:
                    statusCode = appEx.StatusCode;
                    message = appEx.Message;
                    _logger.LogWarning("Application error ({StatusCode}): {Message}", statusCode, message);
                    break;

                // .NET built-in — used for authorization checks
                case UnauthorizedAccessException:
                    statusCode = (int)HttpStatusCode.Forbidden;
                    message = "Access denied.";
                    _logger.LogWarning("Access denied: {Message}", exception.Message);
                    break;

                case ArgumentException argEx:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    message = argEx.Message;
                    _logger.LogWarning("Bad request: {Message}", message);
                    break;

                // Unhandled — log full details but return generic message
                default:
                    statusCode = (int)HttpStatusCode.InternalServerError;
                    message = "An unexpected error occurred. Please try again later.";
                    _logger.LogError(exception, "Unhandled exception occurred.");
                    break;
            }

            context.Response.StatusCode = statusCode;

            var response = new
            {
                error = message,
                status = statusCode
            };

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
