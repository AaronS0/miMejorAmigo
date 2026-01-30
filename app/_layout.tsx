import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState<'index' | 'role-selection' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado, ir a home
        setInitialRoute('index');
      } else {
        // Usuario no autenticado, ir a selección de rol
        setInitialRoute('role-selection');
      }
      SplashScreen.hideAsync();
    });

    return unsubscribe;
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}