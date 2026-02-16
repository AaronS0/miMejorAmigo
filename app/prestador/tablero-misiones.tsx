import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import {
    aceptarMision,
    MisionDisponible,
    obtenerMisionesDisponibles,
} from '../../services/misionesService';

export default function TableroMisiones() {
  const { colors } = useTheme();
  const router = useRouter();
  const [misiones, setMisiones] = useState<MisionDisponible[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroServicio, setFiltroServicio] = useState<string | null>(null);
  const [aceptandoMision, setAceptandoMision] = useState<string | null>(null);

  useEffect(() => {
    cargarMisiones();
  }, [filtroServicio]);

  const cargarMisiones = async () => {
    setLoading(true);
    try {
      const filtros = filtroServicio ? { tiposServicio: [filtroServicio] } : undefined;
      const misionesData = await obtenerMisionesDisponibles(filtros);
      setMisiones(misionesData);
    } catch (error) {
      console.error('Error cargando misiones:', error);
      Alert.alert('Error', 'No se pudieron cargar las misiones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarMisiones();
    setRefreshing(false);
  };

  const handleAceptarMision = async (misionId: string, nombreCliente: string) => {
    Alert.alert(
      'Confirmar',
      `¿Aceptar esta misión de ${nombreCliente}?`,
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            setAceptandoMision(misionId);
            try {
              const resultado = await aceptarMision(misionId);
              if (resultado.success) {
                Alert.alert('Éxito', resultado.mensaje);
                // Recargar misiones
                await cargarMisiones();
              } else {
                Alert.alert('Error', resultado.mensaje);
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo aceptar la misión');
            } finally {
              setAceptandoMision(null);
            }
          },
        },
      ]
    );
  };

  const servicios = ['paseo', 'guarderia', 'banio', 'entrenamiento', 'veterinario'];

  const renderMisionCard = ({ item }: { item: MisionDisponible }) => (
    <View style={[styles.misionCard, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.clienteInfo}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user-circle" size={40} color={colors.primary} />
          </View>
          <View style={styles.clienteDetails}>
            <Text style={[styles.clienteName, { color: colors.text }]}>
              {item.nombreCliente}
            </Text>
            <View style={styles.ratingRow}>
              <FontAwesome5 name="star" size={12} color="#FFB84D" />
              <Text style={[styles.rating, { color: colors.textSecondary }]}>
                {item.calificacionCliente?.toFixed(1) || 'N/A'} • {item.ciudad}
              </Text>
            </View>
          </View>
          {item.distancia && (
            <View style={styles.distanciaBox}>
              <FontAwesome5 name="map-marker-alt" size={12} color={colors.primary} />
              <Text style={[styles.distancia, { color: colors.primary }]}>
                {item.distancia.toFixed(1)} km
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.detalleRow, { borderTopColor: colors.border }]}>
        <View style={styles.detalleItem}>
          <FontAwesome5 name="paw" size={14} color={colors.primary} />
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Mascota
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {item.nombreMascota}
          </Text>
        </View>
        <View style={styles.detalleItem}>
          <FontAwesome5 name="tasks" size={14} color={colors.primary} />
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Servicio
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {item.tipoServicio.charAt(0).toUpperCase() + item.tipoServicio.slice(1)}
          </Text>
        </View>
      </View>

      <View style={[styles.detalleRow, { borderTopColor: colors.border }]}>
        <View style={styles.detalleItem}>
          <FontAwesome5 name="calendar" size={14} color={colors.primary} />
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Fecha
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {new Date(item.fecha + 'T00:00').toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.detalleItem}>
          <FontAwesome5 name="clock" size={14} color={colors.primary} />
          <Text style={[styles.detalleLabel, { color: colors.textSecondary }]}>
            Hora
          </Text>
          <Text style={[styles.detalleValue, { color: colors.text }]}>
            {item.hora}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.precioRow,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.precioLabel, { color: colors.textSecondary }]}>
            Recompensa
          </Text>
          <Text style={[styles.precioValue, { color: colors.primary }]}>
            {item.costoTotal} galletas
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.btnAceptar,
            {
              backgroundColor: colors.primary,
              opacity: aceptandoMision === item.id ? 0.7 : 1,
            },
          ]}
          onPress={() => handleAceptarMision(item.id, item.nombreCliente)}
          disabled={aceptandoMision === item.id}
        >
          {aceptandoMision === item.id ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <FontAwesome5 name="check" size={14} color="#FFF" />
              <Text style={styles.btnAceptarText}>Aceptar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Tablero de Misiones</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {misiones.length} misiones disponibles
          </Text>
        </View>
        <FontAwesome5 name="briefcase" size={24} color={colors.primary} />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosContent}
      >
        <TouchableOpacity
          style={[
            styles.filtro,
            {
              backgroundColor:
                filtroServicio === null ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setFiltroServicio(null)}
        >
          <Text
            style={[
              styles.filtroText,
              {
                color: filtroServicio === null ? '#FFF' : colors.text,
              },
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        {servicios.map((servicio) => (
          <TouchableOpacity
            key={servicio}
            style={[
              styles.filtro,
              {
                backgroundColor:
                  filtroServicio === servicio ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setFiltroServicio(servicio)}
          >
            <Text
              style={[
                styles.filtroText,
                {
                  color: filtroServicio === servicio ? '#FFF' : colors.text,
                },
              ]}
            >
              {servicio.charAt(0).toUpperCase() + servicio.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Misiones */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Cargando misiones...
          </Text>
        </View>
      ) : misiones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="inbox" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No hay misiones disponibles
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Vuelve más tarde para ver nuevas misiones en tu área
          </Text>
        </View>
      ) : (
        <FlatList
          data={misiones}
          renderItem={renderMisionCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  filtrosContainer: {
    backgroundColor: undefined,
    paddingVertical: 12,
  },
  filtrosContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filtro: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filtroText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
    paddingBottom: 20,
  },
  misionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    padding: 16,
  },
  clienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clienteDetails: {
    flex: 1,
  },
  clienteName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 11,
  },
  distanciaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  distancia: {
    fontSize: 12,
    fontWeight: '600',
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  detalleItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  detalleLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  detalleValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  precioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  precioLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  precioValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  btnAceptar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnAceptarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
