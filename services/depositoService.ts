import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Estado de un depósito de garantía
 * - reservado: Galletas bloqueadas para una reserva pendiente
 * - en_transito: Servicio en progreso
 * - completado: Servicio finalizado, transacción completada
 * - devuelto: Reserva cancelada, galletas devueltas
 */
export type EstadoDeposito = 'reservado' | 'en_transito' | 'completado' | 'devuelto';

export interface DepositoGarantia {
  id?: string;
  idUsuario: string;
  idReserva: string;
  monto: number;
  estado: EstadoDeposito;
  fechaCreacion: string;
  fechaActualizacion: string;
  razon: string; // "reserva_paseo", "reserva_guarderia", etc.
}

export interface SaldoDetalado {
  saldoTotal: number;
  disponible: number;
  reservado: number;
}

/**
 * Obtiene el saldo detallado del usuario
 * saldoTotal = disponible + reservado
 */
export async function obtenerSaldoDetallado(userId: string): Promise<SaldoDetalado> {
  try {
    // Obtener saldo total del usuario
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();
    const saldoTotal = userData?.saldoGalletas || 0;

    // Obtener suma de depósitos reservados del usuario
    const depositosRef = collection(db, 'usuarios', userId, 'depositos');
    const depositosDbRef = collection(db, 'depositos');
    
    // Acceder a depositos como colección global de referencia
    let mtoReservado = 0;
    
    // Alternativa: si hay una colección global de depositos
    // const querySnapshot = await getDocs(
    //   query(depositosDbRef, where('idUsuario', '==', userId), where('estado', '==', 'reservado'))
    // );
    // querySnapshot.forEach(docSnap => {
    //   mtoReservado += docSnap.data().monto;
    // });

    // Por ahora, asumimos que el campo saldoGalletas es el saldo disponible
    const disponible = saldoTotal - mtoReservado;

    return {
      saldoTotal,
      disponible: Math.max(0, disponible),
      reservado: mtoReservado,
    };
  } catch (error) {
    console.error('Error obteniendo saldo detallado:', error);
    return {
      saldoTotal: 0,
      disponible: 0,
      reservado: 0,
    };
  }
}

/**
 * Crea un depósito de garantía cuando se hace una reserva
 * Bloquea las galletas para asegurar el pago
 */
export async function crearDepositoGarantia(
  userId: string,
  reservaId: string,
  monto: number,
  razon: string
): Promise<{ success: boolean; depositoId?: string; mensaje: string }> {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();
    const saldoActual = userData?.saldoGalletas || 0;

    // Validar que el usuario tenga saldo suficiente
    if (saldoActual < monto) {
      return {
        success: false,
        mensaje: `Saldo insuficiente. Necesitas ${monto} galletas pero tienes ${saldoActual}`,
      };
    }

    // Restar las galletas del saldo disponible
    const nuevoSaldo = saldoActual - monto;
    await updateDoc(doc(db, 'usuarios', userId), {
      saldoGalletas: nuevoSaldo,
    });

    // Crear documento de depósito (para auditoría)
    const depositoData: DepositoGarantia = {
      idUsuario: userId,
      idReserva: reservaId,
      monto,
      estado: 'reservado',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      razon,
    };

    const depositosRef = collection(db, 'depositos');
    const depositoDoc = await addDoc(depositosRef, depositoData);

    // Agregar transacción de bloqueo
    const transaccionesRef = collection(db, 'usuarios', userId, 'transacciones');
    await addDoc(transaccionesRef, {
      tipo: 'BLOQUEO',
      monto,
      descripcion: `Depósito de garantía para ${razon}`,
      idReserva: reservaId,
      idDeposito: depositoDoc.id,
      fecha: new Date().toISOString(),
      saldoAntes: saldoActual,
      saldoDespues: nuevoSaldo,
    });

    return {
      success: true,
      depositoId: depositoDoc.id,
      mensaje: 'Depósito de garantía creado exitosamente',
    };
  } catch (error) {
    console.error('Error creando depósito:', error);
    return {
      success: false,
      mensaje: 'Error al crear el depósito de garantía',
    };
  }
}

/**
 * Libera el depósito y finaliza la transacción
 * Se llama cuando el servicio se completa exitosamente
 */
export async function liberarDeposito(
  userId: string,
  depositoId: string,
  reservaId: string
): Promise<{ success: boolean; mensaje: string }> {
  try {
    // Actualizar estado del depósito
    await updateDoc(doc(db, 'depositos', depositoId), {
      estado: 'completado' as EstadoDeposito,
      fechaActualizacion: new Date().toISOString(),
    });

    // Agregar transacción de liberación
    const transaccionesRef = collection(db, 'usuarios', userId, 'transacciones');
    await addDoc(transaccionesRef, {
      tipo: 'LIBERACION',
      descripcion: 'Depósito de garantía liberado - Servicio completado',
      idReserva: reservaId,
      idDeposito: depositoId,
      fecha: new Date().toISOString(),
    });

    return {
      success: true,
      mensaje: 'Depósito liberado',
    };
  } catch (error) {
    console.error('Error liberando depósito:', error);
    return {
      success: false,
      mensaje: 'Error al liberar el depósito',
    };
  }
}

/**
 * Devuelve el depósito si el usuario cancela la reserva
 * Restaura las galletas al saldo disponible
 */
export async function devolverDeposito(
  userId: string,
  depositoId: string,
  reservaId: string,
  monto: number
): Promise<{ success: boolean; mensaje: string }> {
  try {
    // Actualizar estado del depósito
    await updateDoc(doc(db, 'depositos', depositoId), {
      estado: 'devuelto' as EstadoDeposito,
      fechaActualizacion: new Date().toISOString(),
    });

    // Restaurar galletas al usuario
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();
    const saldoActual = userData?.saldoGalletas || 0;
    const nuevoSaldo = saldoActual + monto;

    await updateDoc(doc(db, 'usuarios', userId), {
      saldoGalletas: nuevoSaldo,
    });

    // Agregar transacción de devolución
    const transaccionesRef = collection(db, 'usuarios', userId, 'transacciones');
    await addDoc(transaccionesRef, {
      tipo: 'DEVOLUCION',
      monto,
      descripcion: 'Depósito de garantía devuelto - Reserva cancelada',
      idReserva: reservaId,
      idDeposito: depositoId,
      fecha: new Date().toISOString(),
      saldoAntes: saldoActual,
      saldoDespues: nuevoSaldo,
    });

    return {
      success: true,
      mensaje: `${monto} galletas devueltas a tu saldo`,
    };
  } catch (error) {
    console.error('Error devolviendo depósito:', error);
    return {
      success: false,
      mensaje: 'Error al devolver el depósito',
    };
  }
}

/**
 * Obtiene los depósitos activos del usuario
 */
export async function obtenerDepositosActivos(userId: string): Promise<DepositoGarantia[]> {
  try {
    const depositosRef = collection(db, 'depositos');
    // Nota: Esta sería una query real en una aplicación completa
    // Por ahora, retornamos un array vacío
    return [];
  } catch (error) {
    console.error('Error obteniendo depósitos:', error);
    return [];
  }
}
