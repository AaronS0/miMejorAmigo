import { FontAwesome5 } from '@expo/vector-icons';
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

interface Transaccion {
  tipo: string;
  monto: number;
  descripcion: string;
  fecha: Date;
}

export default function GalletasScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState('usuario');
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setUserRole(data.rol || 'usuario');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAgregarFondos = () => {
    // TODO: Implementar modal/pantalla de carga
    console.log('Agregar fondos');
  };

  const handleRetirarFondos = () => {
    // TODO: Implementar modal/pantalla de retiro
    console.log('Retirar fondos');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const saldoActual = userData?.saldoGalletas || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Galletas</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Administra tu billetera</Text>
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
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
          <View style={styles.balanceIconContainer}>
            <FontAwesome5 name="coins" size={48} color="#FFD700" />
          </View>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Saldo Disponible</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>{saldoActual}</Text>
          <Text style={[styles.galleta, { color: colors.textSecondary }]}>galletas</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {userRole === 'usuario' ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAgregarFondos}
            >
              <FontAwesome5 name="plus-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Agregar Fondos</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRetirarFondos}
            >
              <FontAwesome5 name="money-bill-alt" size={20} color="white" />
              <Text style={styles.buttonText}>Retirar Fondos</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Información */}
        <View style={styles.infoCard}>
          <FontAwesome5 name="info-circle" size={20} color="#4ECDC4" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>¿Cómo funcionan las galletas?</Text>
            <Text style={styles.infoDescription}>
              Las galletas son la moneda interna de miMejorAmigo. Úsalas para pagar servicios,
              fotos extras, videos y más.
            </Text>
          </View>
        </View>

        {/* Historial */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Historial de Transacciones</Text>

          {transacciones.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="receipt" size={40} color="#BDC3C7" />
              <Text style={styles.emptyStateText}>Sin transacciones aún</Text>
            </View>
          ) : (
            <View>
              {transacciones.map((trans, index) => (
                <View key={index} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionType}>{trans.tipo}</Text>
                    <Text style={styles.transactionDesc}>{trans.descripcion}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      trans.tipo === 'PAGO' && styles.negative,
                    ]}
                  >
                    {trans.tipo === 'PAGO' ? '-' : '+'}
                    {trans.monto}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
  balanceCard: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceIconContainer: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
  },
  galleta: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  actionButtons: {
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  infoText: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
  },
  infoDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#BDC3C7',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
  },
  transactionDesc: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27AE60',
  },
  negative: {
    color: '#E74C3C',
  },
});
