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
import { auth, db } from '../../firebaseConfig';

const SERVICIOS = [
  { id: 'paseo', nombre: 'Paseo', icon: 'paw', color: '#FF6B6B' },
  { id: 'guarderia', nombre: 'Guardería', icon: 'house', color: '#4ECDC4' },
  { id: 'banio', nombre: 'Baño', icon: 'shower', color: '#FFE66D' },
  { id: 'pareja', nombre: 'Pareja', icon: 'heart', color: '#FF85A2' },
  { id: 'entrenamiento', nombre: 'Entrenamiento', icon: 'graduation-cap', color: '#A8E6CF' },
  { id: 'veterinario', nombre: 'Veterinario', icon: 'stethoscope', color: '#B19CD9' },
];

export default function HomeScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const navigation = useNavigation();

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con menú hamburguesa */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            ¡Hola, {userData?.nombre || 'Usuario'}!
          </Text>
          <Text style={styles.headerSubtitle}>
            ¿Qué necesita tu mascota hoy?
          </Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesome5 name="bars" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de Saldo */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceContent}>
            <FontAwesome5 name="coins" size={32} color="#FFD700" />
            <View style={styles.balanceText}>
              <Text style={styles.balanceLabel}>Saldo de Galletas</Text>
              <Text style={styles.balanceAmount}>
                {userData?.saldoGalletas || 0} galletas
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.rechargeButton}>
            <Text style={styles.rechargeButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        {/* Servicios Grid */}
        <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
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
        <Text style={styles.sectionTitle}>Próximas Reservas</Text>
        <View style={styles.upcomingSection}>
          <View style={styles.noUpcoming}>
            <FontAwesome5 name="calendar-check" size={40} color="#BDC3C7" />
            <Text style={styles.noUpcomingText}>
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
    paddingVertical: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: 'white',
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
    color: '#7F8C8D',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
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
    color: '#2C3E50',
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
    backgroundColor: 'white',
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
    color: '#7F8C8D',
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
