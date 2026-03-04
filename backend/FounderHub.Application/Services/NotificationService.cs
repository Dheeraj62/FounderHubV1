using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Notifications;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepo;

        public NotificationService(INotificationRepository notificationRepo)
        {
            _notificationRepo = notificationRepo;
        }

        public async Task<IEnumerable<NotificationDto>> GetMyNotificationsAsync(string userId)
        {
            var notifications = await _notificationRepo.GetByUserIdAsync(userId);
            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Type = n.Type,
                Title = n.Title,
                Body = n.Body,
                ReferenceId = n.ReferenceId,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).OrderByDescending(n => n.CreatedAt);
        }

        public async Task MarkAsReadAsync(string userId, string notificationId)
        {
            var notification = await _notificationRepo.GetByIdAsync(notificationId);
            if (notification == null || notification.UserId != userId) return;

            notification.IsRead = true;
            await _notificationRepo.UpdateAsync(notification);
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            var notifications = await _notificationRepo.GetByUserIdAsync(userId);
            foreach (var n in notifications.Where(n => !n.IsRead))
            {
                n.IsRead = true;
                await _notificationRepo.UpdateAsync(n);
            }
        }
    }
}
