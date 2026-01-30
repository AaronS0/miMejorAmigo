import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const SERVICIOS_LISTA = [
  { id: 'paseo', nombre: 'Paseo', descripcion: 'Paseos diarios para tu mascota', icon: 'paw', color: '#FF6B6B' },
  { id: 'guarderia', nombre: 'Guardería', descripcion: 'Cuidado durante el día', icon: 'house', color: '#4ECDC4' },
  { id: 'banio', nombre: 'Baño', descripcion: 'Servicio de grooming', icon: 'shower', color: '#FFE66D' },
  { id: 'pareja', nombre: 'Pareja', descripcion: 'Busca pareja para tu mascota', icon: 'heart', color: '#FF85A2' },
  { id: 'entrenamiento', nombre: 'Entrenamiento', descripcion: 'Adiestramiento profesional', icon: 'graduation-cap', color: '#A8E6CF' },
  { id: 'veterinario', nombre: 'Veterinario', descripcion: 'Atención veterinaria', icon: 'stethoscope', color: '#B19CD9' },
];

export default function ServiciosScreen({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Servicios</Text>
          <Text style={styles.headerSubtitle}>Elige el servicio que necesitas</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesome5 name="bars" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SERVICIOS_LISTA.map((servicio) => (
          <TouchableOpacity key={servicio.id} style={styles.servicioItem}>
            <View style={[styles.servicioIcon, { backgroundColor: servicio.color }]}>
              <FontAwesome5 name={servicio.icon} size={24} color="white" />
            </View>
            <View style={styles.servicioInfo}>
              <Text style={styles.servicioNombre}>{servicio.nombre}</Text>
              <Text style={styles.servicioDescripcion}>{servicio.descripcion}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={18} color="#BDC3C7" />
          </TouchableOpacity>
        ))}
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
    paddingVertical: 16,
    paddingBottom: 40,
  },
  servicioItem: {
    backgroundColor: 'white',
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
    color: '#2C3E50',
  },
  servicioDescripcion: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});
