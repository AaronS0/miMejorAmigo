import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { uploadMascotaPhoto } from '../../services/storageService';

export default function MascotaDetalle() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [mascota, setMascota] = useState<any>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    try {
      const raw = params?.data as string | undefined;
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        setMascota(parsed);
        // Cargar foto si existe (desde Firebase URL o local)
        if (parsed.fotoUrl) {
          setFotoUri(parsed.fotoUrl);
        } else if (parsed.fotoUri) {
          setFotoUri(parsed.fotoUri);
        }
      }
    } catch (e) {
      console.error('Error parsing mascota:', e);
    }
  }, [params]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && mascota?.id) {
        setUploading(true);
        const selectedUri = result.assets[0].uri;
        
        // Subir a Firebase Storage
        const uploadResult = await uploadMascotaPhoto(selectedUri, mascota.id);
        
        if (uploadResult.success && uploadResult.url) {
          setFotoUri(uploadResult.url);
          setMascota({ ...mascota, fotoUrl: uploadResult.url });
          Alert.alert('Éxito', 'Foto guardada correctamente en la nube');
        } else {
          Alert.alert('Error', uploadResult.error || 'No se pudo guardar la foto');
        }
        
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
      console.error(error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && mascota?.id) {
        setUploading(true);
        const selectedUri = result.assets[0].uri;
        
        // Subir a Firebase Storage
        const uploadResult = await uploadMascotaPhoto(selectedUri, mascota.id);
        
        if (uploadResult.success && uploadResult.url) {
          setFotoUri(uploadResult.url);
          setMascota({ ...mascota, fotoUrl: uploadResult.url });
          Alert.alert('Éxito', 'Foto guardada correctamente en la nube');
        } else {
          Alert.alert('Error', uploadResult.error || 'No se pudo guardar la foto');
        }
        
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'No se pudo tomar la foto');
      console.error(error);
    }
  };

  if (!mascota) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Datos de la mascota no disponibles.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="chevron-left" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>{mascota.nombre}</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Photo Section */}
      <View style={styles.photoSection}>
        {fotoUri ? (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: fotoUri }}
              style={styles.photo}
            />
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={pickImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <FontAwesome5 name="camera" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <FontAwesome5 name={mascota.tipo === 'Gato' ? 'cat' : 'dog'} size={60} color="#D9A05B" />
            <Text style={styles.placeholderText}>Sin foto</Text>
          </View>
        )}

        {!fotoUri && (
          <View style={styles.photoActions}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              disabled={uploading}
            >
              <FontAwesome5 name="camera" size={18} color="white" />
              <Text style={styles.photoButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={pickImage}
              disabled={uploading}
            >
              <FontAwesome5 name="image" size={18} color="white" />
              <Text style={styles.photoButtonText}>Galería</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <View style={styles.infoGroup}>
          <FontAwesome5 name={mascota.tipo === 'Gato' ? 'cat' : 'dog'} size={16} color="#4ECDC4" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Tipo</Text>
            <Text style={styles.value}>{mascota.tipo}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGroup}>
          <FontAwesome5 name="birthday-cake" size={16} color="#4ECDC4" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Edad</Text>
            <Text style={styles.value}>{mascota.edad} años</Text>
          </View>
        </View>

        {mascota.comportamientos && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoGroup}>
              <FontAwesome5 name="heart" size={16} color="#4ECDC4" />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Comportamientos</Text>
                <Text style={styles.value}>{String(mascota.comportamientos)}</Text>
              </View>
            </View>
          </>
        )}

        {mascota.fechaRegistro && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoGroup}>
              <FontAwesome5 name="calendar" size={16} color="#4ECDC4" />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Registrada</Text>
                <Text style={styles.value}>
                  {new Date(mascota.fechaRegistro?.seconds ? mascota.fechaRegistro.seconds * 1000 : mascota.fechaRegistro).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#4ECDC4" />
          <Text style={styles.actionButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  photoSection: {
    marginBottom: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#4ECDC4',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  photoPlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    color: '#7F8C8D',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: '#2C3E50',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#F0F8F7',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 14,
  },
  info: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: '#D9A05B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backText: {
    color: '#FFF',
    fontWeight: '700',
  },
  spacing: {
    height: 20,
  },
});
