import { FontAwesome5 } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { auth, db } from '../../firebaseConfig';

export default function PerfilScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const { colors } = useTheme();
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mi Perfil</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Información personal</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesome5 name="bars" size={24} color={colors.text} />
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
          <Text style={[styles.nombre, { color: colors.text }]}>{userData?.nombre || 'Usuario'}</Text>
          <Text style={[styles.rol, { color: colors.textSecondary }]}>
            {userData?.rol === 'prestador' ? 'Prestador de Servicios' : 'Cliente'}
          </Text>
        </View>

        {/* Información Contacto */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de Contacto</Text>

          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <FontAwesome5 name="envelope" size={18} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData?.email || 'No disponible'}</Text>
            </View>
          </View>

          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <FontAwesome5 name="phone" size={18} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Teléfono</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData?.telefonoContacto || 'No disponible'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome5 name="map-marker-alt" size={18} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Dirección</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userData?.direccion || 'No disponible'}</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Estadísticas</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.background }]}>
              <FontAwesome5 name="star" size={24} color="#FFD700" />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {userData?.calificacionPromedio || '5.0'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calificación</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.background }]}>
              <FontAwesome5 name="calendar-check" size={24} color="#27AE60" />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {userData?.totalServiciosRealizados || '0'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Servicios</Text>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome5 name="edit" size={16} color="white" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <FontAwesome5 name="lock" size={16} color={colors.textSecondary} />
            <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
    marginBottom: 4,
  },
  rol: {
    fontSize: 13,
    fontWeight: '500,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
