import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import DrawerMenu from '../components/drawer-menu';
import GalletasScreen from './galletas';
import HomeScreen from './home';
import MisMascotasScreen from './mis-mascotas';
import PerfilScreen from './perfil';
import ServiciosScreen from './servicios';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export default function TabsLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#4ECDC4',
          tabBarInactiveTintColor: '#BDC3C7',
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';

            if (route.name === 'home') iconName = 'home';
            else if (route.name === 'servicios') iconName = 'calendar';
            else if (route.name === 'mis-mascotas') iconName = 'paw';
            else if (route.name === 'galletas') iconName = 'coins';
            else if (route.name === 'perfil') iconName = 'user-circle';

            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="home"
          options={{ title: 'Inicio' }}
          initialParams={{ onMenuPress: toggleMenu }}
        >
          {(props) => <HomeScreen {...props} onMenuPress={toggleMenu} />}
        </Tab.Screen>

        <Tab.Screen
          name="servicios"
          options={{ title: 'Servicios' }}
          initialParams={{ onMenuPress: toggleMenu }}
        >
          {(props) => <ServiciosScreen {...props} onMenuPress={toggleMenu} />}
        </Tab.Screen>

        <Tab.Screen
          name="mis-mascotas"
          options={{ title: 'Mascotas' }}
          initialParams={{ onMenuPress: toggleMenu }}
        >
          {(props) => <MisMascotasScreen {...props} onMenuPress={toggleMenu} />}
        </Tab.Screen>

        <Tab.Screen
          name="galletas"
          options={{ title: 'Galletas' }}
          initialParams={{ onMenuPress: toggleMenu }}
        >
          {(props) => <GalletasScreen {...props} onMenuPress={toggleMenu} />}
        </Tab.Screen>

        <Tab.Screen
          name="perfil"
          options={{ title: 'Perfil' }}
          initialParams={{ onMenuPress: toggleMenu }}
        >
          {(props) => <PerfilScreen {...props} onMenuPress={toggleMenu} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* Drawer Menu */}
      <DrawerMenu
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false);
          Animated.timing(slideAnim, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }}
      />

      {/* Overlay cuando menú abierto */}
      {menuVisible && (
        <View style={styles.overlay} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
