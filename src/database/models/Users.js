import { getDBConnection } from '../db';

export const createUser = async (userData) => {
  const db = await getDBConnection();
  const { nom, prenom, email, telephone, cin, mot_de_passe } = userData;
  
  try {
    const [result] = await db.executeSql(
      `INSERT INTO users (nom, prenom, email, telephone, cin, mot_de_passe) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, prenom, email, telephone, cin, mot_de_passe]
    );
    
    return { id: result.insertId, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  const db = await getDBConnection();
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  try {
    await db.executeSql(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    
    return await getUserById(id);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};