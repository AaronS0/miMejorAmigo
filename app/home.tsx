import { doc, getDoc, updateDoc } from "firebase/firestore"; // Añadimos getDoc
import React, { useEffect, useState } from 'react'; // Añadimos useEffect
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function App() {

  // 1. Estado para el saldo (Este sí cambia)
  const [saldo, setSaldo] = useState(0);

  const mascota = {
    nombre: "Firulais",
    raza: "Golden Retriever"
  };

  // 2. Función para realizar el pago y actualizar el saldo
  // Esto se ejecuta una sola vez cuando abres la App
  useEffect(() => {
    const consultarSaldo = async () => {
      try {
        const userRef = doc(db, "usuarios", "ZQmAmY5fvOKUBX9dvxD9");
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setSaldo(snapshot.data().saldo); // <--- Aquí es donde "pisamos" los 5000 con el valor real
        }
      } catch (error) {
        console.log("Error al leer saldo:", error);
      }
    };
    consultarSaldo();
  }, []);

  const realizarPago = async () => {
    if (saldo >= 15) {
      const nuevoSaldo = saldo - 15;

      try {
        const userRef = doc(db, "usuarios", "ZQmAmY5fvOKUBX9dvxD9");
        await updateDoc(userRef, {
          saldo: nuevoSaldo
        });

        setSaldo(nuevoSaldo);
        Alert.alert("¡Éxito!", "Pago registrado en la nube ☁️");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo sincronizar. Revisa tu consola de Firebase.");
      }
    } else {
      Alert.alert("Error", "Saldo insuficiente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, Aaron!</Text>

      <View style={styles.card}>
        <Text style={styles.petName}>{mascota.nombre}</Text>
        <Text>{mascota.raza}</Text>
        {/* Usamos 'saldo' del estado, no el de la mascota fija */}
        <Text style={styles.saldo}>Saldo: {saldo} 🦴</Text>
      </View>

      {/* Conectamos la función al botón */}
      <TouchableOpacity style={styles.button} onPress={realizarPago}>
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
  saldo: { marginTop: 10, color: 'green', fontSize: 18 },
  button: { marginTop: 20, backgroundColor: 'orange', padding: 15, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});