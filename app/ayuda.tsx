import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

export default function Ayuda() {
  const router = useRouter();
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [email, setEmail] = useState('');

  const handleEnviar = () => {
    if (!asunto || !descripcion || !email) {
      Alert.alert('Campos Requeridos', 'Por favor completa todos los campos');
      return;
    }

    // Aquí iría la lógica para enviar la solicitud a Firebase o un servidor
    Alert.alert(
      'Solicitud Enviada',
      'Gracias por contactarnos. Te responderemos pronto.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.title}>Ayuda y Soporte</Text>
          <View style={{ width: 20 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.infoBox}>
            <FontAwesome5 name="lightbulb" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>
              ¿Tienes una pregunta o necesitas ayuda? Estamos aquí para asistirte. Por favor completa el formulario a continuación y nuestro equipo de soporte te responderá en las próximas 24 horas.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              <Text style={styles.label}>Asunto *</Text>
              <TextInput
                style={styles.input}
                placeholder="¿Cuál es tu pregunta?"
                value={asunto}
                onChangeText={setAsunto}
                placeholderTextColor="#BDC3C7"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción Detallada *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Cuéntanos más sobre tu problema o pregunta..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={6}
                placeholderTextColor="#BDC3C7"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={styles.faqTitle}>Preguntas Frecuentes</Text>

            <View style={styles.faqItem}>
              <FontAwesome5 name="question-circle" size={16} color="#4ECDC4" />
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>¿Cómo reservo un servicio?</Text>
                <Text style={styles.faqAnswer}>Desde la sección "Servicios", selecciona el servicio que necesitas, elige el prestador y confirma la fecha y hora.</Text>
              </View>
            </View>

            <View style={styles.faqItem}>
              <FontAwesome5 name="question-circle" size={16} color="#4ECDC4" />
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>¿Cómo cancelo una reserva?</Text>
                <Text style={styles.faqAnswer}>Puedes cancelar desde el historial de servicios. Si cancelas con 24 horas de anticipación, se devuelven las galletas.</Text>
              </View>
            </View>

            <View style={styles.faqItem}>
              <FontAwesome5 name="question-circle" size={16} color="#4ECDC4" />
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>¿Cómo sé dónde está mi mascota?</Text>
                <Text style={styles.faqAnswer}>En el perfil del prestador y durante el servicio podrás ver la ubicación en tiempo real de tu mascota.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleEnviar}>
            <Text style={styles.sendText}>Enviar Solicitud</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#E0F7F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#2C3E50',
    lineHeight: 18,
  },
  form: {
    gap: 16,
    marginBottom: 28,
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
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  cancelText: {
    textAlign: 'center',
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 14,
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 12,
  },
  sendText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  spacing: {
    height: 20,
  },
});
