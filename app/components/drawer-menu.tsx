import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth } from '../firebaseConfig';

const { width } = Dimensions.get('window');

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { id: 'configuracion', label: 'Configuración', icon: 'cog' },
    { id: 'ayuda', label: 'Ayuda', icon: 'question-circle' },
    { id: 'soporte', label: 'Soporte', icon: 'headset' },
    { id: 'historial', label: 'Historial', icon: 'history' },
  ];

  const handleMenuPress = (itemId: string) => {
    onClose();
    switch (itemId) {
      case 'configuracion':
        router.push('/configuracion');
        break;
      case 'ayuda':
        router.push('/ayuda');
        break;
      case 'soporte':
        router.push('/soporte');
        break;
      case 'historial':
        router.push('/historial');
        break;
      default:
        break;
    }
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/role-selection');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <>
      {/* Drawer */}
      <View style={styles.drawer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header del Drawer */}
          <View style={styles.drawerHeader}>
            <View style={styles.avatarContainer}>
              <FontAwesome5 name="user-circle" size={48} color="#4ECDC4" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Mi Perfil</Text>
              <Text style={styles.userEmail}>Ver configuración</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Menu Items */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <FontAwesome5 name={item.icon} size={18} color="#2C3E50" />
              <Text style={styles.menuItemText}>{item.label}</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#BDC3C7" />
            </TouchableOpacity>
          ))}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Tema */}
          <View style={styles.themeSection}>
            <View style={styles.themeSectionHeader}>
              <FontAwesome5 name="moon" size={18} color="#2C3E50" />
              <Text style={styles.themeSectionTitle}>Modo Oscuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#4ECDC4' }}
              thumbColor={darkMode ? '#fff' : '#fff'}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Cerrar Sesión */}
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleCerrarSesion}
          >
            <FontAwesome5 name="sign-out-alt" size={18} color="#E74C3C" />
            <Text style={[styles.menuItemText, styles.logoutText]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Footer */}
        <View style={styles.drawerFooter}>
          <Text style={styles.versionText}>miMejorAmigo v1.0.1</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.85,
    backgroundColor: 'white',
    zIndex: 1000,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  themeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  themeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 11,
    color: '#BDC3C7',
  },
});
