import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MascotaDetalle() {
  let params: any = {};
  try {
    // Try local params hook first (newer expo-router)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-router');
    if (typeof mod.useLocalSearchParams === 'function') {
      params = mod.useLocalSearchParams();
    } else if (typeof mod.useSearchParams === 'function') {
      params = mod.useSearchParams();
    }
  } catch (e) {
    params = {};
  }
  const router = useRouter();
  const raw = params?.data as string | undefined;
  let mascota: any = null;
  if (raw) {
    try {
      mascota = JSON.parse(decodeURIComponent(raw));
    } catch (e) {
      mascota = null;
    }
  }

  if (!mascota) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Datos de la mascota no disponibles.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{mascota.nombre}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="chevron-left" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.value}>{mascota.tipo}</Text>

        <Text style={styles.label}>Edad</Text>
        <Text style={styles.value}>{mascota.edad} años</Text>

        {mascota.comportamientos && (
          <>
            <Text style={styles.label}>Comportamientos</Text>
            <Text style={styles.value}>{String(mascota.comportamientos)}</Text>
          </>
        )}

        {mascota.fechaRegistro && (
          <>
            <Text style={styles.label}>Registrada</Text>
            <Text style={styles.value}>{new Date(mascota.fechaRegistro?.seconds ? mascota.fechaRegistro.seconds * 1000 : mascota.fechaRegistro).toLocaleDateString()}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F8F9FA', flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#222' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, elevation: 2 },
  label: { color: '#777', marginTop: 12, fontWeight: '600' },
  value: { color: '#222', fontSize: 16, marginTop: 4 },
  info: { color: '#666' },
  backBtn: { marginTop: 16, backgroundColor: '#D9A05B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  backText: { color: '#FFF', fontWeight: '700' }
});
