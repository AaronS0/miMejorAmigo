import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)/home');
      }
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Error', 'Email o contraseña incorrectos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !nombreUsuario) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'usuarios', res.user.uid), {
        nombre: nombreUsuario.trim(),
        email: email,
        saldoGalletas: 10,
        rol: 'usuario',
        cuentaActiva: true,
        fechaRegistro: new Date(),
      });

      Alert.alert('¡Éxito!', 'Cuenta creada. Ahora elige tu rol de usuario', [
        {
          text: 'OK',
          onPress: () => router.replace('/role-selection'),
        },
      ]);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === 'android' ? 100 : 0 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      {/* Logo / Header */}
      <View style={styles.logoSection}>
        <FontAwesome5 name="paw" size={60} color="#4ECDC4" />
        <Text style={styles.appTitle}>miMejorAmigo</Text>
        <Text style={styles.appSubtitle}>El mejor cuidado para tu mascota</Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <Text style={styles.formTitle}>
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Text>

        {isSignUp && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              value={nombreUsuario}
              onChangeText={setNombreUsuario}
              placeholderTextColor="#BDC3C7"
              editable={!loading}
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#BDC3C7"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#BDC3C7"
            editable={!loading}
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={isSignUp ? handleSignUp : handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <FontAwesome5
                name={isSignUp ? 'user-plus' : 'sign-in-alt'}
                size={16}
                color="white"
              />
              <Text style={styles.primaryButtonText}>
                {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsSignUp(!isSignUp);
            setEmail('');
            setPassword('');
            setNombreUsuario('');
          }}
        >
          <Text style={styles.toggleText}>
            {isSignUp
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros términos y condiciones
        </Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 16,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#2C3E50',
  },
  primaryButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    opacity: 0.6,
  },
  toggleText: {
    color: '#4ECDC4',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#BDC3C7',
    textAlign: 'center',
    lineHeight: 16,
  },
});