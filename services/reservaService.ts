import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export interface ReservaData {
  idUsuario: string;
  idPrestador?: string | null;
  idMascota: string;
  tipoServicio: string;
  estado: 'buscando' | 'confirmada' | 'en_progreso' | 'completada' | 'cancelada';
  fecha: string;
  hora: string;
  costoTotal: number;
  createdAt: string;
  fotosServicio: string[];
  videosServicio: string[];
  notasCliente?: string;
  ubicacionInicio?: string;
}

export interface PrestadorInfo {
  uid: string;
  nombre: string;
  latitud?: number;
  longitud?: number;
  radio?: number; // En km
  disponible: boolean;
  serviciosCompletados: number;
  puntuacionPromedio: number;
}

/**
 * Calcula la distancia entre dos puntos usando Haversine formula (en km)
 */
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Busca prestadores disponibles cercanos al usuario
 * Filtra por:
 * - Ubicación (dentro del radio de acción)
 * - Disponibilidad en la fecha/hora solicitada
 * - Estado verificado
 * - Rating > 4.0
 */
export async function buscarPrestadoresDisponibles(
  tipoServicio: string,
  userLocation: { lat: number; lon: number },
  estadoDisponibilidad: 'finde' | 'nocturno' | 'normal'
): Promise<PrestadorInfo[]> {
  try {
    // Consultar prestadores verificados
    const prestadoresRef = collection(db, 'usuarios');
    const q = query(
      prestadoresRef,
      where('rol', '==', 'prestador'),
      where('verificado', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const prestadoresDisponibles: PrestadorInfo[] = [];

    querySnapshot.forEach((docSnap) => {
      const prestador = docSnap.data();
      const prestadorId = docSnap.id;

      // Validar ubicación si existe
      if (prestador.latitud && prestador.longitud) {
        const distancia = calcularDistancia(
          userLocation.lat,
          userLocation.lon,
          prestador.latitud,
          prestador.longitud
        );

        const radioAccion = parseFloat(prestador.radioAccion) || 15; // Default 15 km
        if (distancia > radioAccion) return;
      }

      // Validar disponibilidad según estado
      if (estadoDisponibilidad === 'finde' && !prestador.disponibleFinesde) {
        return;
      }
      if (estadoDisponibilidad === 'nocturno' && !prestador.disponibleNocturno) {
        return;
      }

      // Validar calificación mínima
      const puntuacion = prestador.puntuacionPromedio || 5.0;
      if (puntuacion < 4.0) return;

      prestadoresDisponibles.push({
        uid: prestadorId,
        nombre: prestador.nombre,
        latitud: prestador.latitud,
        longitud: prestador.longitud,
        radio: radioAccion,
        disponible: true,
        serviciosCompletados: prestador.serviciosCompletados || 0,
        puntuacionPromedio: puntuacion,
      });
    });

    // Ordenar por calificación descendente
    return prestadoresDisponibles.sort(
      (a, b) => b.puntuacionPromedio - a.puntuacionPromedio
    );
  } catch (error) {
    console.error('Error buscando prestadores:', error);
    return [];
  }
}

/**
 * Crea una reserva con estado 'buscando' si no hay prestadores disponibles
 * O con prestador asignado si encuentra disponibles
 */
export async function crearReservaConBusqueda(
  mascotaId: string,
  tipoServicio: string,
  fecha: string,
  hora: string,
  costoTotal: number,
  userLocation?: { lat: number; lon: number }
): Promise<{
  success: boolean;
  reservaId: string | null;
  estado: 'buscando' | 'confirmada';
  prestadorAsignado?: PrestadorInfo | null;
  mensaje: string;
}> {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuario no autenticado');

    // Obtener datos del usuario (ubicación, saldo)
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();
    const saldoActual = userData?.saldoGalletas || 0;

    if (saldoActual < costoTotal) {
      return {
        success: false,
        reservaId: null,
        estado: 'buscando',
        mensaje: `Saldo insuficiente. Necesitas ${costoTotal} galletas pero tienes ${saldoActual}`,
      };
    }

    // Obtener ubicación si no se proporciona
    let location = userLocation;
    if (!location && userData?.latitud && userData?.longitud) {
      location = {
        lat: userData.latitud,
        lon: userData.longitud,
      };
    }

    // Determinar estado de disponibilidad (finde, nocturno, normal)
    const fecha_date = new Date(fecha);
    const dayOfWeek = fecha_date.getDay();
    const hora_num = parseInt(hora.split(':')[0]);
    const estadoDisponibilidad: 'finde' | 'nocturno' | 'normal' =
      dayOfWeek === 0 || dayOfWeek === 6
        ? 'finde'
        : hora_num >= 20 || hora_num < 6
          ? 'nocturno'
          : 'normal';

    // Buscar prestadores disponibles
    let prestadorAsignado: PrestadorInfo | null = null;
    if (location) {
      const prestadoresDisp = await buscarPrestadoresDisponibles(
        tipoServicio,
        location,
        estadoDisponibilidad
      );
      if (prestadoresDisp.length > 0) {
        prestadorAsignado = prestadoresDisp[0]; // Asignar el mejor calificado
      }
    }

    // Crear documento de reserva
    const reservasRef = collection(db, 'reservas');
    const reservaData: ReservaData = {
      idUsuario: userId,
      idPrestador: prestadorAsignado?.uid || null,
      idMascota: mascotaId,
      tipoServicio,
      estado: prestadorAsignado ? 'confirmada' : 'buscando',
      fecha,
      hora,
      costoTotal,
      createdAt: new Date().toISOString(),
      fotosServicio: [],
      videosServicio: [],
      ubicacionInicio: userData?.ciudad || 'No especificada',
    };

    const reservaDoc = await addDoc(reservasRef, reservaData);
    const reservaId = reservaDoc.id;

    // Crear depósito de garantía (bloquea las galletas)
    const depositoResult = await crearDepositoGarantia(
      userId,
      reservaId,
      costoTotal,
      `reserva_${tipoServicio}`
    );

    if (!depositoResult.success) {
      return {
        success: false,
        reservaId: null,
        estado: 'buscando',
        mensaje: depositoResult.mensaje,
      };
    }

    const mensaje = prestadorAsignado
      ? `Reserva confirmada con ${prestadorAsignado.nombre}`
      : 'Reserva creada. Buscando prestadores disponibles...';

    return {
      success: true,
      reservaId,
      estado: prestadorAsignado ? 'confirmada' : 'buscando',
      prestadorAsignado,
      mensaje,
    };
  } catch (error) {
    console.error('Error creando reserva:', error);
    return {
      success: false,
      reservaId: null,
      estado: 'buscando',
      mensaje: 'Error al crear la reserva',
    };
  }
}

/**
 * Obtiene los detalles de una reserva
 */
export async function obtenerReserva(reservaId: string) {
  try {
    const doc_ref = doc(db, 'reservas', reservaId);
    const docSnap = await getDoc(doc_ref);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    return null;
  }
}

/**
 * Actualiza el estado de una reserva
 */
export async function actualizarEstadoReserva(
  reservaId: string,
  nuevoEstado: 'buscando' | 'confirmada' | 'en_progreso' | 'completada' | 'cancelada'
) {
  try {
    const doc_ref = doc(db, 'reservas', reservaId);
    await updateDoc(doc_ref, {
      estado: nuevoEstado,
      ultimaActualizacion: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error actualizando estado:', error);
    return false;
  }
}
