import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Mascota {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
}

export default function RegistroUsuarioPaso2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cantidadMascotas, setCantidadMascotas] = useState('');
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [mostrarFormularioMascota, setMostrarFormularioMascota] = useState(false);
  const [mascotaActual, setMascotaActual] = useState({
    nombre: '',
    tipo: 'perro',
    raza: '',
  });

  const tipos = ['Perro', 'Gato', 'Pájaro', 'Conejo', 'Hamster', 'Otro'];

  const handleAgregarMascota = () => {
    if (!mascotaActual.nombre || !mascotaActual.tipo || !mascotaActual.raza) {
      Alert.alert('Campos Obligatorios', 'Completa todos los datos de la mascota');
      return;
    }

    const nuevaMascota: Mascota = {
      id: Math.random().toString(),
      ...mascotaActual,
    };

    setMascotas([...mascotas, nuevaMascota]);
    setMascotaActual({ nombre: '', tipo: 'perro', raza: '' });
    setMostrarFormularioMascota(false);
  };

  const handleEliminarMascota = (id: string) => {
    setMascotas(mascotas.filter((m) => m.id !== id));
  };

  const handleContinuar = () => {
    if (mascotas.length === 0) {
      Alert.alert('Sin Mascotas', 'Debes registrar al menos una mascota');
      return;
    }

    const registroData = {
      ...JSON.parse(params.userData as string),
      mascotas,
    };

    router.push({
      pathname: '/registro/usuario/paso-3',
      params: { registroData: JSON.stringify(registroData) },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'android' ? 100 : 0 }}
        keyboardShouldPersistTaps="handled"
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Mascotas</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '66%' }]} />
      </View>
      <Text style={styles.stepText}>Paso 2 de 3</Text>

      {/* Mascotas Registradas */}
      {mascotas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mascotas Registradas ({mascotas.length})</Text>
          <FlatList
            data={mascotas}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.mascotaCard}>
                <View style={styles.mascotaInfo}>
                  <FontAwesome5
                    name={item.tipo.toLowerCase() === 'perro' ? 'dog' : 'cat'}
                    size={24}
                    color="#FF6B6B"
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.mascotaNombre}>{item.nombre}</Text>
                    <Text style={styles.mascotaDetalle}>
                      {item.tipo} - {item.raza}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleEliminarMascota(item.id)}>
                  <FontAwesome5 name="trash-alt" size={18} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Formulario para agregar mascota */}
      {mostrarFormularioMascota ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agregar Mascota</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la mascota"
              value={mascotaActual.nombre}
              onChangeText={(text) =>
                setMascotaActual({ ...mascotaActual, nombre: text })
              }
              placeholderTextColor="#BDC3C7"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tiposContainer}
            >
              {tipos.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.tipoButton,
                    mascotaActual.tipo === tipo.toLowerCase() &&
                      styles.tipoButtonSelected,
                  ]}
                  onPress={() =>
                    setMascotaActual({ ...mascotaActual, tipo: tipo.toLowerCase() })
                  }
                >
                  <Text
                    style={[
                      styles.tipoButtonText,
                      mascotaActual.tipo === tipo.toLowerCase() &&
                        styles.tipoButtonTextSelected,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Raza *</Text>
            <TextInput
              style={styles.input}
              placeholder="Raza de la mascota"
              value={mascotaActual.raza}
              onChangeText={(text) =>
                setMascotaActual({ ...mascotaActual, raza: text })
              }
              placeholderTextColor="#BDC3C7"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setMostrarFormularioMascota(false)}
            >
              <Text style={styles.buttonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleAgregarMascota}
            >
              <Text style={styles.buttonPrimaryText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setMostrarFormularioMascota(true)}
        >
          <FontAwesome5 name="plus" size={20} color="#4ECDC4" />
          <Text style={styles.addButtonText}>
            {mascotas.length === 0
              ? 'Agrega tu primera mascota'
              : 'Agregar otra mascota'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Buttons */}
      {!mostrarFormularioMascota && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonSecondaryText}>Atrás</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonPrimary, mascotas.length === 0 && styles.buttonDisabled]}
            onPress={handleContinuar}
            disabled={mascotas.length === 0}
          >
            <Text style={styles.buttonPrimaryText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.spacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  stepText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  mascotaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mascotaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mascotaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  mascotaDetalle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#2C3E50',
  },
  tiposContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tipoButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  tipoButtonSelected: {
    backgroundColor: '#4ECDC4',
  },
  tipoButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  tipoButtonTextSelected: {
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: '#F0FFFE',
    gap: 10,
  },
  addButtonText: {
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  buttonSecondary: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  buttonSecondaryText: {
    textAlign: 'center',
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonPrimaryText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    opacity: 0.6,
  },
  spacing: {
    height: 40,
  },
});
