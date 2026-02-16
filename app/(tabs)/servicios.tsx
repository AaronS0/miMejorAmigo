import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const SERVICIOS_LISTA = [
  { id: 'paseo', nombre: 'Paseo', descripcion: 'Paseos diarios para tu mascota', icon: 'paw', color: '#FF6B6B' },
  { id: 'guarderia', nombre: 'Guardería', descripcion: 'Cuidado durante el día', icon: 'home', color: '#4ECDC4' },
  { id: 'banio', nombre: 'Baño', descripcion: 'Servicio de grooming', icon: 'shower', color: '#FFE66D' },
  { id: 'pareja', nombre: 'Pareja', descripcion: 'Busca pareja para tu mascota', icon: 'heart', color: '#FF85A2' },
  { id: 'entrenamiento', nombre: 'Entrenamiento', descripcion: 'Adiestramiento profesional', icon: 'graduation-cap', color: '#A8E6CF' },
  { id: 'veterinario', nombre: 'Veterinario', descripcion: 'Atención veterinaria', icon: 'stethoscope', color: '#B19CD9' },
];

export default function ServiciosScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Servicios</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Elige el servicio que necesitas</Text>
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
        {SERVICIOS_LISTA.map((servicio) => (
          <TouchableOpacity key={servicio.id} style={[styles.servicioItem, { backgroundColor: colors.surface }]}>
            <View style={[styles.servicioIcon, { backgroundColor: servicio.color }]}>
              <FontAwesome5 name={servicio.icon} size={24} color="white" />
            </View>
            <View style={styles.servicioInfo}>
              <Text style={[styles.servicioNombre, { color: colors.text }]}>{servicio.nombre}</Text>
              <Text style={[styles.servicioDescripcion, { color: colors.textSecondary }]}>{servicio.descripcion}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
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
    paddingVertical: 16,
    paddingBottom: 40,
  },
  servicioItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servicioIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicioInfo: {
    flex: 1,
    gap: 4,
  },
  servicioNombre: {
    fontSize: 14,
    fontWeight: '700',
  },
  servicioDescripcion: {
    fontSize: 12,
  },
});
