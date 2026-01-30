import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

export default function PerfilScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <Text style={styles.headerSubtitle}>Información personal</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesome5 name="bars" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user-circle" size={80} color="#4ECDC4" />
          </View>
          <Text style={styles.nombre}>{userData?.nombre || 'Usuario'}</Text>
          <Text style={styles.rol}>
            {userData?.rol === 'prestador' ? 'Prestador de Servicios' : 'Cliente'}
          </Text>
        </View>

        {/* Información Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>

          <View style={styles.infoItem}>
            <FontAwesome5 name="envelope" size={18} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData?.email || 'No disponible'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome5 name="phone" size={18} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{userData?.telefonoContacto || 'No disponible'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome5 name="map-marker-alt" size={18} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Dirección</Text>
              <Text style={styles.infoValue}>{userData?.direccion || 'No disponible'}</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <FontAwesome5 name="star" size={24} color="#FFD700" />
              <Text style={styles.statValue}>
                {userData?.calificacionPromedio || '5.0'}
              </Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>

            <View style={styles.statCard}>
              <FontAwesome5 name="calendar-check" size={24} color="#27AE60" />
              <Text style={styles.statValue}>
                {userData?.totalServiciosRealizados || '0'}
              </Text>
              <Text style={styles.statLabel}>Servicios</Text>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome5 name="edit" size={16} color="#4ECDC4" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <FontAwesome5 name="lock" size={16} color="#7F8C8D" />
            <Text style={styles.secondaryButtonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  avatar: {
    marginBottom: 12,
  },
  nombre: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  rol: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#7F8C8D',
    fontWeight: '600',
    fontSize: 14,
  },
});
