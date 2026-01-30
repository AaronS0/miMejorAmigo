import { Stack } from 'expo-router';

export default function ServicioLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="[id]/index"
        options={{
          title: 'Seleccionar Mascota',
        }}
      />
      <Stack.Screen
        name="[id]/calendario"
        options={{
          title: 'Seleccionar Fecha',
        }}
      />
      <Stack.Screen
        name="[id]/hora"
        options={{
          title: 'Seleccionar Hora',
        }}
      />
      <Stack.Screen
        name="[id]/prestadores"
        options={{
          title: 'Prestadores',
        }}
      />
      <Stack.Screen
        name="[id]/perfil-prestador"
        options={{
          title: 'Perfil',
        }}
      />
      <Stack.Screen
        name="[id]/confirmacion"
        options={{
          title: 'Confirmación',
        }}
      />
    </Stack>
  );
}
