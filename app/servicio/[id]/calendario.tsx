import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface DisponibilidadPrestador {
  fecha: string;
  horasDisponibles: string[];
  prestadores: number;
}

export default function ServicioCalendario() {
  const router = useRouter();
  const { id, mascotaId, mascotaNombre, mascotaTamaño } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadPrestador[]>([]);

  useEffect(() => {
    cargarDisponibilidadesPrestadores();
  }, []);

  const cargarDisponibilidadesPrestadores = async () => {
    try {
      // Obtener todos los prestadores verificados
      const prestadoresRef = collection(db, 'usuarios');
      const q = query(
        prestadoresRef,
        where('rol', '==', 'prestador'),
        where('verificado', '==', true)
      );
      const querySnapshot = await getDocs(q);

      // Mapear próximos 30 días con disponibilidad
      const today = new Date();
      const marked: any = {};
      const disponibles: DisponibilidadPrestador[] = [];

      querySnapshot.forEach((doc) => {
        const prestador = doc.data();
        // Validar que el prestador acepta el tamaño de mascota
        const aceptaTamaño =
          (mascotaTamaño === 'grande' && prestador.aceptaGrandes) ||
          (mascotaTamaño === 'pequeño' && prestador.aceptaPequeños) ||
          (mascotaTamaño === 'mediano' && prestador.aceptaPequeños);

        if (!aceptaTamaño) return;

        // Procesar horario disponibilidad (ej: "09:00-17:00,19:00-21:00")
        const horas = generarHorasDisponibles(
          prestador.horarioDisponibilidad,
          prestador.disponibleNocturno,
          prestador.disponibleFinesde
        );

        // Marcar próximos 30 días
        for (let i = 0; i < 30; i++) {
          const fecha = new Date(today);
          fecha.setDate(fecha.getDate() + i);
          const dateStr = fecha.toISOString().split('T')[0];

          // Validar que sea un día disponible (fines de semana si está marcado)
          const dayOfWeek = fecha.getDay();
          const esFin = dayOfWeek === 0 || dayOfWeek === 6;

          if (esFin && !prestador.disponibleFinesde) continue;

          if (!marked[dateStr]) {
            marked[dateStr] = { marked: true, dotColor: '#4ECDC4' };
            disponibles.push({
              fecha: dateStr,
              horasDisponibles: horas,
              prestadores: 1,
            });
          } else {
            const existente = disponibles.find((d) => d.fecha === dateStr);
            if (existente) {
              existente.prestadores++;
            }
          }
        }
      });

      setMarkedDates(marked);
      setDisponibilidades(disponibles);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando disponibilidades:', error);
      Alert.alert('Error', 'No se pudieron cargar las disponibilidades');
      setLoading(false);
    }
  };

  const generarHorasDisponibles = (
    horarioStr: string,
    nocturno: boolean,
    finesde: boolean
  ): string[] => {
    // Parsear formato "09:00-17:00,19:00-21:00"
    const horas: string[] = [];
    if (!horarioStr) return horas;

    const rangos = horarioStr.split(',');
    rangos.forEach((rango) => {
      const [inicio, fin] = rango.trim().split('-');
      if (inicio && fin) {
        const [hI, mI] = inicio.split(':').map(Number);
        const [hF, mF] = fin.split(':').map(Number);

        for (let h = hI; h < hF; h++) {
          horas.push(`${h.toString().padStart(2, '0')}:00`);
        }
      }
    });

    return horas;
  };

  const handleContinuar = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Por favor selecciona una fecha');
      return;
    }

    const disponibilidad = disponibilidades.find((d) => d.fecha === selectedDate);
    if (!disponibilidad || disponibilidad.prestadores === 0) {
      Alert.alert(
        'No disponible',
        'No hay prestadores disponibles en esta fecha'
      );
      return;
    }

    router.push({
      pathname: '/servicio/[id]/hora',
      params: {
        id,
        mascotaId,
        mascotaNombre,
        mascotaTamaño,
        fecha: selectedDate,
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
        <Text style={styles.title}>Selecciona Fecha</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Disponibilidad</Text>
        <Text style={styles.serviceInfo}>
          🐕 {mascotaNombre} ({mascotaTamaño})
        </Text>

        <View style={styles.calendarContainer}>
          <Calendar
            minDate={new Date().toISOString().split('T')[0]}
            markedDates={{
              ...markedDates,
              ...(selectedDate && {
                [selectedDate]: {
                  selected: true,
                  marked: true,
                  selectedColor: '#4ECDC4',
                },
              }),
            }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            monthFormat={'MMMM yyyy'}
            hideArrows={false}
            renderHeader={(date) => (
              <Text style={styles.calendarHeader}>
                {date.toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            )}
            theme={{
              backgroundColor: '#FFF',
              calendarBackground: '#FFF',
              textSectionTitleColor: '#2C3E50',
              selectedDayBackgroundColor: '#4ECDC4',
              selectedDayTextColor: '#FFF',
              todayTextColor: '#4ECDC4',
              dayTextColor: '#2C3E50',
              textDisabledColor: '#CCC',
              dotColor: '#4ECDC4',
              selectedDotColor: '#FFF',
              monthTextColor: '#2C3E50',
              arrowColor: '#4ECDC4',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>

        {selectedDate && (
          <View style={styles.selectedInfo}>
            <FontAwesome5 name="calendar-check" size={16} color="#4ECDC4" />
            <Text style={styles.selectedDate}>
              {new Date(selectedDate + 'T00:00').toLocaleDateString('es-ES', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <View style={styles.prestadoresBadge}>
              <Text style={styles.prestadoresCount}>
                {disponibilidades.find((d) => d.fecha === selectedDate)
                  ?.prestadores || 0}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={16} color="#4ECDC4" />
          <Text style={styles.infoText}>
            Los puntos azules indican fechas con prestadores disponibles
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedDate && styles.buttonDisabled]}
          onPress={handleContinuar}
          disabled={!selectedDate}
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
  serviceInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  calendarHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    paddingVertical: 12,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFFE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 10,
  },
  selectedDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
    flex: 1,
    textTransform: 'capitalize',
  },
  prestadoresBadge: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  prestadoresCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FFFE',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 12,
    color: '#4ECDC4',
    flex: 1,
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
