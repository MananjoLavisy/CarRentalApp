import PushNotification from 'react-native-push-notification';
import { getDBConnection } from '../database/db';
import { getDaysUntil } from '../utils/dateHelpers';

export const initNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'car-rental',
      channelName: 'Location de Voitures',
      channelDescription: 'Notifications pour vos locations',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

export const scheduleReturnReminders = (reservation) => {
  const endDate = new Date(reservation.date_fin);
  const now = new Date();
  
  const reminders = [
    { days: 7, title: '🚗 Rappel de retour', message: `Retour de votre ${reservation.marque} ${reservation.modele} dans 7 jours` },
    { days: 3, title: '🚗 Rappel de retour', message: `Retour de votre ${reservation.marque} ${reservation.modele} dans 3 jours` },
    { days: 1, title: '⚠️ Rappel de retour', message: `Retour de votre ${reservation.marque} ${reservation.modele} demain !` },
    { days: 0, title: '🔔 Retour aujourd\'hui', message: `N'oubliez pas de retourner votre ${reservation.marque} ${reservation.modele} aujourd'hui` }
  ];
  
  reminders.forEach(reminder => {
    const reminderDate = new Date(endDate);
    reminderDate.setDate(reminderDate.getDate() - reminder.days);
    reminderDate.setHours(9, 0, 0, 0); // 9h du matin
    
    if (reminderDate > now) {
      PushNotification.localNotificationSchedule({
        channelId: 'car-rental',
        title: reminder.title,
        message: reminder.message,
        date: reminderDate,
        allowWhileIdle: true,
        id: `${reservation.id}-${reminder.days}`,
      });
    }
  });
};

export const saveNotification = async (userId, reservationId, type, titre, message) => {
  const db = await getDBConnection();
  
  try {
    await db.executeSql(
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
    const [result] = await db.executeSql(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY date_envoi DESC LIMIT 50',
      [userId]
    );
    
    const notifications = [];
    for (let i = 0; i < result.rows.length; i++) {
      notifications.push(result.rows.item(i));
    }
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  const db = await getDBConnection();
  
  try {
    await db.executeSql(
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
    const [result] = await db.executeSql(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND lu = 0',
      [userId]
    );
    
    return result.rows.item(0).count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};