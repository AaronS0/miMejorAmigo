import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '@/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

interface PrestadorDetalle {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  foto?: string;
  puntuacionPromedio: number;
  serviciosCompletados: number;
  especialidades: string;
  yearExperiencia: number;
  aceptaGrandes: boolean;
  aceptaPequeños: boolean;
  aceptaGatos: boolean;
  verificado: boolean;
  ciudad: string;
  distancia?: number;
}

export default function ServicioPerfil() {
  const router = useRouter();
  const {
    id,
    mascotaId,
    mascotaNombre,
    mascotaTamaño,
    fecha,
    hora,
    prestadorId,
    prestadorNombre,
    precio,
  } = useLocalSearchParams();

  const [prestador, setPrestador] = useState<PrestadorDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPerfilPrestador();
  }, []);

  const cargarPerfilPrestador = async () => {
    try {
      const docRef = doc(db, 'usuarios', prestadorId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPrestador({
          id: docSnap.id,
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          foto: data.foto,
          puntuacionPromedio: data.puntuacionPromedio || 5.0,
          serviciosCompletados: data.serviciosCompletados || 0,
          especialidades: data.especialidades,
          yearExperiencia: data.yearExperiencia,
          aceptaGrandes: data.aceptaGrandes,
          aceptaPequeños: data.aceptaPequeños,
          aceptaGatos: data.aceptaGatos,
          verificado: data.verificado,
          ciudad: data.ciudad,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil del prestador');
      setLoading(false);
    }
  };

  const handleReservar = () => {
    if (!prestador) return;

    router.push({
      pathname: '/servicio/[id]/confirmacion',
      params: {
        id,
        mascotaId,
        mascotaNombre,
        mascotaTamaño,
        fecha,
        hora,
        prestadorId,
        prestadorNombre: prestador.nombre,
        precio,
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

  if (!prestador) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el prestador</Text>
      </View>
    );
  }

  const getAceptaMascotas = () => {
    const tipos = [];
    if (prestador.aceptaGrandes) tipos.push('Perros grandes');
    if (prestador.aceptaPequeños) tipos.push('Perros pequeños');
    if (prestador.aceptaGatos) tipos.push('Gatos');
    return tipos.join(' • ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header con foto */}
        <View style={styles.profileHeader}>
          {prestador.foto ? (
            <Image
              source={{ uri: prestador.foto }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <FontAwesome5 name="user-circle" size={80} color="#4ECDC4" />
            </View>
          )}

          {prestador.verificado && (
            <View style={styles.verificadoBadge}>
              <FontAwesome5 name="check-circle" size={24} color="#4ECDC4" />
            </View>
          )}
        </View>

        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.nombre}>{prestador.nombre}</Text>
          <Text style={styles.ciudad}>📍 {prestador.ciudad}</Text>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingBox}>
              <FontAwesome5 name="star" size={14} color="#FFB800" solid />
              <Text style={styles.ratingValue}>
                {prestador.puntuacionPromedio.toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({prestador.serviciosCompletados})
              </Text>
            </View>
          </View>
        </View>

        {/* Experiencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia</Text>
          <View style={styles.infoRow}>
            <FontAwesome5 name="briefcase" size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>
              {prestador.yearExperiencia} años de experiencia
            </Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="check-circle" size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>
              {prestador.serviciosCompletados} servicios realizados
            </Text>
          </View>
        </View>

        {/* Especialidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <Text style={styles.especialidadesText}>
            {prestador.especialidades}
          </Text>
        </View>

        {/* Tipos de mascotas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atiende</Text>
          <Text style={styles.mascotasText}>{getAceptaMascotas()}</Text>
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <View style={styles.contactRow}>
            <FontAwesome5 name="envelope" size={16} color="#4ECDC4" />
            <Text style={styles.contactText}>{prestador.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome5 name="phone" size={16} color="#4ECDC4" />
            <Text style={styles.contactText}>{prestador.telefono}</Text>
          </View>
        </View>

        {/* Resumen de la reserva */}
        <View style={styles.resumenSection}>
          <Text style={styles.sectionTitle}>Resumen de tu reserva</Text>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Mascota:</Text>
            <Text style={styles.resumenValue}>{mascotaNombre}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Fecha:</Text>
            <Text style={styles.resumenValue}>
              {new Date(fecha + 'T00:00').toLocaleDateString('es-ES')}
            </Text>
          </View>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Hora:</Text>
            <Text style={styles.resumenValue}>{hora}</Text>
          </View>
          <View style={styles.resumenDivider} />
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Total:</Text>
            <Text style={styles.resumenPrecio}>{precio} galletas</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonReservar} onPress={handleReservar}>
          <FontAwesome5 name="calendar-check" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Confirmar Reserva</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    flex: 1,
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FFFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificadoBadge: {
    position: 'absolute',
    bottom: 20,
    right: '20%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  nombre: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  ciudad: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FFFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFB800',
  },
  ratingCount: {
    fontSize: 12,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  especialidadesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  mascotasText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  resumenSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resumenLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  resumenValue: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '600',
  },
  resumenDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  resumenPrecio: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buttonReservar: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
