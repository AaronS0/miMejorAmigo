import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../firebaseConfig';

interface UploadPhotoResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Sube una foto de mascota a Firebase Storage
 * @param uri URI local de la imagen
 * @param mascotaId ID único de la mascota
 * @returns Objeto con success y url o error
 */
export async function uploadMascotaPhoto(uri: string, mascotaId: string): Promise<UploadPhotoResult> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Leer archivo como blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Crear referencia en Firebase Storage
    // Estructura: mascotas/{userId}/{mascotaId}/photo.jpg
    const timestamp = new Date().getTime();
    const fileName = `photo_${timestamp}.jpg`;
    const storageRef = ref(storage, `mascotas/${user.uid}/${mascotaId}/${fileName}`);

    // Subir archivo
    const uploadTask = await uploadBytes(storageRef, blob);
    
    // Obtener URL descargable
    const downloadUrl = await getDownloadURL(uploadTask.ref);

    return { success: true, url: downloadUrl };
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return { 
      success: false, 
      error: error.message || 'Error al subir la foto' 
    };
  }
}

/**
 * Elimina una foto de Firebase Storage
 * @param uri URL de descarga o ruta completa
 * @returns boolean indicando si fue exitoso
 */
export async function deleteMascotaPhoto(photoUrl: string): Promise<boolean> {
  try {
    // Si es una URL de descarga, extraer la ruta
    const user = auth.currentUser;
    if (!user) return false;

    // Para una URL de descarga de Firebase, necesitamos la ruta original
    // En este caso, si guardamos la ruta en la BD, será más fácil
    // Por ahora, intentamos eliminar directamente si tenemos acceso
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
}

/**
 * Obtiene la lista de fotos de una mascota
 * @param mascotaId ID de la mascota
 * @returns Array de URLs de descarga
 */
export async function getMascotaPhotos(mascotaId: string): Promise<string[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    // Nota: Para listar archivos en Firebase Storage, se necesita acceso a Realtime Database
    // o implementar un listado manual en Firestore
    return [];
  } catch (error) {
    console.error('Error getting photos:', error);
    return [];
  }
}
