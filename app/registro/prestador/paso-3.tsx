import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

export default function RegistroPrestadorPaso3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState<string[]>([]);
  const [certificacionesSeleccionadas, setCertificacionesSeleccionadas] = useState<string[]>([]);
  const [disponibleFinesde, setDisponibleFinesde] = useState(false);
  const [disponibleNocturno, setDisponibleNocturno] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setDocumentosSeleccionados([
          ...documentosSeleccionados,
          result.assets[0].name,
        ]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const pickCertification = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setCertificacionesSeleccionadas([
          ...certificacionesSeleccionadas,
          result.assets[0].name,
        ]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleFinish = async () => {
    if (documentosSeleccionados.length === 0) {
      Alert.alert('Documentos Obligatorios', 'Debes cargar al menos un documento de identidad');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const prestadorData = JSON.parse(params.prestadorData as string);

      // Guardar documento de prestador
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre: prestadorData.nombre,
        email: prestadorData.email,
        telefonoContacto: prestadorData.telefonoContacto,
        direccion: prestadorData.direccion,
        ciudad: prestadorData.ciudad,
        rol: 'prestador',
        tipoPrestador: prestadorData.tipoPrestador,
        nombreEmpresa: prestadorData.nombreEmpresa || null,
        rut: prestadorData.rut || null,
        yearExperiencia: prestadorData.yearExperiencia,
        especialidades: prestadorData.especialidades,
        precioServicios30: prestadorData.precioServicios30,
        precioServicios60: prestadorData.precioServicios60,
        aceptaGrandes: prestadorData.aceptaGrandes,
        aceptaPequeños: prestadorData.aceptaPequeños,
        aceptaGatos: prestadorData.aceptaGatos,
        disponibleFinesde,
        disponibleNocturno,
        verificado: false,
        saldoGalletas: 0,
        cuentaActiva: true,
        fechaRegistro: new Date(),
        servicesCompleted: 0,
        calificacionPromedio: 5.0,
      });

      Alert.alert('¡Éxito!', 'Tu perfil de prestador ha sido creado. Próximamente será verificado', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'Hubo un problema al guardar tus datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Documentos</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '100%' }]} />
      </View>
      <Text style={styles.stepText}>Paso 3 de 3</Text>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Documentos de Identidad *</Text>
          <Text style={styles.helpText}>Cédula, pasaporte o licencia de conducir</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <FontAwesome5 name="cloud-upload-alt" size={20} color="#4ECDC4" />
            <Text style={styles.uploadButtonText}>Cargar Documento</Text>
          </TouchableOpacity>

          {documentosSeleccionados.length > 0 && (
            <View style={styles.fileList}>
              {documentosSeleccionados.map((doc, index) => (
                <View key={index} style={styles.fileItem}>
                  <FontAwesome5 name="file-pdf" size={16} color="#E74C3C" />
                  <Text style={styles.fileName}>{doc}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setDocumentosSeleccionados(
                        documentosSeleccionados.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <FontAwesome5 name="trash-alt" size={14} color="#BDC3C7" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Certificaciones (Opcional)</Text>
          <Text style={styles.helpText}>Cursos, diplomados o certificados</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickCertification}>
            <FontAwesome5 name="cloud-upload-alt" size={20} color="#4ECDC4" />
            <Text style={styles.uploadButtonText}>Cargar Certificación</Text>
          </TouchableOpacity>

          {certificacionesSeleccionadas.length > 0 && (
            <View style={styles.fileList}>
              {certificacionesSeleccionadas.map((cert, index) => (
                <View key={index} style={styles.fileItem}>
                  <FontAwesome5 name="file-pdf" size={16} color="#27AE60" />
                  <Text style={styles.fileName}>{cert}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setCertificacionesSeleccionadas(
                        certificacionesSeleccionadas.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <FontAwesome5 name="trash-alt" size={14} color="#BDC3C7" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Disponibilidad</Text>

          <TouchableOpacity
            style={styles.checkboxItem}
            onPress={() => setDisponibleFinesde(!disponibleFinesde)}
          >
            <FontAwesome5
              name={disponibleFinesde ? 'check-square' : 'square'}
              size={20}
              color={disponibleFinesde ? '#4ECDC4' : '#BDC3C7'}
            />
            <Text style={styles.checkboxLabel}>Disponible en fines de semana</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxItem}
            onPress={() => setDisponibleNocturno(!disponibleNocturno)}
          >
            <FontAwesome5
              name={disponibleNocturno ? 'check-square' : 'square'}
              size={20}
              color={disponibleNocturno ? '#4ECDC4' : '#BDC3C7'}
            />
            <Text style={styles.checkboxLabel}>Disponible en horario nocturno</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={16} color="#4ECDC4" />
          <Text style={styles.infoText}>
            Tu perfil será revisado y verificado por nuestro equipo antes de aparecer en la aplicación.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.buttonSecondaryText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleFinish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonPrimaryText}>Terminar</Text>
          )}
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
  helpText: {
    fontSize: 11,
    color: '#7F8C8D',
    marginBottom: 12,
    fontWeight: '400',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FFFE',
  },
  uploadButtonText: {
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 12,
  },
  fileList: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '500',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C3E50',
  },
  infoBox: {
    backgroundColor: '#F0FFFE',
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4ECDC4',
    lineHeight: 16,
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
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    opacity: 0.6,
  },
  spacing: {
    height: 40,
  },
});
