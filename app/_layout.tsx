import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Esto evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Luego, cuando ya tengas los datos, usas:
SplashScreen.hideAsync();
  return (
    <Stack screenOptions={{ headerShown: false }}>
       {/* Tus pantallas */}
    </Stack>
  );
}