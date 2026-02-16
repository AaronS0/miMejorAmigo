import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function MisMascotas() {
  const [loading, setLoading] = useState(true);
  const [mascotas, setMascotas] = useState<any[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    let active = true;
    const fetchMascotas = async () => {
      try {
        const user = auth.currentUser;
        if (user && active) {
          const mascotasRef = collection(db, "usuarios", user.uid, "mascotas");
          const mascotasSnap = await getDocs(mascotasRef);
          if (!mascotasSnap.empty) {
            const list = mascotasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMascotas(list);
          } else {
            setMascotas([]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMascotas();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMascotas();
    });
    return () => { active = false; unsubscribe(); };
  }, [navigation]);

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#D9A05B" /></View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="chevron-left" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Mascotas</Text>
        <View style={{ width: 24 }} />
      </View>

      {mascotas.length === 0 ? (
        <View style={styles.emptyCard}>
          <FontAwesome5 name="paw" size={40} color="#D9A05B" style={{marginBottom: 15}} />
          <Text style={styles.infoText}>Aún no tienes amigos registrados.</Text>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => router.push('/registro-mascota')}
          >
            <Text style={styles.buttonText}>Registrar Mascota 🐶</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={mascotas}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.petCard}
                onPress={() => router.push({ pathname: `/mascota/${item.id}`, query: { data: JSON.stringify(item) } } as any)}
              >
                <View style={styles.avatar}>
                  <FontAwesome5 name={item.tipo === 'Gato' ? 'cat' : 'dog'} size={40} color="#D9A05B" />
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{item.nombre}</Text>
                  <Text style={styles.petType}>{item.tipo} • {item.edad} años</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={18} color="#CCC" />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/registro-mascota')}
          >
            <FontAwesome5 name="plus" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Agregar Mascota</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F8F9FA', flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#222' },
  list: { paddingVertical: 10 },
  petCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  avatar: { width: 70, height: 70, backgroundColor: '#FFF5E9', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  petInfo: { flex: 1, marginLeft: 16 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  petType: { fontSize: 14, color: '#777', marginTop: 4 },
  emptyCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 40, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#D9A05B', marginTop: 40 },
  infoText: { textAlign: 'center', color: '#666', marginBottom: 20 },
  mainButton: { backgroundColor: '#D9A05B', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  addButton: { backgroundColor: '#D9A05B', flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, marginTop: 20, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});
