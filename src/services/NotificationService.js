import { getDBConnection } from '../database/db';

// Simplified notification service for Expo Go
// For full push notifications, install expo-notifications

export const initNotifications = () => {
  // In Expo Go, we'll use in-app notifications only
  console.log('Notification service initialized (simplified for Expo Go)');
};

export const scheduleReturnReminders = (reservation) => {
  // Log scheduled reminders (in production, use expo-notifications)
  console.log(`Reminder scheduled for reservation ${reservation.id}`);
};

export const saveNotification = async (userId, reservationId, type, titre, message) => {
  const db = await getDBConnection();

  try {
    await db.runAsync(
      `INSERT INTO notifications (user_id, reservation_id, type, titre, message, date_envoi)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, reservationId, type, titre, message]
    );
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

export const getUserNotifications = async (userId) => {
  const db = await getDBConnection();

  try {
    const notifications = await db.getAllAsync(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY date_envoi DESC LIMIT 50',
      [userId]
    );

    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  const db = await getDBConnection();

  try {
    await db.runAsync(
      'UPDATE notifications SET lu = 1 WHERE id = ?',
      [notificationId]
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const getUnreadCount = async (userId) => {
  const db = await getDBConnection();

  try {
    const result = await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND lu = 0',
      [userId]
    );

    return result.count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
