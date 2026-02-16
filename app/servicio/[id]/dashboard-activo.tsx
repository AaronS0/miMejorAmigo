import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../../firebaseConfig';
import {
    FotoServicio,
    ServicioActivo,
    calcularDistancia,
    subscribeToFotosServicio,
    subscribeToServicioActivo
} from '../../services/trackingService';

interface DashboardServicioActivoProps {
  onClose?: () => void;
}

export default function DashboardServicioActivo({ onClose }: DashboardServicioActivoProps) {
  const { colors } = useTheme();
  const [servicio, setServicio] = useState<ServicioActivo | null>(null);
  const [fotos, setFotos] = useState<FotoServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [distancia, setDistancia] = useState<number | null>(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Subscribe a cambios en el servicio activo
    const unsubscribe = subscribeToServicioActivo(userId, (servicioActivo) => {
      setServicio(servicioActivo);
      setLoading(false);

      // Si hay servicio, subscribe a fotos
      if (servicioActivo?.id) {
        const unsubFotos = subscribeToFotosServicio(
          servicioActivo.id,
          setFotos
        );
        return () => unsubFotos();
      }
    });

    return () => unsubscribe();
  }, []);

  // Calcular distancia si hay ubicación del prestador
  useEffect(() => {
    if (servicio?.ubicacionPrestador && auth.currentUser) {
      // Aquí usarías la ubicación del usuario (cliente)
      // Por ahora, hacemos un cálculo simulado
      const distanceKm = calcularDistancia(
        -33.8688, // Ubicación demo Cliente
        -51.2093,
        servicio.ubicacionPrestador.lat,
        servicio.ubicacionPrestador.lon
      );
      setDistancia(distanceKm);
    }
  }, [servicio?.ubicacionPrestador]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!servicio) {
    return null;
  }

  const handleLlamarPrestador = () => {
    Alert.alert(
      'Llamar Prestador',
      '¿Deseas contactar al prestador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Llamar',
          onPress: () => {
            // Aquí iría la lógica de llamada
            Alert.alert('Llamada', 'Iniciando llamada...');
          },
        },
      ]
    );
  };

  const handleVerMapa = () => {
    if (servicio.ubicacionPrestador) {
      const url = `https://maps.google.com/?q=${servicio.ubicacionPrestador.lat},${servicio.ubicacionPrestador.lon}`;
      Linking.openURL(url).catch(() =>
        Alert.alert('Error', 'No se pudo abrir el mapa')
      );
    }
  };

  const renderFotoItem = ({ item }: { item: FotoServicio }) => (
    <View style={[styles.fotoCard, { backgroundColor: colors.surface }]}>
      <Image
        source={{ uri: item.url }}
        style={styles.fotoImagen}
        resizeMode="cover"
      />
      {item.descripcion && (
        <Text style={[styles.fotoDescripcion, { color: colors.text }]}>
          {item.descripcion}
        </Text>
      )}
      <Text style={[styles.fotoTimestamp, { color: colors.textSecondary }]}>
        {new Date(item.timestamp).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header del Dashboard */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>EN CURSO</Text>
          </View>
          <Text style={styles.headerTitle}>{servicio.nombreMascota}</Text>
          <Text style={styles.headerSubtitle}>
            {servicio.tipoServicio.charAt(0).toUpperCase() +
              servicio.tipoServicio.slice(1)}
          </Text>
        </View>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome5 name="times" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Información del Prestador */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Prestador</Text>
        <View style={styles.prestadorCard}>
          <View style={styles.prestadorAvatar}>
            <FontAwesome5
              name="user-circle"
              size={50}
              color={colors.primary}
            />
          </View>
          <View style={styles.prestadorInfo}>
            <Text style={[styles.prestadorName, { color: colors.text }]}>
              {servicio.nombrePrestador}
            </Text>
            {distancia !== null && (
              <View style={styles.distanciaRow}>
                <FontAwesome5 name="map-marker-alt" size={12} color={colors.primary} />
                <Text style={[styles.distanciaText, { color: colors.primary }]}>
                  {distancia.toFixed(1)} km de distancia
                </Text>
              </View>
            )}
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              Ubicación actualizada hace poco
            </Text>
          </View>
        </View>

        {/* Botones de Contacto */}
        <View style={styles.botonesContacto}>
          <TouchableOpacity
            style={[
              styles.btnContacto,
              { backgroundColor: colors.primary + '20', borderColor: colors.primary },
            ]}
            onPress={handleLlamarPrestador}
          >
            <FontAwesome5 name="phone" size={16} color={colors.primary} />
            <Text style={[styles.btnTexto, { color: colors.primary }]}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnContacto,
              { backgroundColor: colors.primary + '20', borderColor: colors.primary },
            ]}
            onPress={handleVerMapa}
          >
            <FontAwesome5 name="map" size={16} color={colors.primary} />
            <Text style={[styles.btnTexto, { color: colors.primary }]}>Ver Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeline del Servicio */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View
              style={[styles.timelineDot, { backgroundColor: colors.primary }]}
            />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineLabel, { color: colors.text }]}>
                Servicio Iniciado
              </Text>
              <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                {new Date(servicio.createdAt).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: fotos.length > 0 ? colors.primary : colors.border },
              ]}
            />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineLabel, { color: colors.text }]}>
                {fotos.length > 0 ? 'Fotos Recibidas' : 'Esperando fotos'}
              </Text>
              <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                {fotos.length} fotos
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Feed de Fotos */}
      {fotos.length > 0 && (
        <View style={styles.fotoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Momentos Capturados
          </Text>
          <FlatList
            data={fotos}
            renderItem={renderFotoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      )}

      {/* Estado Vacío de Fotos */}
      {fotos.length === 0 && (
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, alignItems: 'center' },
          ]}
        >
          <FontAwesome5
            name="image"
            size={32}
            color={colors.textSecondary}
            style={{ marginBottom: 8 }}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            El prestador compartirá fotos del servicio
          </Text>
        </View>
      )}

      {/* Detalles de la Reserva */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Detalles</Text>
        <View style={styles.detalleRow}>
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Fecha
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {new Date(servicio.fecha + 'T00:00').toLocaleDateString('es-ES', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detalleRow}>
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Hora
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {servicio.hora}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detalleRow}>
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Tipo de Servicio
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {servicio.tipoServicio.charAt(0).toUpperCase() +
              servicio.tipoServicio.slice(1)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detalleRow}>
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Costo
          </Text>
          <Text style={[styles.precioValue, { color: colors.primary }]}>
            {servicio.costoTotal} galletas
          </Text>
        </View>
      </View>

      {/* Botón de Emergencia */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.btnEmergencia,
            { backgroundColor: '#E74C3C' },
          ]}
          onPress={() =>
            Alert.alert(
              'Contacto de Emergencia',
              'Se notificará al equipo de soporte'
            )
          }
        >
          <FontAwesome5 name="exclamation-triangle" size={16} color="#FFF" />
          <Text style={styles.btnEmergenciaText}>Reportar Problema</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    marginRight: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
  },
  section: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  fotoSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  prestadorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prestadorAvatar: {
    marginRight: 12,
  },
  prestadorInfo: {
    flex: 1,
  },
  prestadorName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  distanciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  distanciaText: {
    fontSize: 12,
    marginLeft: 6,
  },
  timestamp: {
    fontSize: 11,
  },
  botonesContacto: {
    flexDirection: 'row',
    gap: 12,
  },
  btnContacto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeline: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 11,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 20,
    bottom: 0,
    width: 2,
  },
  fotoCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  fotoImagen: {
    width: '100%',
    height: 200,
  },
  fotoDescripcion: {
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  fotoTimestamp: {
    fontSize: 11,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detalleLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detalleValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  precioValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  btnEmergencia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnEmergenciaText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
