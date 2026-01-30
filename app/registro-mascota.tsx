import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function RegistroMascota() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Perro'); // Valor por defecto
  const [otroTipo, setOtroTipo] = useState('');
  const [edad, setEdad] = useState('');
  const router = useRouter();

  const handleRegistro = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingresa el nombre de tu mascota.');
      return;
    }
    if (tipo === 'Otro' && !otroTipo.trim()) {
      Alert.alert('Error', '¿Qué animal es tu mascota?');
      return;
    }
    if (!edad.trim()) {
      Alert.alert('Error', 'Ingresa la edad de tu mascota.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const tipoFinal = tipo === 'Otro' ? otroTipo : tipo;

        const mascotaData = {
          nombre: nombre.trim(),
          tipo: tipoFinal,
          edad: parseInt(edad.trim(), 10),
          fechaRegistro: new Date()
        };

        await addDoc(collection(db, "usuarios", user.uid, "mascotas"), mascotaData);

        await updateDoc(userRef, {
          tieneMascota: true
        });

        Alert.alert('¡Éxito!', `${nombre} ha sido registrado 🐾`);
        // Volver al home — Home tiene listener de foco y recargará
        router.back();
      }
    } catch (error: any) {
      console.error('Error registrando mascota:', error);
      Alert.alert('Error al registrar mascota', (error.code ? error.code + ' - ' : '') + (error.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Quién es tu mejor amigo? 🐾</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Tipo de mascota:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
        >
          <Picker.Item label="Perro 🐶" value="Perro" />
          <Picker.Item label="Gato 🐱" value="Gato" />
          <Picker.Item label="Conejo 🐰" value="Conejo" />
          <Picker.Item label="Hámster 🐹" value="Hamster" />
          <Picker.Item label="Pez 🐠" value="Pez" />
          <Picker.Item label="Loro 🦜" value="Loro" />
          <Picker.Item label="Tortuga 🐢" value="Tortuga" />
          <Picker.Item label="Otro..." value="Otro" />
        </Picker>
      </View>

      {tipo === 'Otro' && (
        <TextInput
          style={styles.input}
          placeholder="¿Qué animal es?"
          value={otroTipo}
          onChangeText={setOtroTipo}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Edad (en años)"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistro}>
        <Text style={styles.buttonText}>Finalizar Registro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#FFF', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, color: '#666', marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#CCC', marginBottom: 20, padding: 10, fontSize: 16 },
  pickerContainer: { borderWidth: 1, borderColor: '#CCC', borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: '#D9A05B', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});