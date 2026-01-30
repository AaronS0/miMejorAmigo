import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const ESPECIALIDADES = [
  'Paseos',
  'Guardería',
  'Adiestramiento',
  'Grooming',
  'Veterinaria',
  'Nutrición',
  'Comportamiento',
];

export default function RegistroPrestadorPaso2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [yearExperiencia, setYearExperiencia] = useState('');
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState<string[]>([]);
  const [serviciosPor30Min, setServiciosPor30Min] = useState('');
  const [serviciosPor60Min, setServiciosPor60Min] = useState('');
  const [aceptaGrandes, setAceptaGrandes] = useState(true);
  const [aceptaPequeños, setAceptaPequeños] = useState(true);
  const [aceptaGatos, setAceptaGatos] = useState(true);

  const toggleEspecialidad = (especialidad: string) => {
    if (especialidadesSeleccionadas.includes(especialidad)) {
      setEspecialidadesSeleccionadas(
        especialidadesSeleccionadas.filter((e) => e !== especialidad)
      );
    } else {
      setEspecialidadesSeleccionadas([...especialidadesSeleccionadas, especialidad]);
    }
  };

  const handleContinuar = () => {
    if (!yearExperiencia || especialidadesSeleccionadas.length === 0 || !serviciosPor30Min || !serviciosPor60Min) {
      Alert.alert('Campos Obligatorios', 'Completa todos los datos');
      return;
    }

    const prestadorData = JSON.parse(params.prestadorData as string);
    const datosPaso2 = {
      ...prestadorData,
      yearExperiencia: parseInt(yearExperiencia),
      especialidades: especialidadesSeleccionadas,
      precioServicios30: parseFloat(serviciosPor30Min),
      precioServicios60: parseFloat(serviciosPor60Min),
      aceptaGrandes,
      aceptaPequeños,
      aceptaGatos,
    };

    router.push({
      pathname: '/registro/prestador/paso-3',
      params: { prestadorData: JSON.stringify(datosPaso2) },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Especialidades</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '66%' }]} />
      </View>
      <Text style={styles.stepText}>Paso 2 de 3</Text>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Años de Experiencia *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            value={yearExperiencia}
            onChangeText={setYearExperiencia}
            keyboardType="numeric"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Especialidades *</Text>
          <View style={styles.tagsContainer}>
            {ESPECIALIDADES.map((esp) => (
              <TouchableOpacity
                key={esp}
                style={[
                  styles.tag,
                  especialidadesSeleccionadas.includes(esp) && styles.tagSelected,
                ]}
                onPress={() => toggleEspecialidad(esp)}
              >
                <Text
                  style={[
                    styles.tagText,
                    especialidadesSeleccionadas.includes(esp) && styles.tagTextSelected,
                  ]}
                >
                  {esp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio por 30 minutos (galletas) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 50"
            value={serviciosPor30Min}
            onChangeText={setServiciosPor30Min}
            keyboardType="numeric"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio por 60 minutos (galletas) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 90"
            value={serviciosPor60Min}
            onChangeText={setServiciosPor60Min}
            keyboardType="numeric"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipos de Mascotas que Atiende</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setAceptaGrandes(!aceptaGrandes)}
            >
              <FontAwesome5
                name={aceptaGrandes ? 'check-square' : 'square'}
                size={20}
                color={aceptaGrandes ? '#4ECDC4' : '#BDC3C7'}
              />
              <Text style={styles.checkboxLabel}>Perros Grandes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setAceptaPequeños(!aceptaPequeños)}
            >
              <FontAwesome5
                name={aceptaPequeños ? 'check-square' : 'square'}
                size={20}
                color={aceptaPequeños ? '#4ECDC4' : '#BDC3C7'}
              />
              <Text style={styles.checkboxLabel}>Perros Pequeños</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setAceptaGatos(!aceptaGatos)}
            >
              <FontAwesome5
                name={aceptaGatos ? 'check-square' : 'square'}
                size={20}
                color={aceptaGatos ? '#4ECDC4' : '#BDC3C7'}
              />
              <Text style={styles.checkboxLabel}>Gatos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonSecondaryText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleContinuar}
        >
          <Text style={styles.buttonPrimaryText}>Continuar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
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
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#2C3E50',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagSelected: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  tagTextSelected: {
    color: 'white',
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C3E50',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
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
  spacing: {
    height: 40,
  },
});
