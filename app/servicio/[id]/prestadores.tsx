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
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

interface Prestador {
  id: string;
  nombre: string;
  foto?: string;
  puntuacionPromedio: number;
  serviciosCompletados: number;
  especialidades: string;
  precio: number;
  distancia?: number;
  tipoEmpresa?: string;
}

interface Usuario {
  latitud?: number;
  longitud?: number;
}

export default function ServicioPrestadores() {
  const router = useRouter();
  const { id, mascotaId, mascotaNombre, mascotaTamaño, fecha, hora } =
    useLocalSearchParams();
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestador, setSelectedPrestador] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  useEffect(() => {
    cargarUbicacionYPrestadores();
  }, []);

  const obtenerUbicacionUsuario = async (): Promise<{
    lat: number;
    lon: number;
  } | null> => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return null;

      const userDoc = await getDoc(doc(db, 'usuarios', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as Usuario;
        return {
          lat: userData.latitud || -33.8688,
          lon: userData.longitud || -51.2093,
        };
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
    return null;
  };

  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radio de la tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const cargarUbicacionYPrestadores = async () => {
    try {
      // Obtener ubicación del usuario
      const location = await obtenerUbicacionUsuario();
      setUserLocation(location);

      // Obtener prestadores verificados
      const prestadoresRef = collection(db, 'usuarios');
      const q = query(
        prestadoresRef,
        where('rol', '==', 'prestador'),
        where('verificado', '==', true)
      );
      const querySnapshot = await getDocs(q);

      const prestadoresData: Prestador[] = [];

      querySnapshot.forEach((docSnap) => {
        const prestador = docSnap.data();

        // Validar que acepta el tamaño de mascota
        const aceptaTamaño =
          (mascotaTamaño === 'grande' && prestador.aceptaGrandes) ||
          (mascotaTamaño === 'pequeño' && prestador.aceptaPequeños) ||
          (mascotaTamaño === 'mediano' && prestador.aceptaPequeños);

        if (!aceptaTamaño) return;

        // Validar disponibilidad de día
        const fechaObj = new Date(fecha + 'T00:00');
        const dayOfWeek = fechaObj.getDay();
        const esFin = dayOfWeek === 0 || dayOfWeek === 6;
        if (esFin && !prestador.disponibleFinesde) return;

        // Validar que tiene disponibilidad en la hora seleccionada
        const horariosStr = prestador.horarioDisponibilidad || '09:00-17:00';
        const horaInt = parseInt(hora as string);
        let tieneHora = false;

        const rangos = (horariosStr as string).split(',');
        rangos.forEach((rango) => {
          const [inicio, fin] = rango.trim().split('-');
          if (inicio && fin) {
            const [hI] = inicio.split(':').map(Number);
            const [hF] = fin.split(':').map(Number);
            if (horaInt >= hI && horaInt < hF) {
              tieneHora = true;
            }
          }
        });

        if (!tieneHora) return;

        // Calcular distancia
        let distancia = 999;
        if (location) {
          const lat = prestador.latitud || -33.8688;
          const lon = prestador.longitud || -51.2093;
          distancia = calcularDistancia(location.lat, location.lon, lat, lon);
        }

        // Validar radio de acción
        const radioAccion = parseFloat(prestador.radioAccion || '999');
        if (distancia > radioAccion) return;

        // Calcular precio basado en servicio
        let precio = 10; // Default
        if (id === 'paseo') {
          precio = 15; // 15 galletas el paseo
        } else if (id === 'guarderia') {
          precio = 20;
        }

        prestadoresData.push({
          id: docSnap.id,
          nombre: prestador.nombre,
          foto: prestador.foto,
          puntuacionPromedio: prestador.puntuacionPromedio || 5.0,
          serviciosCompletados: prestador.serviciosCompletados || 0,
          especialidades: prestador.especialidades,
          precio,
          distancia: parseFloat(distancia.toFixed(1)),
          tipoEmpresa: prestador.tipoEmpresa,
        });
      });

      // Ordenar por calificación y distancia
      prestadoresData.sort((a, b) => {
        if (a.puntuacionPromedio === b.puntuacionPromedio) {
          return (a.distancia || 999) - (b.distancia || 999);
        }
        return b.puntuacionPromedio - a.puntuacionPromedio;
      });

      setPrestadores(prestadoresData);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando prestadores:', error);
      Alert.alert('Error', 'No se pudieron cargar los prestadores');
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    if (!selectedPrestador) {
      Alert.alert('Error', 'Por favor selecciona un prestador');
      return;
    }

    const prestador = prestadores.find((p) => p.id === selectedPrestador);
    router.push({
      pathname: '/servicio/[id]/perfil-prestador',
      params: {
        id,
        mascotaId,
        mascotaNombre,
        mascotaTamaño,
        fecha,
        hora,
        prestadorId: selectedPrestador,
        prestadorNombre: prestador?.nombre,
        precio: prestador?.precio.toString(),
      },
    });
  };

  const renderPrestador = ({ item }: { item: Prestador }) => (
    <TouchableOpacity
      style={[
        styles.prestadorCard,
        selectedPrestador === item.id && styles.prestadorCardSelected,
      ]}
      onPress={() => setSelectedPrestador(item.id)}
    >
      <View style={styles.avatarContainer}>
        {item.foto ? (
          <Image
            source={{ uri: item.foto }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome5 name="user" size={28} color="#FFF" />
          </View>
        )}
      </View>

      <View style={styles.prestadorInfo}>
        <Text style={styles.prestadorNombre}>{item.nombre}</Text>
        {item.tipoEmpresa && (
          <Text style={styles.tipoEmpresa}>
            <FontAwesome5 name="briefcase" size={10} /> {item.tipoEmpresa}
          </Text>
        )}

        <View style={styles.ratingContainer}>
          <FontAwesome5 name="star" size={12} color="#FFB800" solid />
          <Text style={styles.ratingText}>
            {item.puntuacionPromedio.toFixed(1)} ({item.serviciosCompletados})
          </Text>
          {item.distancia && (
            <>
              <Text style={styles.separator}>•</Text>
              <FontAwesome5 name="map-marker-alt" size={12} color="#4ECDC4" />
              <Text style={styles.distanciaText}>{item.distancia} km</Text>
            </>
          )}
        </View>

        <Text style={styles.especialidades} numberOfLines={1}>
          {item.especialidades}
        </Text>
      </View>

      <View style={styles.precioContainer}>
        <Text style={styles.precio}>{item.precio}</Text>
        <Text style={styles.precioLabel}>galletas</Text>
        {selectedPrestador === item.id && (
          <FontAwesome5 name="check-circle" size={20} color="#4ECDC4" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const fechaHora = `${new Date(fecha + 'T00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })} a las ${hora}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Prestadores</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.info}>
          <Text style={styles.subtitle}>Disponibles para ti</Text>
          <Text style={styles.dateInfo}>
            🐕 {mascotaNombre} • {fechaHora}
          </Text>
        </View>

        {prestadores.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="user-check" size={48} color="#B0BEC5" />
            <Text style={styles.emptyTitle}>Sin prestadores</Text>
            <Text style={styles.emptyText}>
              No hay prestadores disponibles en tu zona para esta fecha y hora
            </Text>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={prestadores}
            renderItem={renderPrestador}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.prestadoresList}
          />
        )}
      </ScrollView>

      {prestadores.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              !selectedPrestador && styles.buttonDisabled,
            ]}
            onPress={handleContinuar}
            disabled={!selectedPrestador}
          >
            <Text style={styles.buttonText}>Ver Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
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
  dateInfo: {
    fontSize: 14,
    color: '#666',
  },
  prestadoresList: {
    gap: 12,
  },
  prestadorCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prestadorCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FFFE',
  },
  avatarContainer: {
    width: 60,
    height: 60,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prestadorInfo: {
    flex: 1,
    gap: 4,
  },
  prestadorNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
  },
  tipoEmpresa: {
    fontSize: 11,
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  separator: {
    color: '#CCC',
    marginHorizontal: 2,
  },
  distanciaText: {
    fontSize: 12,
    color: '#4ECDC4',
  },
  especialidades: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  precioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  precio: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  precioLabel: {
    fontSize: 10,
    color: '#999',
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
    textAlign: 'center',
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
