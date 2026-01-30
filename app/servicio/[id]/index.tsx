import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

interface Mascota {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
  tamaño: string;
}

interface Usuario {
  uid: string;
  nombre: string;
  ciudad: string;
  latitud?: number;
  longitud?: number;
}

export default function ServicioSeleccionarMascota() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    cargarMascotas();
    obtenerUbicacionUsuario();
  }, []);

  const cargarMascotas = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const mascotasRef = collection(db, 'mascotas');
      const q = query(mascotasRef, where('idDueno', '==', userId));
      const querySnapshot = await getDocs(q);

      const mascotasData: Mascota[] = [];
      querySnapshot.forEach((doc) => {
        mascotasData.push({
          id: doc.id,
          nombre: doc.data().nombre,
          tipo: doc.data().tipo,
          raza: doc.data().raza,
          tamaño: doc.data().tamaño,
        });
      });

      setMascotas(mascotasData);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      setLoading(false);
    }
  };

  const obtenerUbicacionUsuario = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'usuarios', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Simulamos coordenadas (en producción usar Expo Location)
        setUserLocation({
          lat: userData.latitud || -33.8688,
          lon: userData.longitud || -51.2093,
        });
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  };

  const handleContinuar = () => {
    if (!selectedMascota) {
      Alert.alert('Error', 'Por favor selecciona una mascota');
      return;
    }

    const mascotaSeleccionada = mascotas.find((m) => m.id === selectedMascota);
    router.push({
      pathname: '/servicio/[id]/calendario',
      params: {
        id,
        mascotaId: selectedMascota,
        mascotaNombre: mascotaSeleccionada?.nombre,
        mascotaTamaño: mascotaSeleccionada?.tamaño,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona Mascota</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>¿Para cuál mascota?</Text>
        <Text style={styles.description}>
          Selecciona la mascota que necesita este servicio
        </Text>

        {mascotas.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="paw" size={48} color="#B0BEC5" />
            <Text style={styles.emptyTitle}>Sin mascotas</Text>
            <Text style={styles.emptyText}>
              Necesitas registrar al menos una mascota
            </Text>
          </View>
        ) : (
          <View style={styles.mascotasList}>
            {mascotas.map((mascota) => (
              <TouchableOpacity
                key={mascota.id}
                style={[
                  styles.mascotaCard,
                  selectedMascota === mascota.id && styles.mascotaCardSelected,
                ]}
                onPress={() => setSelectedMascota(mascota.id)}
              >
                <View style={styles.mascotaIcon}>
                  <FontAwesome5
                    name={mascota.tipo === 'gato' ? 'cat' : 'dog'}
                    size={28}
                    color={selectedMascota === mascota.id ? '#4ECDC4' : '#666'}
                  />
                </View>
                <View style={styles.mascotaInfo}>
                  <Text style={styles.mascotaNombre}>{mascota.nombre}</Text>
                  <Text style={styles.mascotaRaza}>
                    {mascota.raza} • {mascota.tamaño}
                  </Text>
                </View>
                {selectedMascota === mascota.id && (
                  <FontAwesome5 name="check-circle" size={24} color="#4ECDC4" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedMascota && styles.buttonDisabled]}
          onPress={handleContinuar}
          disabled={!selectedMascota}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  mascotasList: {
    gap: 12,
  },
  mascotaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  mascotaCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FFFE',
  },
  mascotaIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotaInfo: {
    flex: 1,
  },
  mascotaNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  mascotaRaza: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
