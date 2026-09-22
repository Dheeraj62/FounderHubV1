using System;
using System.Threading.Tasks;

namespace FounderHub.Application.Interfaces;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan expiration) where T : class;
    Task RemoveAsync(string key);
    Task RemoveByPrefixAsync(string prefix);
}
