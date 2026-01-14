import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db;

export const getDBConnection = async () => {
  if (db) {
    return db;
  }
  
  try {
    db = await SQLite.openDatabase({
      name: 'CarRentalDB.db',
      location: 'default',
    });
    console.log('Database opened successfully');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  if (db) {
    await db.close();
    console.log('Database closed');
    db = null;
  }
};