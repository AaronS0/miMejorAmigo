import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { auth, db } from '../../firebaseConfig';
import { obtenerServicioActivo, ServicioActivo } from '../../services/trackingService';
import DashboardServicioActivo from '../servicio/[id]/dashboard-activo';

const SERVICIOS = [
  { id: 'paseo', nombre: 'Paseo', icon: 'paw', color: '#FF6B6B' },
  { id: 'guarderia', nombre: 'Guardería', icon: 'home', color: '#4ECDC4' },
  { id: 'banio', nombre: 'Baño', icon: 'shower', color: '#FFE66D' },
  { id: 'pareja', nombre: 'Pareja', icon: 'heart', color: '#FF85A2' },
  { id: 'entrenamiento', nombre: 'Entrenamiento', icon: 'graduation-cap', color: '#A8E6CF' },
  { id: 'veterinario', nombre: 'Veterinario', icon: 'stethoscope', color: '#B19CD9' },
];

export default function HomeScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [servicioActivo, setServicioActivo] = useState<ServicioActivo | null>(null);
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    let active = true;
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user && active) {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userInfo = docSnap.data();
            setUserData(userInfo);
          }

          // Buscar si hay servicio activo
          const servicio = await obtenerServicioActivo(user.uid);
          if (servicio) {
            setServicioActivo(servicio);
            setMostrarDashboard(true);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigation]);

  const handleServicePress = (serviceId: string) => {
    router.push(`/servicio/${serviceId}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  // Si hay servicio activo, mostrar dashboard
  if (mostrarDashboard && servicioActivo) {
    return (
      <DashboardServicioActivo
        onClose={() => setMostrarDashboard(false)}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header con menú hamburguesa */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            ¡Hola, {userData?.nombre || 'Usuario'}!
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            ¿Qué necesita tu mascota hoy?
          </Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesome5 name="bars" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de Saldo */}
        <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
          <View style={styles.balanceContent}>
            <FontAwesome5 name="coins" size={32} color="#FFD700" />
            <View style={styles.balanceText}>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Saldo de Galletas</Text>
              <Text style={[styles.balanceAmount, { color: colors.text }]}>
                {userData?.saldoGalletas || 0} galletas
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.rechargeButton}>
            <Text style={styles.rechargeButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        {/* Servicios Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicios Disponibles</Text>
        <View style={styles.serviciosGrid}>
          {SERVICIOS.map((servicio) => (
            <TouchableOpacity
              key={servicio.id}
              style={[styles.servicioCard, { backgroundColor: servicio.color }]}
              onPress={() => handleServicePress(servicio.id)}
            >
              <FontAwesome5 name={servicio.icon} size={32} color="white" />
              <Text style={styles.servicioNombre}>{servicio.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reservas Próximas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximas Reservas</Text>
        <View style={[styles.upcomingSection, { backgroundColor: colors.surface }]}>
          <View style={styles.noUpcoming}>
            <FontAwesome5 name="calendar-check" size={40} color="#BDC3C7" />
            <Text style={[styles.noUpcomingText, { color: colors.textSecondary }]}>
              No tienes reservas próximas
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleServicePress('paseo')}
            >
              <Text style={styles.bookButtonText}>Agendar Servicio</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceText: {
    gap: 2,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  rechargeButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rechargeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  serviciosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  servicioCard: {
    width: '48%',
    paddingVertical: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  servicioNombre: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  upcomingSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  noUpcoming: {
    alignItems: 'center',
    gap: 12,
  },
  noUpcomingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
});
