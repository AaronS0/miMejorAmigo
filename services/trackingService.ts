import * as Location from 'expo-location';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface ServicioActivo {
  id: string;
  idUsuario: string;
  idPrestador: string;
  idMascota: string;
  tipoServicio: string;
  estado: 'en_progreso';
  fecha: string;
  hora: string;
  costoTotal: number;
  createdAt: string;
  fotosServicio: string[];
  videosServicio: string[];
  ubicacionPrestador?: {
    lat: number;
    lon: number;
    timestamp: string;
  };
  nombrePrestador?: string;
  nombreMascota?: string;
}

export interface FotoServicio {
  id: string;
  url: string;
  timestamp: string;
  descripcion?: string;
  prestadorId: string;
}

export interface UbicacionPrestador {
  lat: number;
  lon: number;
  timestamp: string;
  accuracy?: number;
}

/**
 * Obtiene el servicio activo del usuario (cliente)
 * Si hay un servicio en_progreso, retorna sus detalles
 */
export async function obtenerServicioActivo(userId: string): Promise<ServicioActivo | null> {
  try {
    const reservasRef = collection(db, 'reservas');
    const q = query(
      reservasRef,
      where('idUsuario', '==', userId),
      where('estado', '==', 'en_progreso')
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    const reserva = doc.data();

    // Obtener datos del prestador
    const prestadorDoc = await getDoc(doc(db, 'usuarios', reserva.idPrestador));
    const prestadorData = prestadorDoc.data();

    // Obtener datos de la mascota
    const mascotaDoc = await getDoc(doc(db, 'mascotas', reserva.idMascota));
    const mascotaData = mascotaDoc.data();

    return {
      id: doc.id,
      idUsuario: reserva.idUsuario,
      idPrestador: reserva.idPrestador,
      idMascota: reserva.idMascota,
      tipoServicio: reserva.tipoServicio,
      estado: reserva.estado,
      fecha: reserva.fecha,
      hora: reserva.hora,
      costoTotal: reserva.costoTotal,
      createdAt: reserva.createdAt,
      fotosServicio: reserva.fotosServicio || [],
      videosServicio: reserva.videosServicio || [],
      ubicacionPrestador: reserva.ubicacionPrestador,
      nombrePrestador: prestadorData?.nombre,
      nombreMascota: mascotaData?.nombre,
    };
  } catch (error) {
    console.error('Error obteniendo servicio activo:', error);
    return null;
  }
}

/**
 * Subscribe a cambios en servicio activo (para actualizaciones en tiempo real)
 */
export function subscribeToServicioActivo(
  userId: string,
  callback: (servicio: ServicioActivo | null) => void
): () => void {
  try {
    const reservasRef = collection(db, 'reservas');
    const q = query(
      reservasRef,
      where('idUsuario', '==', userId),
      where('estado', '==', 'en_progreso')
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(null);
        return;
      }

      const doc = querySnapshot.docs[0];
      const reserva = doc.data();

      // Obtener datos actualizados del prestador y mascota
      const prestadorDoc = await getDoc(doc(db, 'usuarios', reserva.idPrestador));
      const prestadorData = prestadorDoc.data();

      const mascotaDoc = await getDoc(doc(db, 'mascotas', reserva.idMascota));
      const mascotaData = mascotaDoc.data();

      callback({
        id: doc.id,
        idUsuario: reserva.idUsuario,
        idPrestador: reserva.idPrestador,
        idMascota: reserva.idMascota,
        tipoServicio: reserva.tipoServicio,
        estado: reserva.estado,
        fecha: reserva.fecha,
        hora: reserva.hora,
        costoTotal: reserva.costoTotal,
        createdAt: reserva.createdAt,
        fotosServicio: reserva.fotosServicio || [],
        videosServicio: reserva.videosServicio || [],
        ubicacionPrestador: reserva.ubicacionPrestador,
        nombrePrestador: prestadorData?.nombre,
        nombreMascota: mascotaData?.nombre,
      });
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to servicio activo:', error);
    return () => {};
  }
}

/**
 * Obtiene las fotos subidas durante el servicio
 */
export async function obtenerFotosServicio(
  reservaId: string
): Promise<FotoServicio[]> {
  try {
    // Las fotos se almacenan en un subcollection de la reserva
    const fotosRef = collection(db, 'reservas', reservaId, 'fotos');
    const querySnapshot = await getDocs(fotosRef);

    const fotos: FotoServicio[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fotos.push({
        id: doc.id,
        url: data.url,
        timestamp: data.timestamp,
        descripcion: data.descripcion,
        prestadorId: data.prestadorId,
      });
    });

    // Ordenar por timestamp descendente (más recientes primero)
    return fotos.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error obteniendo fotos:', error);
    return [];
  }
}

/**
 * Subscribe a cambios en fotos (tiempo real)
 */
export function subscribeToFotosServicio(
  reservaId: string,
  callback: (fotos: FotoServicio[]) => void
): () => void {
  try {
    const fotosRef = collection(db, 'reservas', reservaId, 'fotos');

    const unsubscribe = onSnapshot(fotosRef, (querySnapshot) => {
      const fotos: FotoServicio[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fotos.push({
          id: doc.id,
          url: data.url,
          timestamp: data.timestamp,
          descripcion: data.descripcion,
          prestadorId: data.prestadorId,
        });
      });

      // Ordenar por timestamp descendente
      const sorted = fotos.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      callback(sorted);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to fotos:', error);
    return () => {};
  }
}

/**
 * Actualiza la ubicación del prestador en tiempo real
 * Llamado periódicamente por el prestador durante el servicio
 */
export async function actualizarUbicacionPrestador(
  reservaId: string,
  ubicacion: UbicacionPrestador
): Promise<boolean> {
  try {
    const reservaRef = doc(db, 'reservas', reservaId);
    await updateDoc(reservaRef, {
      ubicacionPrestador: {
        lat: ubicacion.lat,
        lon: ubicacion.lon,
        timestamp: ubicacion.timestamp,
        accuracy: ubicacion.accuracy,
      },
      ultimaActualizacionUbicacion: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error actualizando ubicación:', error);
    return false;
  }
}

/**
 * Obtiene la ubicación actual del dispositivo
 */
export async function obtenerUbicacionActual(): Promise<UbicacionPrestador | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      timestamp: new Date().toISOString(),
      accuracy: location.coords.accuracy || undefined,
    };
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    return null;
  }
}

/**
 * Calcula distancia entre el cliente y el prestador
 */
export function calcularDistancia(
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
 * Finaliza el servicio (cambiar a completado)
 */
export async function finalizarServicio(reservaId: string): Promise<boolean> {
  try {
    const reservaRef = doc(db, 'reservas', reservaId);
    await updateDoc(reservaRef, {
      estado: 'completada',
      fechaFinalizacion: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error finalizando servicio:', error);
    return false;
  }
}

/**
 * Obtiene los servicios activos para un prestador
 * (para que el prestador vea qué servicios está haciendo)
 */
export async function obtenerServiciosActivosPrestador(
  prestadorId: string
): Promise<ServicioActivo[]> {
  try {
    const reservasRef = collection(db, 'reservas');
    const q = query(
      reservasRef,
      where('idPrestador', '==', prestadorId),
      where('estado', '==', 'en_progreso')
    );

    const querySnapshot = await getDocs(q);
    const servicios: ServicioActivo[] = [];

    for (const doc of querySnapshot.docs) {
      const reserva = doc.data();

      // Obtener datos de mascota y cliente
      const mascotaDoc = await getDoc(doc(db, 'mascotas', reserva.idMascota));
      const mascotaData = mascotaDoc.data();

      const clienteDoc = await getDoc(doc(db, 'usuarios', reserva.idUsuario));
      const clienteData = clienteDoc.data();

      servicios.push({
        id: doc.id,
        idUsuario: reserva.idUsuario,
        idPrestador: reserva.idPrestador,
        idMascota: reserva.idMascota,
        tipoServicio: reserva.tipoServicio,
        estado: reserva.estado,
        fecha: reserva.fecha,
        hora: reserva.hora,
        costoTotal: reserva.costoTotal,
        createdAt: reserva.createdAt,
        fotosServicio: reserva.fotosServicio || [],
        videosServicio: reserva.videosServicio || [],
        ubicacionPrestador: reserva.ubicacionPrestador,
        nombrePrestador: clienteData?.nombre, // Cliente desde perspectiva prestador
        nombreMascota: mascotaData?.nombre,
      });
    }

    return servicios;
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return [];
  }
}
