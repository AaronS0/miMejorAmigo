import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export interface MisionDisponible {
  id: string;
  idUsuario: string;
  nombreCliente: string;
  idMascota: string;
  nombreMascota: string;
  tipoMascota: string; // perro, gato, etc.
  tamanioMascota: string; // pequeño, mediano, grande
  tipoServicio: string;
  fecha: string;
  hora: string;
  ciudad: string;
  latitud?: number;
  longitud?: number;
  costoTotal: number;
  distancia?: number; // En km, calculada después
  calificacionCliente?: number;
}

/**
 * Calcula distancia entre dos puntos (Haversine)
 */
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
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
 * Obtiene las misiones disponibles (reservas en estado "buscando")
 * Filtra por:
 * - Tipo de servicio que el prestador ofrece
 * - Proximidad geográfica
 * - Características del animal (si el prestador acepta)
 */
export async function obtenerMisionesDisponibles(
  filtros?: {
    maxDistancia?: number;
    tiposServicio?: string[];
    minPrecio?: number;
    maxPrecio?: number;
  }
): Promise<MisionDisponible[]> {
  try {
    const prestadorId = auth.currentUser?.uid;
    if (!prestadorId) throw new Error('Usuario no autenticado');

    // Obtener datos del prestador (ubicación, especialidades, etc)
    const prestadorDoc = await getDoc(doc(db, 'usuarios', prestadorId));
    if (!prestadorDoc.exists()) return [];

    const prestadorData = prestadorDoc.data();
    const prestadorLat = prestadorData?.latitud;
    const prestadorLon = prestadorData?.longitud;
    const maxDist = filtros?.maxDistancia || 15; // Default 15 km

    // Obtener todas las reservas en estado "buscando"
    const reservasRef = collection(db, 'reservas');
    const q = query(reservasRef, where('estado', '==', 'buscando'));
    const querySnapshot = await getDocs(q);

    const misiones: MisionDisponible[] = [];

    for (const docSnap of querySnapshot.docs) {
      const reserva = docSnap.data();
      const reservaId = docSnap.id;

      // Filtrar por tipo de servicio si se especifica
      if (
        filtros?.tiposServicio &&
        !filtros.tiposServicio.includes(reserva.tipoServicio)
      ) {
        continue;
      }

      // Filtrar por precio
      if (filtros?.minPrecio && reserva.costoTotal < filtros.minPrecio) {
        continue;
      }
      if (filtros?.maxPrecio && reserva.costoTotal > filtros.maxPrecio) {
        continue;
      }

      // Obtener datos del usuario (cliente)
      const usuarioDoc = await getDoc(doc(db, 'usuarios', reserva.idUsuario));
      const usuarioData = usuarioDoc.data();

      // Obtener datos de la mascota
      const mascotaDoc = await getDoc(doc(db, 'mascotas', reserva.idMascota));
      const mascotaData = mascotaDoc.data();

      // Calcular distancia si ambas ubicaciones están disponibles
      let distancia: number | undefined;
      if (prestadorLat && prestadorLon && usuarioData?.latitud && usuarioData?.longitud) {
        distancia = calcularDistancia(
          prestadorLat,
          prestadorLon,
          usuarioData.latitud,
          usuarioData.longitud
        );

        // Filtrar por distancia máxima
        if (distancia > maxDist) continue;
      }

      // Validar que el prestador acepta este tipo de mascota
      const tipo = mascotaData?.tipo?.toLowerCase() || 'perro';
      if (tipo.includes('perro') && !prestadorData?.aceptaPerros) continue;
      if (tipo.includes('gato') && !prestadorData?.aceptaGatos) continue;
      if (
        !tipo.includes('perro') &&
        !tipo.includes('gato') &&
        !prestadorData?.aceptaOtros
      ) {
        continue;
      }

      // Validar tamaño de mascota
      const tamanio = mascotaData?.tamaño?.toLowerCase();
      if (tamanio?.includes('grande') && !prestadorData?.aceptaGrandes) {
        continue;
      }
      if (tamanio?.includes('pequeño') && !prestadorData?.aceptaPequeños) {
        continue;
      }

      misiones.push({
        id: reservaId,
        idUsuario: reserva.idUsuario,
        nombreCliente: usuarioData?.nombre || 'Cliente',
        idMascota: reserva.idMascota,
        nombreMascota: mascotaData?.nombre || 'Mascota',
        tipoMascota: tipo,
        tamanioMascota: tamanio || 'mediano',
        tipoServicio: reserva.tipoServicio,
        fecha: reserva.fecha,
        hora: reserva.hora,
        ciudad: usuarioData?.ciudad || 'Sin ubicación',
        latitud: usuarioData?.latitud,
        longitud: usuarioData?.longitud,
        costoTotal: reserva.costoTotal,
        distancia,
        calificacionCliente: usuarioData?.puntuacionPromedio,
      });
    }

    // Ordenar por distancia (cercanos primero)
    return misiones.sort((a, b) => (a.distancia || 999) - (b.distancia || 999));
  } catch (error) {
    console.error('Error obteniendo misiones:', error);
    return [];
  }
}

/**
 * Acepta una misión: asigna el prestador a la reserva
 * Cambia estado de "buscando" a "confirmada"
 */
export async function aceptarMision(reservaId: string): Promise<{
  success: boolean;
  mensaje: string;
}> {
  try {
    const prestadorId = auth.currentUser?.uid;
    if (!prestadorId) throw new Error('Usuario no autenticado');

    const reservaRef = doc(db, 'reservas', reservaId);

    // Actualizar la reserva
    await updateDoc(reservaRef, {
      idPrestador: prestadorId,
      estado: 'confirmada',
      fechaConfirmacion: new Date().toISOString(),
    });

    // Aquí se puede agregar lógica para notificar al cliente
    // Por ejemplo: enviar notificación push

    return {
      success: true,
      mensaje: 'Misión aceptada exitosamente',
    };
  } catch (error) {
    console.error('Error aceptando misión:', error);
    return {
      success: false,
      mensaje: 'No se pudo aceptar la misión',
    };
  }
}

/**
 * Rechaza una misión
 */
export async function rechazarMision(reservaId: string): Promise<{
  success: boolean;
  mensaje: string;
}> {
  try {
    // Simplemente no hacer nada - la reserva sigue disponible para otros prestadores
    // En futuro, se puede registrar el rechazo para análisis
    return {
      success: true,
      mensaje: 'Misión rechazada',
    };
  } catch (error) {
    console.error('Error rechazando misión:', error);
    return {
      success: false,
      mensaje: 'Error al rechazar la misión',
    };
  }
}

/**
 * Obtiene el detalle completo de una misión/reserva
 */
export async function obtenerDetallesMision(
  reservaId: string
): Promise<any | null> {
  try {
    const reservaDoc = await getDoc(doc(db, 'reservas', reservaId));
    if (!reservaDoc.exists()) return null;

    const reserva = reservaDoc.data();

    // Obtener datos del cliente
    const clienteDoc = await getDoc(doc(db, 'usuarios', reserva.idUsuario));
    const clienteData = clienteDoc.data();

    // Obtener datos de la mascota
    const mascotaDoc = await getDoc(doc(db, 'mascotas', reserva.idMascota));
    const mascotaData = mascotaDoc.data();

    return {
      ...reserva,
      id: reservaId,
      cliente: clienteData,
      mascota: mascotaData,
    };
  } catch (error) {
    console.error('Error obteniendo detalles:', error);
    return null;
  }
}
