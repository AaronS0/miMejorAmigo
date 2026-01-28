import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const mascota = {
    nombre: "Firulais",
    raza: "Golden Retriever",
    saldo: 5000
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, Aaron!</Text>
      <View style={styles.card}>
        <Text style={styles.petName}>{mascota.nombre}</Text>
        <Text>{mascota.raza}</Text>
        <Text style={styles.saldo}>Saldo: {mascota.saldo} 🦴</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => alert('¡Paseo solicitado!')}>
        <Text style={styles.buttonText}>Pedir Paseo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  petName: { fontSize: 20, color: 'orange', fontWeight: 'bold' },
  saldo: { marginTop: 10, color: 'green' },
  button: { marginTop: 20, backgroundColor: 'orange', padding: 15, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});