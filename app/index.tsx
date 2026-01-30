import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// Importamos la función de logueo de Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      // Intentamos entrar a la nube
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("¡Bienvenido!", "Acceso concedido 🐾🥵");
      router.replace('/home'); // Nos saltamos a la billetera
    } catch (error: any) {
      Alert.alert("Error de acceso", "Revisa tus credenciales carechimba ome.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Mi mejor amigo 🐰</Text>
      <Text style={styles.subtitle}>Inicia sesión y haz a tu mascota feliz</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        secureTextEntry 
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { fontSize: 32, fontWeight: 'bold', color: 'orange', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  input: { width: '100%', height: 50, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: 'orange', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});