import { auth, db } from '@/firebaseConfig';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ConfirmacionReserva() {
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

  const [loading, setLoading] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [estadoReserva, setEstadoReserva] = useState<'confirmada' | 'buscando' | null>(null);
  const [reservaIdCreada, setReservaIdCreada] = useState<string | null>(null);
  const [prestadorEncontrado, setPrestadorEncontrado] = useState<any>(null);

  const handleConfirmarReserva = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Usuario no autenticado');

      // Obtener ubicación del usuario para búsqueda de prestadores
      const userDoc = await (await import('firebase/firestore')).getDoc(
        (await import('firebase/firestore')).doc(db, 'usuarios', userId)
      );
      const userData = userDoc.data();
      const precioNum = parseInt(precio as string);

      // Usar el nuevo servicio que maneja solicitudes huérfanas
      const resultado = await crearReservaConBusqueda(
        mascotaId as string,
        id as string,
        fecha as string,
        hora as string,
        precioNum,
        userData?.latitud && userData?.longitud
          ? { lat: userData.latitud, lon: userData.longitud }
          : undefined
      );

      if (!resultado.success) {
        Alert.alert('Error', resultado.mensaje);
        setLoading(false);
        return;
      }

      // Guardar datos de la reserva completada
      setReservaIdCreada(resultado.reservaId);
      setEstadoReserva(resultado.estado);
      setPrestadorEncontrado(resultado.prestadorAsignado);
      setReservaConfirmada(true);
    } catch (error) {
      console.error('Error confirmando reserva:', error);
      Alert.alert('Error', 'No se pudo confirmar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    router.push({
      pathname: '/(tabs)/home',
    });
  };

  if (reservaConfirmada) {
    const isConfirmada = estadoReserva === 'confirmada';
    const prestadorInfo = prestadorEncontrado || { nombre: prestadorNombre };

    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <FontAwesome5
            name={isConfirmada ? 'check-circle' : 'hourglass-start'}
            size={80}
            color={isConfirmada ? '#4ECDC4' : '#FFB84D'}
            style={styles.successIcon}
          />
          <Text style={styles.successTitle}>
            {isConfirmada ? '¡Reserva Confirmada!' : 'Buscando Prestador...'}
          </Text>
          <Text style={styles.successText}>
            {isConfirmada
              ? `Tu reserva ha sido asignada a ${prestadorInfo.nombre}`
              : 'Tu reserva está activa. Buscaremos el mejor prestador para ti'}
          </Text>

          <View style={styles.detallesContainer}>
            {prestadorInfo && isConfirmada && (
              <View style={styles.detalleRow}>
                <Text style={styles.detalleLabel}>Prestador:</Text>
                <Text style={styles.detalleValue}>{prestadorInfo.nombre}</Text>
              </View>
            )}
            <View style={styles.detalleRow}>
              <Text style={styles.detalleLabel}>Servicio:</Text>
              <Text style={styles.detalleValue}>
                {id === 'paseo' ? 'Paseo' : id === 'guarderia' ? 'Guardería' : id}
              </Text>
            </View>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleLabel}>Mascota:</Text>
              <Text style={styles.detalleValue}>{mascotaNombre}</Text>
            </View>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleLabel}>Fecha:</Text>
              <Text style={styles.detalleValue}>
                {new Date(fecha + 'T00:00').toLocaleDateString('es-ES')}
              </Text>
            </View>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleLabel}>Hora:</Text>
              <Text style={styles.detalleValue}>{hora}</Text>
            </View>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleLabel}>Costo:</Text>
              <Text style={styles.detalleValuePrice}>{precio} galletas</Text>
            </View>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleLabel}>Estado:</Text>
              <View
                style={[
                  styles.estadoBadge,
                  {
                    backgroundColor: isConfirmada ? '#C8F7DC' : '#FFE6B3',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.estadoText,
                    {
                      color: isConfirmada ? '#0D7354' : '#7A4E00',
                    },
                  ]}
                >
                  {isConfirmada ? 'Confirmada' : 'Buscando'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.infoText}>
            {isConfirmada
              ? 'El prestador se pondrá en contacto contigo próximamente'
              : 'Te notificaremos cuando encontremos un prestador disponible'}
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleVolver}
            >
              <Text style={styles.buttonText}>
                {isConfirmada ? 'Volver al Inicio' : 'Ver Reservas'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Confirmar Reserva</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Revisa tus datos</Text>

          <View style={styles.detalleCard}>
            <View style={styles.detalleRow}>
              <View style={styles.labelIcon}>
                <FontAwesome5 name="user" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detalleContent}>
                <Text style={styles.detalleLabel}>Prestador</Text>
                <Text style={styles.detalleValue}>{prestadorNombre}</Text>
              </View>
            </View>

            <View style={styles.detalleRow}>
              <View style={styles.labelIcon}>
                <FontAwesome5 name="calendar" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detalleContent}>
                <Text style={styles.detalleLabel}>Fecha</Text>
                <Text style={styles.detalleValue}>
                  {new Date(fecha + 'T00:00').toLocaleDateString('es-ES', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.detalleRow}>
              <View style={styles.labelIcon}>
                <FontAwesome5 name="clock" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detalleContent}>
                <Text style={styles.detalleLabel}>Hora</Text>
                <Text style={styles.detalleValue}>{hora}</Text>
              </View>
            </View>

            <View style={styles.detalleRow}>
              <View style={styles.labelIcon}>
                <FontAwesome5 name="paw" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detalleContent}>
                <Text style={styles.detalleLabel}>Mascota</Text>
                <Text style={styles.detalleValue}>{mascotaNombre}</Text>
              </View>
            </View>

            <View style={styles.detalleRow}>
              <View style={styles.labelIcon}>
                <FontAwesome5 name="tag" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detalleContent}>
                <Text style={styles.detalleLabel}>Servicio</Text>
                <Text style={styles.detalleValue}>
                  {id === 'paseo' ? 'Paseo' : 'Guardería'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.costSection}>
          <Text style={styles.sectionTitle}>Detalles del pago</Text>
          <View style={styles.costCard}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Servicio</Text>
              <Text style={styles.costValue}>{precio} galletas</Text>
            </View>
            <View style={styles.costDivider} />
            <View style={styles.costRow}>
              <Text style={styles.costLabelTotal}>Total</Text>
              <Text style={styles.costValueTotal}>{precio} galletas</Text>
            </View>
          </View>
        </View>

        <View style={styles.warningBox}>
          <FontAwesome5 name="info-circle" size={16} color="#4ECDC4" />
          <Text style={styles.warningText}>
            Al confirmar, se descontarán {precio} galletas de tu saldo. Podrás
            cancelar hasta 24 horas antes del servicio.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buttonCancel}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonConfirm, loading && styles.buttonDisabled]}
          onPress={handleConfirmarReserva}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <FontAwesome5 name="check" size={16} color="#FFF" />
              <Text style={styles.buttonConfirmText}>Confirmar</Text>
            </>
          )}
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
  reviewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  detalleCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0FFFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detalleContent: {
    flex: 1,
  },
  detalleLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detalleValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    marginTop: 2,
  },
  costSection: {
    marginBottom: 24,
  },
  costCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  costDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  costLabelTotal: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '700',
  },
  costValueTotal: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: '700',
  },
  warningBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FFFE',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  warningText: {
    fontSize: 12,
    color: '#4ECDC4',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buttonCancel: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancelText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonConfirm: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonConfirmText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  // Success state
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  detallesContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detalleValuePrice: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '700',
  },
  infoText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
