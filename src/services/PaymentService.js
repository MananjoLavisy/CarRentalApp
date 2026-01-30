import { getDBConnection } from '../database/db';

export const createPayment = async (paymentData) => {
  const db = await getDBConnection();
  const { reservation_id, montant, methode_paiement } = paymentData;

  try {
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const result = await db.runAsync(
      `INSERT INTO paiements (reservation_id, montant, methode_paiement, statut, reference_transaction)
       VALUES (?, ?, ?, 'validé', ?)`,
      [reservation_id, montant, methode_paiement, reference]
    );

    return {
      success: true,
      payment: {
        id: result.lastInsertRowId,
        reference,
        montant,
        methode_paiement,
        statut: 'validé'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getPaymentByReservation = async (reservationId) => {
  const db = await getDBConnection();

  try {
    const payment = await db.getFirstAsync(
      'SELECT * FROM paiements WHERE reservation_id = ?',
      [reservationId]
    );

    return payment || null;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw error;
  }
};
