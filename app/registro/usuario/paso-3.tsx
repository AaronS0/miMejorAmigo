import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../../firebaseConfig';

interface RegistroData {
  nombre: string;
  email: string;
  telefonoContacto: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  mascotas: Array<{
    id: string;
    nombre: string;
    tipo: string;
    raza: string;
  }>;
}

export default function RegistroUsuarioPaso3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [registroData, setRegistroData] = useState<RegistroData | null>(null);
  const [mascotaActualIndex, setMascotaActualIndex] = useState(0);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [detalles, setDetalles] = useState({
    tamaño: 'mediano',
    color: '',
    comportamientos: [] as string[],
    miedos: [] as string[],
    nivelEnergía: 'medio',
    historialClinico: '',
    alergias: '',
    medicamentos: '',
    tipoAlimentacion: 'croquetas',
    marcaAlimento: '',
    cantidadDiaria: '',
    alimentosProhibidos: '',
    fotoPerfil: null as string | null,
  });
  const [loading, setLoading] = useState(false);

  const comportamientos = ['Amigable', 'Tímido', 'Juguetón', 'Protector', 'Ansioso'];
  const miedos = ['Fuegos artificiales', 'Agua', 'Otros animales', 'Ruidos', 'Soledad'];

  useEffect(() => {
    if (params.registroData) {
      try {
        const data = JSON.parse(params.registroData as string);
        setRegistroData(data);
      } catch (error) {
        console.error('Error parsing registro data:', error);
      }
    }
  }, [params.registroData]);

  // Efecto para navegar después del registro exitoso
  useEffect(() => {
    if (shouldNavigate) {
      Alert.alert('¡Éxito!', 'Registro completado', [
        {
          text: 'OK',
          onPress: () => {
            setShouldNavigate(false);
            router.replace('/(tabs)/home');
          },
        },
      ]);
    }
  }, [shouldNavigate, router]);

  const toggleComportamiento = (comp: string) => {
    if (detalles.comportamientos.includes(comp)) {
      setDetalles({
        ...detalles,
        comportamientos: detalles.comportamientos.filter((c) => c !== comp),
      });
    } else {
      setDetalles({
        ...detalles,
        comportamientos: [...detalles.comportamientos, comp],
      });
    }
  };

  const toggleMiedo = (miedo: string) => {
    if (detalles.miedos.includes(miedo)) {
      setDetalles({
        ...detalles,
        miedos: detalles.miedos.filter((m) => m !== miedo),
      });
    } else {
      setDetalles({
        ...detalles,
        miedos: [...detalles.miedos, miedo],
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setDetalles({ ...detalles, fotoPerfil: result.assets[0].uri });
    }
  };

  const handleContinuar = async () => {
    if (!registroData) return;

    const mascotaActual = registroData.mascotas[mascotaActualIndex];

    if (!detalles.marcaAlimento || !detalles.cantidadDiaria) {
      Alert.alert('Campos Obligatorios', 'Completa la información de alimentación');
      return;
    }

    if (mascotaActualIndex < registroData.mascotas.length - 1) {
      // Ir a siguiente mascota
      setMascotaActualIndex(mascotaActualIndex + 1);
      setDetalles({
        tamaño: 'mediano',
        color: '',
        comportamientos: [],
        miedos: [],
        nivelEnergía: 'medio',
        historialClinico: '',
        alergias: '',
        medicamentos: '',
        tipoAlimentacion: 'croquetas',
        marcaAlimento: '',
        cantidadDiaria: '',
        alimentosProhibidos: '',
        fotoPerfil: null,
      });
    } else {
      // Guardar todo en Firebase
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        // Guardar documento de usuario
        await setDoc(doc(db, 'usuarios', user.uid), {
          nombre: registroData.nombre,
          email: registroData.email,
          telefonoContacto: registroData.telefonoContacto,
          direccion: registroData.direccion,
          ciudad: registroData.ciudad,
          provincia: registroData.provincia,
          codigoPostal: registroData.codigoPostal,
          rol: 'usuario',
          cuentaActiva: true,
          fechaRegistro: new Date(),
          saldoGalletas: 0,
        });

        // Guardar mascotas
        for (const mascota of registroData.mascotas) {
          await addDoc(collection(db, 'mascotas'), {
            nombre: mascota.nombre,
            tipo: mascota.tipo,
            raza: mascota.raza,
            idDueno: user.uid,
            tamaño: detalles.tamaño,
            color: detalles.color,
            comportamientos: detalles.comportamientos,
            miedos: detalles.miedos,
            nivelEnergía: detalles.nivelEnergía,
            historialClinico: detalles.historialClinico,
            alergias: detalles.alergias,
            medicamentos: detalles.medicamentos,
            tipoAlimentacion: detalles.tipoAlimentacion,
            marcaAlimento: detalles.marcaAlimento,
            cantidadDiaria: detalles.cantidadDiaria,
            alimentosProhibidos: detalles.alimentosProhibidos,
            fechaRegistro: new Date(),
          });
        }

        // Marcar para navegar en el useEffect
        setLoading(false);
        setShouldNavigate(true);
      } catch (error) {
        console.error('Error al guardar:', error);
        Alert.alert('Error', 'Hubo un problema al guardar tus datos');
        setLoading(false);
      }
    }
  };

  if (!registroData) return <ActivityIndicator size="large" color="#4ECDC4" />;

  const mascotaActual = registroData.mascotas[mascotaActualIndex];
  const totalMascotas = registroData.mascotas.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>{mascotaActual.nombre}</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${((mascotaActualIndex + 1) / totalMascotas) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.stepText}>
        Mascota {mascotaActualIndex + 1} de {totalMascotas}
      </Text>

      {/* Foto */}
      <View style={styles.fotoSection}>
        {detalles.fotoPerfil ? (
          <Image source={{ uri: detalles.fotoPerfil }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <FontAwesome5 name="camera" size={32} color="#BDC3C7" />
          </View>
        )}
        <TouchableOpacity style={styles.fotoButton} onPress={pickImage}>
          <FontAwesome5 name="image" size={14} color="white" />
          <Text style={styles.fotoButtonText}>Agregar Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Información Física */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Física</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tamaño</Text>
          <View style={styles.optionsContainer}>
            {['pequeño', 'mediano', 'grande'].map((tamaño) => (
              <TouchableOpacity
                key={tamaño}
                style={[
                  styles.optionButton,
                  detalles.tamaño === tamaño && styles.optionButtonSelected,
                ]}
                onPress={() => setDetalles({ ...detalles, tamaño })}
              >
                <Text
                  style={[
                    styles.optionText,
                    detalles.tamaño === tamaño && styles.optionTextSelected,
                  ]}
                >
                  {tamaño.charAt(0).toUpperCase() + tamaño.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            placeholder="Color de tu mascota"
            value={detalles.color}
            onChangeText={(text) => setDetalles({ ...detalles, color: text })}
            placeholderTextColor="#BDC3C7"
          />
        </View>
      </View>

      {/* Comportamiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comportamiento y Temperamento</Text>

        <Text style={styles.label}>Comportamientos Principales</Text>
        <View style={styles.tagsContainer}>
          {comportamientos.map((comp) => (
            <TouchableOpacity
              key={comp}
              style={[
                styles.tag,
                detalles.comportamientos.includes(comp) && styles.tagSelected,
              ]}
              onPress={() => toggleComportamiento(comp)}
            >
              <Text
                style={[
                  styles.tagText,
                  detalles.comportamientos.includes(comp) && styles.tagTextSelected,
                ]}
              >
                {comp}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Miedos o Fobias</Text>
        <View style={styles.tagsContainer}>
          {miedos.map((miedo) => (
            <TouchableOpacity
              key={miedo}
              style={[
                styles.tag,
                detalles.miedos.includes(miedo) && styles.tagSelected,
              ]}
              onPress={() => toggleMiedo(miedo)}
            >
              <Text
                style={[
                  styles.tagText,
                  detalles.miedos.includes(miedo) && styles.tagTextSelected,
                ]}
              >
                {miedo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nivel de Energía</Text>
          <View style={styles.optionsContainer}>
            {['bajo', 'medio', 'alto'].map((nivel) => (
              <TouchableOpacity
                key={nivel}
                style={[
                  styles.optionButton,
                  detalles.nivelEnergía === nivel && styles.optionButtonSelected,
                ]}
                onPress={() => setDetalles({ ...detalles, nivelEnergía: nivel })}
              >
                <Text
                  style={[
                    styles.optionText,
                    detalles.nivelEnergía === nivel && styles.optionTextSelected,
                  ]}
                >
                  {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Salud */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Salud</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Historial Clínico</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enfermedades previas, cirugías, etc."
            value={detalles.historialClinico}
            onChangeText={(text) =>
              setDetalles({ ...detalles, historialClinico: text })
            }
            multiline
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alergias</Text>
          <TextInput
            style={styles.input}
            placeholder="Alergias conocidas"
            value={detalles.alergias}
            onChangeText={(text) => setDetalles({ ...detalles, alergias: text })}
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Medicamentos Actuales</Text>
          <TextInput
            style={styles.input}
            placeholder="Medicamentos que toma regularmente"
            value={detalles.medicamentos}
            onChangeText={(text) =>
              setDetalles({ ...detalles, medicamentos: text })
            }
            placeholderTextColor="#BDC3C7"
          />
        </View>
      </View>

      {/* Alimentación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alimentación *</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Alimentación</Text>
          <View style={styles.optionsContainer}>
            {['croquetas', 'comida casera', 'mixta'].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.optionButton,
                  detalles.tipoAlimentacion === tipo &&
                    styles.optionButtonSelected,
                ]}
                onPress={() =>
                  setDetalles({ ...detalles, tipoAlimentacion: tipo })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    detalles.tipoAlimentacion === tipo &&
                      styles.optionTextSelected,
                  ]}
                >
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Marca de Alimento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Royal Canin, Purina, etc."
            value={detalles.marcaAlimento}
            onChangeText={(text) =>
              setDetalles({ ...detalles, marcaAlimento: text })
            }
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cantidad Diaria (en gramos) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 250"
            value={detalles.cantidadDiaria}
            onChangeText={(text) =>
              setDetalles({ ...detalles, cantidadDiaria: text })
            }
            keyboardType="numeric"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alimentos Prohibidos</Text>
          <TextInput
            style={styles.input}
            placeholder="Alimentos a evitar"
            value={detalles.alimentosProhibidos}
            onChangeText={(text) =>
              setDetalles({ ...detalles, alimentosProhibidos: text })
            }
            placeholderTextColor="#BDC3C7"
          />
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
          onPress={handleContinuar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {mascotaActualIndex === totalMascotas - 1 ? 'Terminar' : 'Siguiente'}
            </Text>
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
  fotoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  fotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  fotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fotoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#4ECDC4',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  optionTextSelected: {
    color: 'white',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    marginTop: 10,
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
