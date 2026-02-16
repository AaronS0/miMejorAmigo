import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface HoraDisponible {
  hora: string;
  prestadoresDisponibles: number;
  disponible: boolean;
}

export default function ServicioHora() {
  const router = useRouter();
  const { id, mascotaId, mascotaNombre, mascotaTamaño, fecha } = useLocalSearchParams();
  const [selectedHora, setSelectedHora] = useState<string>('');
  const [horas, setHoras] = useState<HoraDisponible[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHorasDisponibles();
  }, []);

  const cargarHorasDisponibles = async () => {
    try {
      // Obtener todos los prestadores verificados
      const prestadoresRef = collection(db, 'usuarios');
      const q = query(
        prestadoresRef,
        where('rol', '==', 'prestador'),
        where('verificado', '==', true)
      );
      const querySnapshot = await getDocs(q);

      // Agenerar horas disponibles (9 AM a 7 PM)
      const horasDisponibles: HoraDisponible[] = [];
      const horasPorPrestador: { [key: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const prestador = doc.data();

        // Validar que el prestador acepta el tamaño
        const aceptaTamaño =
          (mascotaTamaño === 'grande' && prestador.aceptaGrandes) ||
          (mascotaTamaño === 'pequeño' && prestador.aceptaPequeños) ||
          (mascotaTamaño === 'mediano' && prestador.aceptaPequeños);

        if (!aceptaTamaño) return;

        // Validar día de semana
        const fechaObj = new Date(fecha + 'T00:00');
        const dayOfWeek = fechaObj.getDay();
        const esFin = dayOfWeek === 0 || dayOfWeek === 6;
        if (esFin && !prestador.disponibleFinesde) return;

        // Parsear horarios disponibles (ej: "09:00-17:00,19:00-21:00")
        const horariosStr = prestador.horarioDisponibilidad || '09:00-17:00';
        const rangos = horariosStr.split(',');

        rangos.forEach((rango) => {
          const [inicio, fin] = rango.trim().split('-');
          if (!inicio || !fin) return;

          const [hI] = inicio.split(':').map(Number);
          const [hF] = fin.split(':').map(Number);

          for (let h = hI; h < hF; h++) {
            const horaFormato = `${h.toString().padStart(2, '0')}:00`;
            horasPorPrestador[horaFormato] =
              (horasPorPrestador[horaFormato] || 0) + 1;
          }
        });
      });

      // Convertir a array de horas
      const horasArray = Object.entries(horasPorPrestador).map(
        ([hora, cantidad]) => ({
          hora,
          prestadoresDisponibles: cantidad,
          disponible: cantidad > 0,
        })
      );

      // Ordenar por hora
      horasArray.sort((a, b) => a.hora.localeCompare(b.hora));

      setHoras(horasArray);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando horas:', error);
      Alert.alert('Error', 'No se pudieron cargar las horas disponibles');
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    if (!selectedHora) {
      Alert.alert('Error', 'Por favor selecciona una hora');
      return;
    }

    router.push({
      pathname: '/servicio/[id]/prestadores',
      params: {
        id,
        mascotaId,
        mascotaNombre,
        mascotaTamaño,
        fecha,
        hora: selectedHora,
      },
    });
  };

  const renderHora = ({ item }: { item: HoraDisponible }) => (
    <TouchableOpacity
      style={[
        styles.horaCard,
        selectedHora === item.hora && styles.horaCardSelected,
        !item.disponible && styles.horaCardDisabled,
      ]}
      onPress={() => item.disponible && setSelectedHora(item.hora)}
      disabled={!item.disponible}
    >
      <View style={styles.horaContent}>
        <FontAwesome5
          name="clock"
          size={20}
          color={selectedHora === item.hora ? '#4ECDC4' : '#999'}
        />
        <Text
          style={[
            styles.horaText,
            selectedHora === item.hora && styles.horaTextSelected,
            !item.disponible && styles.horaTextDisabled,
          ]}
        >
          {item.hora}
        </Text>
      </View>
      <View style={styles.prestadoresInfo}>
        <Text style={styles.prestadoresText}>
          {item.prestadoresDisponibles} prestador
          {item.prestadoresDisponibles !== 1 ? 'es' : ''}
        </Text>
      </View>
      {selectedHora === item.hora && (
        <FontAwesome5 name="check-circle" size={20} color="#4ECDC4" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const fechaFormato = new Date(fecha + 'T00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona Hora</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.info}>
          <Text style={styles.subtitle}>Disponibilidad</Text>
          <Text style={styles.serviceInfo}>
            🐕 {mascotaNombre} • {fechaFormato.toUpperCase()}
          </Text>
        </View>

        <FlatList
          scrollEnabled={false}
          data={horas}
          renderItem={renderHora}
          keyExtractor={(item) => item.hora}
          contentContainerStyle={styles.horasList}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />

        {horas.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="clock" size={48} color="#B0BEC5" />
            <Text style={styles.emptyTitle}>Sin disponibilidad</Text>
            <Text style={styles.emptyText}>
              No hay horas disponibles para esta fecha
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedHora && styles.buttonDisabled]}
          onPress={handleContinuar}
          disabled={!selectedHora}
        >
          <Text style={styles.buttonText}>Ver Prestadores</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  info: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  serviceInfo: {
    fontSize: 14,
    color: '#666',
  },
  horasList: {
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  horaCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horaCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FFFE',
  },
  horaCardDisabled: {
    opacity: 0.5,
  },
  horaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  horaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  horaTextSelected: {
    color: '#4ECDC4',
  },
  horaTextDisabled: {
    color: '#999',
  },
  prestadoresInfo: {
    marginLeft: 8,
  },
  prestadoresText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
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
