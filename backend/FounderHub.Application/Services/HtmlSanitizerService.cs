using Ganss.Xss;

namespace FounderHub.Application.Services
{
    public interface IHtmlSanitizerService
    {
        string Sanitize(string input);
    }

    public class HtmlSanitizerService : IHtmlSanitizerService
    {
        private readonly HtmlSanitizer _sanitizer;

        public HtmlSanitizerService()
        {
            _sanitizer = new HtmlSanitizer();
            
            // Allow basic text formatting for markdown/richtext descriptions
            _sanitizer.AllowedTags.Add("u");
            _sanitizer.AllowedTags.Add("b");
            _sanitizer.AllowedTags.Add("i");
            _sanitizer.AllowedTags.Add("strong");
            _sanitizer.AllowedTags.Add("em");
            _sanitizer.AllowedTags.Add("br");
            _sanitizer.AllowedTags.Add("p");
            
            // Remove malicious scripting, iframes, clickjacking vectors entirely
        }

        public string Sanitize(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return input;
            
            return _sanitizer.Sanitize(input);
        }
    }
}
