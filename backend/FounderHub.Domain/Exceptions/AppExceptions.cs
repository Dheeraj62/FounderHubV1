using System;

namespace FounderHub.Domain.Exceptions
{
    /// <summary>
    /// Base exception for all FounderHub application errors.
    /// </summary>
    public abstract class AppException : Exception
    {
        public int StatusCode { get; }

        protected AppException(string message, int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }

    /// <summary>
    /// Thrown when input validation fails (HTTP 400).
    /// </summary>
    public class ValidationException : AppException
    {
        public ValidationException(string message) : base(message, 400) { }
    }

    /// <summary>
    /// Thrown when a requested resource is not found (HTTP 404).
    /// </summary>
    public class NotFoundException : AppException
    {
        public NotFoundException(string resource, string id)
            : base($"{resource} with ID '{id}' was not found.", 404) { }

        public NotFoundException(string message)
            : base(message, 404) { }
    }

    /// <summary>
    /// Thrown when there is a conflict (e.g. duplicate entry) (HTTP 409).
    /// </summary>
    public class ConflictException : AppException
    {
        public ConflictException(string message) : base(message, 409) { }
    }

    /// <summary>
    /// Thrown when authentication fails (HTTP 401).
    /// </summary>
    public class AuthenticationException : AppException
    {
        public AuthenticationException(string message = "Invalid credentials.")
            : base(message, 401) { }
    }

    /// <summary>
    /// Thrown when the user is not authorized for a specific action (HTTP 403).
    /// </summary>
    public class ForbiddenException : AppException
    {
        public ForbiddenException(string message = "Access denied.")
            : base(message, 403) { }
    }
}
