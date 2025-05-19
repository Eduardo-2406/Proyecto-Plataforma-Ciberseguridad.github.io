import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function generateInvitationCode(adminId, email, role) {
  try {
    // Generar un código único
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Crear el documento de invitación
    const invitationRef = await addDoc(collection(db, 'invitations'), {
      code,
      createdBy: adminId,
      email,
      role,
      createdAt: new Date().toISOString(),
      used: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expira en 7 días
    });

    return {
      code,
      id: invitationRef.id
    };
  } catch (error) {
    console.error('Error al generar código de invitación:', error);
    throw error;
  }
}

export async function generateMultipleInvitationCodes(adminId, emails, role) {
  const codes = [];
  for (const email of emails) {
    try {
      const { code, id } = await generateInvitationCode(adminId, email, role);
      codes.push({ email, code, id });
    } catch (error) {
      console.error(`Error al generar código para ${email}:`, error);
    }
  }
  return codes;
} 