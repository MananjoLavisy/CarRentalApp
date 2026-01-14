import { getDBConnection } from '../db';

export const toggleFavorite = async (userId, carId) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM favoris WHERE user_id = ? AND voiture_id = ?',
      [userId, carId]
    );
    
    if (result.rows.length > 0) {
      await db.executeSql(
        'DELETE FROM favoris WHERE user_id = ? AND voiture_id = ?',
        [userId, carId]
      );
      return false;
    } else {
      await db.executeSql(
        'INSERT INTO favoris (user_id, voiture_id) VALUES (?, ?)',
        [userId, carId]
      );
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const getFavorites = async (userId) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      `SELECT v.*, f.date_ajout 
       FROM voitures v
       INNER JOIN favoris f ON v.id = f.voiture_id
       WHERE f.user_id = ?
       ORDER BY f.date_ajout DESC`,
      [userId]
    );
    
    const favorites = [];
    for (let i = 0; i < result.rows.length; i++) {
      const car = result.rows.item(i);
      car.photos = JSON.parse(car.photos);
      favorites.push(car);
    }
    return favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const isFavorite = async (userId, carId) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM favoris WHERE user_id = ? AND voiture_id = ?',
      [userId, carId]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking favorite:', error);
    throw error;
  }
};