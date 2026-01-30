import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'usuario') {
      router.push('/registro/usuario/paso-1');
    } else if (selectedRole === 'prestador') {
      router.push('/registro/prestador/paso-1');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>¿Cuál es tu rol?</Text>
        <Text style={styles.subtitle}>
          Elige cómo deseas usar miMejorAmigo
        </Text>
      </View>

      {/* Card Usuario */}
      <TouchableOpacity
        style={[
          styles.card,
          selectedRole === 'usuario' && styles.cardSelected,
        ]}
        onPress={() => setSelectedRole('usuario')}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="heart" size={40} color="#FF6B6B" />
          </View>
          <Text style={styles.cardTitle}>Soy Dueño de Mascota</Text>
          <Text style={styles.cardDescription}>
            Busco servicios para mi mascota querida
          </Text>
          <View style={styles.features}>
            <Text style={styles.featureText}>✓ Contratar paseos</Text>
            <Text style={styles.featureText}>✓ Cuidado y guardería</Text>
            <Text style={styles.featureText}>✓ Servicios de aseo</Text>
            <Text style={styles.featureText}>✓ Atención veterinaria</Text>
          </View>
        </View>
        {selectedRole === 'usuario' && (
          <View style={styles.checkmark}>
            <FontAwesome5 name="check-circle" size={24} color="#4ECDC4" />
          </View>
        )}
      </TouchableOpacity>

      {/* Card Prestador */}
      <TouchableOpacity
        style={[
          styles.card,
          selectedRole === 'prestador' && styles.cardSelected,
        ]}
        onPress={() => setSelectedRole('prestador')}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="briefcase" size={40} color="#4ECDC4" />
          </View>
          <Text style={styles.cardTitle}>Soy Prestador de Servicios</Text>
          <Text style={styles.cardDescription}>
            Deseo ofrecer servicios para mascotas
          </Text>
          <View style={styles.features}>
            <Text style={styles.featureText}>✓ Ser paseador</Text>
            <Text style={styles.featureText}>✓ Cuidador profesional</Text>
            <Text style={styles.featureText}>✓ Peluquero/Adiestrador</Text>
            <Text style={styles.featureText}>✓ Ganar comisiones</Text>
          </View>
        </View>
        {selectedRole === 'prestador' && (
          <View style={styles.checkmark}>
            <FontAwesome5 name="check-circle" size={24} color="#4ECDC4" />
          </View>
        )}
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity
        style={[
          styles.button,
          !selectedRole && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.buttonText}>Continuar</Text>
        <FontAwesome5 name="arrow-right" size={16} color="white" />
      </TouchableOpacity>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FFFE',
  },
  cardContent: {
    paddingRight: 30,
  },
  iconContainer: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  features: {
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#34495E',
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  spacing: {
    height: 40,
  },
});
