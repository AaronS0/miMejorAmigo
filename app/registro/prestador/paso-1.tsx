import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Picker,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RegistroPrestadorPaso1() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [tipoPrestador, setTipoPrestador] = useState('independiente');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [rut, setRut] = useState('');

  const handleContinuar = () => {
    if (!nombre || !email || !telefonoContacto || !direccion || !ciudad) {
      Alert.alert('Campos Obligatorios', 'Por favor completa todos los campos marcados con *');
      return;
    }

    if (tipoPrestador === 'empresa' && (!nombreEmpresa || !rut)) {
      Alert.alert('Campos Obligatorios', 'Completa los datos de la empresa');
      return;
    }

    const prestadorData = {
      nombre,
      email,
      telefonoContacto,
      direccion,
      ciudad,
      tipoPrestador,
      nombreEmpresa,
      rut,
    };

    router.push({
      pathname: '/registro/prestador/paso-2',
      params: { prestadorData: JSON.stringify(prestadorData) },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Datos Básicos</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '33%' }]} />
      </View>
      <Text style={styles.stepText}>Paso 1 de 3</Text>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono de Contacto *</Text>
          <TextInput
            style={styles.input}
            placeholder="+56912345678"
            value={telefonoContacto}
            onChangeText={setTelefonoContacto}
            keyboardType="phone-pad"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>¿Cuál es tu tipo de prestador? *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoPrestador}
              onValueChange={setTipoPrestador}
              style={styles.picker}
            >
              <Picker.Item label="Independiente" value="independiente" />
              <Picker.Item label="Empresa" value="empresa" />
            </Picker>
          </View>
        </View>

        {tipoPrestador === 'empresa' && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre de la Empresa *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de tu empresa"
                value={nombreEmpresa}
                onChangeText={setNombreEmpresa}
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>RUT de la Empresa *</Text>
              <TextInput
                style={styles.input}
                placeholder="12345678-9"
                value={rut}
                onChangeText={setRut}
                placeholderTextColor="#BDC3C7"
              />
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ciudad *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ciudad"
            value={ciudad}
            onChangeText={setCiudad}
            placeholderTextColor="#BDC3C7"
          />
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
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
