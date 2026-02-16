import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { auth, db } from '../../firebaseConfig';

const { width } = Dimensions.get('window');

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Animación del drawer
  const slideAnim = useRef(new Animated.Value(-width * 0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Obtener el rol del usuario
    const fetchUserRole = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const userDoc = await getDoc(doc(db, 'usuarios', userId));
          if (userDoc.exists()) {
            setUserRole(userDoc.data()?.rol);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (visible) {
      // Abrir drawer con animación
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Cerrar drawer con animación
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width * 0.85,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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
      case 'tablero-misiones':
        router.push('/prestador/tablero-misiones');
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
      {/* Animated Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Animated Drawer */}
      <Animated.View
        style={[
          styles.drawerWrapper,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={[styles.drawer, { backgroundColor: colors.surface }]}>
          {/* Close Button */}
          <View style={styles.closeButtonRow}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome5 name="times" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header del Drawer */}
            <View style={styles.drawerHeader}>
              <View style={styles.avatarContainer}>
                <FontAwesome5 name="user-circle" size={48} color="#4ECDC4" />
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>Mi Perfil</Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>Ver configuración</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Menu Items */}
            {userRole === 'prestador' && (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('tablero-misiones')}
                >
                  <FontAwesome5 name="briefcase" size={18} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Tablero de Misiones</Text>
                  <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            )}
            
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.id)}
              >
                <FontAwesome5 name={item.icon} size={18} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
                <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Información */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onClose();
                router.push('informacion' as any);
              }}
            >
              <FontAwesome5 name="info-circle" size={18} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Información</Text>
              <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Tema */}
            <View style={styles.themeSection}>
              <View style={styles.themeSectionHeader}>
                <FontAwesome5 name="moon" size={18} color={colors.text} />
                <Text style={[styles.themeSectionTitle, { color: colors.text }]}>Modo Oscuro</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#E0E0E0', true: '#4ECDC4' }}
                thumbColor={isDarkMode ? '#fff' : '#fff'}
              />
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Cerrar Sesión */}
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleCerrarSesion}
            >
              <FontAwesome5 name="sign-out-alt" size={18} color="#E74C3C" />
              <Text style={[styles.menuItemText, styles.logoutText, { color: '#E74C3C' }]}>
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.drawerFooter, { borderTopColor: colors.border }]}>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>miMejorAmigo v1.1.0</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  drawerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    zIndex: 1000,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    pointerEvents: 'box-none',
  },
  drawer: {
    flex: 1,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  closeButtonRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
    marginRight: 4,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  divider: {
    height: 1,
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
    alignItems: 'center',
    marginTop: 'auto',
  },
  versionText: {
    fontSize: 11,
  },
});
