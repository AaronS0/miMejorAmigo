# Integración: Home → Flujo de Servicios

## 🔗 Cómo funciona el flujo desde HOME

### Diagrama de Navegación

```
┌─────────────────────────────────────┐
│     HOME SCREEN (home.tsx)          │
├─────────────────────────────────────┤
│                                     │
│  ¡Hola, María!      ☰ Menú         │
│  ¿Qué necesita tu mascota?          │
│                                     │
│  💰 Saldo: 50 galletas              │
│                                     │
│  [🚶] [🏠] [🚿] [❤️] [📚] [⚕️]        │
│  Paseo  Casa  Baño  Pareja  Adiestra  Vet
│                                     │
└─────────────────────────────────────┘
         Tap en "Paseo"
         ↓
router.push('/servicio/paseo')
         ↓
┌──────────────────────────────────────┐
│ /servicio/[id]/_layout.tsx           │
│ (Stack Navigator config)             │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ SELECCIONAR MASCOTA                  │
│ /servicio/[id]/index.tsx             │
│                                      │
│ Mascotas del usuario:                │
│ ✓ Max (Grande)                       │
│   Mittens (Pequeña)                  │
│                                      │
│ [Continuar]                          │
└──────────────────────────────────────┘
    ↓ (mascotaId, mascotaTamaño)
┌──────────────────────────────────────┐
│ CALENDARIO                           │
│ /servicio/[id]/calendario.tsx        │
│                                      │
│ Próximas fechas disponibles          │
│ Calendario con puntos azules         │
│                                      │
│ [Continuar]                          │
└──────────────────────────────────────┘
    ↓ (fecha)
┌──────────────────────────────────────┐
│ HORA                                 │
│ /servicio/[id]/hora.tsx              │
│                                      │
│ 09:00 - 3 prestadores               │
│ 10:00 - 2 prestadores               │
│ 14:00 - 4 prestadores               │
│                                      │
│ [Ver Prestadores]                    │
└──────────────────────────────────────┘
    ↓ (hora)
┌──────────────────────────────────────┐
│ PRESTADORES                          │
│ /servicio/[id]/prestadores.tsx       │
│                                      │
│ Juan García     ⭐4.9 • 📍 0.6 km   │
│ Carlos López    ⭐4.5 • 📍 2.1 km   │
│                                      │
│ [Ver Perfil]                         │
└──────────────────────────────────────┘
    ↓ (prestadorId)
┌──────────────────────────────────────┐
│ PERFIL PRESTADOR                     │
│ /servicio/[id]/perfil-prestador.tsx  │
│                                      │
│ Juan García                          │
│ ⭐ 4.9 (25 servicios)                │
│ 5 años de experiencia                │
│ Especialidades, Mascotas, Contacto   │
│                                      │
│ Reserva: Max - 2026-02-08 14:00      │
│ Costo: 15 galletas                   │
│                                      │
│ [Confirmar Reserva]                  │
└──────────────────────────────────────┘
    ↓ (precio)
┌──────────────────────────────────────┐
│ CONFIRMACIÓN                         │
│ /servicio/[id]/confirmacion.tsx      │
│                                      │
│ Resumen Final:                       │
│ - Prestador: Juan García             │
│ - Fecha: 08/02/2026                  │
│ - Hora: 14:00                        │
│ - Mascota: Max                       │
│ - Costo: 15 galletas                 │
│                                      │
│ Saldo actual: 50 → 35 galletas       │
│                                      │
│ [Cancelar] [Confirmar]               │
└──────────────────────────────────────┘
    ↓ (CREATE RESERVA + UPDATE SALDO)
┌──────────────────────────────────────┐
│ ✅ ÉXITO                             │
│                                      │
│ ¡Reserva Confirmada!                 │
│                                      │
│ Detalles finales...                  │
│                                      │
│ [Volver al Inicio]                   │
└──────────────────────────────────────┘
    ↓
router.push('/(tabs)/home')
    ↓
┌─────────────────────────────────────┐
│     HOME ACTUALIZADO                │
│     Saldo: 35 galletas ✅            │
│     Próximas Reservas:               │
│     - Paseo con Juan García          │
│       08/02/2026 a las 14:00         │
└─────────────────────────────────────┘
```

---

## 📝 Implementación en Home

### Código Actual (ya está implementado)

```typescript
// app/(tabs)/home.tsx

const handleServicePress = (serviceId: string) => {
  router.push(`/servicio/${serviceId}`);
};

// En el grid de servicios:
{SERVICIOS.map((servicio) => (
  <TouchableOpacity
    key={servicio.id}
    style={[styles.servicioCard, { backgroundColor: servicio.color }]}
    onPress={() => handleServicePress(servicio.id)}  // ← Esto navega!
  >
    <FontAwesome5 name={servicio.icon} size={32} color="white" />
    <Text style={styles.servicioNombre}>{servicio.nombre}</Text>
  </TouchableOpacity>
))}
```

### Flujo de Parámetros

```
HOME
│
├─ SERVICIOS:
│  ├─ 'paseo' → router.push('/servicio/paseo')
│  ├─ 'guarderia' → router.push('/servicio/guarderia')
│  ├─ 'banio' → router.push('/servicio/banio')
│  └─ etc...
│
└─ BOTÓN "Agendar Servicio"
   └─ router.push('/servicio/paseo') ← Predefinido al paseo

[id]/index.tsx
├─ Recibe: { id: 'paseo' }
├─ userLocation obtiene ubicación del usuario
├─ mascotas carga desde Firestore
└─ Pasa a siguiente: { id, mascotaId, mascotaTamaño }

[id]/calendario.tsx
├─ Recibe: { id, mascotaId, mascotaNombre, mascotaTamaño }
├─ Filtra prestadores con disponibilidad
└─ Pasa: { id, mascotaId, mascotaNombre, mascotaTamaño, fecha }

[id]/hora.tsx
├─ Recibe: { id, mascotaId, mascotaNombre, mascotaTamaño, fecha }
├─ Genera horas disponibles
└─ Pasa: { id, mascotaId, mascotaNombre, mascotaTamaño, fecha, hora }

[id]/prestadores.tsx
├─ Recibe: { id, mascotaId, mascotaNombre, mascotaTamaño, fecha, hora }
├─ Filtra por ubicación
└─ Pasa: { id, mascotaId, mascotaNombre, mascotaTamaño, fecha, hora, prestadorId, precio }

[id]/perfil-prestador.tsx
├─ Recibe: { id, mascotaId, mascotaNombre, mascotaTamaño, fecha, hora, prestadorId, prestadorNombre, precio }
└─ Pasa: mismos parámetros

[id]/confirmacion.tsx
├─ Recibe: todos los anteriores
├─ CREATE Reserva en Firestore
├─ UPDATE saldo en usuarios
├─ CREATE Transacción
└─ router.push('/(tabs)/home') ← Vuelve al inicio!
```

---

## 🔄 Actualización de Home después de Reserva

### Lo que sucede

1. **Confirmación exitosa**
   ```typescript
   // En confirmacion.tsx
   setReservaConfirmada(true);
   ```

2. **Pantalla de éxito**
   ```typescript
   const handleVolver = () => {
     router.push({
       pathname: '/(tabs)/home',
     });
   };
   ```

3. **Home se actualiza**
   ```typescript
   // En home.tsx - useEffect con navigation listener
   useEffect(() => {
     let active = true;
     const fetchUserData = async () => {
       // Obtiene usuario actualizado
       const userInfo = docSnap.data();
       setUserData(userInfo); // ← saldoGalletas ahora es 35
     };
     
     const unsubscribe = navigation.addListener('focus', () => {
       fetchUserData(); // Se ejecuta cada vez que vuelve al home
     });
     
     return () => { active = false; unsubscribe(); };
   }, [navigation]);
   ```

4. **Saldo actualizado visualmente**
   ```typescript
   <Text style={styles.balanceAmount}>
     {userData?.saldoGalletas || 0} galletas  {/* ← Ahora 35 */}
   </Text>
   ```

---

## 🎯 Puntos de Integración

### 1. Navegación
- ✅ Home llama a `/servicio/{id}` ← YA IMPLEMENTADO
- ✅ Stack Navigator configurado en `_layout.tsx`
- ✅ Todas las transiciones funcionan

### 2. Datos
- ✅ Flujo pasa datos correctamente entre pantallas
- ✅ Cada pantalla obtiene lo que necesita de Firestore
- ✅ Confirmación guarda todo correctamente

### 3. Actualización
- ✅ Home detecta cambios (navigation.addListener)
- ✅ Saldo se actualiza automáticamente
- ✅ Próximas reservas se mostrarían (no implementado aún)

---

## 📊 Testing del Flujo Completo

### Test Case 1: Reserva exitosa

**Precondiciones:**
- Usuario autenticado
- Saldo: 50 galletas
- Mascota registrada: Max (grande)
- Prestadores en la BD con horarios definidos

**Pasos:**
```
1. Home → Tap "Paseo"
2. Selecciona mascota → Max
3. Selecciona fecha → 08/02/2026
4. Selecciona hora → 14:00
5. Selecciona prestador → Juan García
6. Revisa perfil → Tap "Confirmar"
7. Confirma en modal → saldo suficiente
8. RESULTADO: ✅ Éxito
```

**Verificación:**
- Firestore:
  - ✅ Documento en `/reservas/{id}`
  - ✅ `usuarios/{uid}.saldoGalletas = 35`
  - ✅ Transacción en `/usuarios/{uid}/transacciones`
- App:
  - ✅ Home muestra saldo 35
  - ✅ Próximas reservas actualizado (si se implementa)

### Test Case 2: Saldo insuficiente

**Precondiciones:**
- Usuario con saldo: 10 galletas
- Precio servicio: 15 galletas

**Pasos:**
```
1-7. Igual a Test Case 1
8. En confirmación: saldoGalletas < precio
9. RESULTADO: Alert "Saldo insuficiente"
```

**Verificación:**
- ✅ Botón "Confirmar" deshabilitado
- ✅ No se crea reserva
- ✅ Saldo no cambia
- ✅ Usuario vuelve al inicio sin cambios

---

## 🚀 Cómo Activar en Producción

### 1. Verificar setup

```bash
# Terminal: Verificar que todo está en sync
npm install  # Si hay cambios en package.json
npm start    # O npx expo start
```

### 2. Verificar rutas

```typescript
// En cualquier navegador de Expo
// Presionar 's' para abrir menú
// Si ves las rutas sin errores, estamos bien
```

### 3. Probar flujo completo

```
1. Login como usuario
2. Home → Tap servicio
3. Completar flujo hasta confirmación
4. Verificar Firestore Console que se creó la reserva
5. Verificar Home actualizado con nuevo saldo
```

### 4. Verificar en Firestore

**Documentos que deben existir:**

Ruta: `usuarios/{uid}`
```json
{
  "saldoGalletas": 35  // Descuento aplicado
}
```

Ruta: `reservas/{newDocId}`
```json
{
  "idUsuario": "{uid}",
  "idPrestador": "juan_456",
  "idMascota": "max_789",
  "tipoServicio": "paseo",
  "estado": "confirmada",
  "costoTotal": 15,
  "fecha": "2026-02-08",
  "hora": "14:00"
}
```

Ruta: `usuarios/{uid}/transacciones/{docId}`
```json
{
  "tipo": "PAGO",
  "monto": 15,
  "descripcion": "Pago por paseo con Juan García",
  "idReserva": "{reservaDocId}"
}
```

---

## 🔐 Validaciones Críticas

Verificar que se validan:

1. **Saldo** ✅
   - Rechaza si saldoGalletas < precio
   
2. **Disponibilidad** ✅
   - Solo muestra fechas con prestadores
   - Solo muestra horas disponibles
   
3. **Ubicación** ✅
   - Solo muestra prestadores en zona
   - Calcula distancia correctamente
   
4. **Mascota** ✅
   - Solo muestra prestadores que aceptan tamaño

---

## 📱 Ejemplo de Pantalla Home Actualizada

### Antes de reserva
```
¡Hola, María!
¿Qué necesita tu mascota hoy?

💰 Saldo de Galletas
50 galletas [Recargar]

Próximas Reservas
📋 No tienes reservas próximas
[Agendar Servicio]
```

### Después de reserva
```
¡Hola, María!
¿Qué necesita tu mascota hoy?

💰 Saldo de Galletas
35 galletas [Recargar]  ← ACTUALIZADO

Próximas Reservas
🐕 Paseo con Juan García
   08/02/2026 a las 14:00 ← NUEVO (si se implementa)
   [Ver Detalles]
```

---

## ⚠️ Posibles Problemas y Soluciones

### Problema 1: "No puedo navegar al servicio"
**Solución:** Verificar que `handleServicePress` está correctamente implementado en home.tsx

### Problema 2: "Parámetros no llegan a siguiente pantalla"
**Solución:** Verificar `useLocalSearchParams()` en cada pantalla

### Problema 3: "Saldo no se actualiza"
**Solución:** Verificar que `navigation.addListener` está en useEffect del home

### Problema 4: "Reserva no se crea en Firestore"
**Solución:** Verificar Firebase rules permitan CREATE en `/reservas`

### Problema 5: "Distancia no se calcula bien"
**Solución:** Verificar que prestador y usuario tienen latitud/longitud

---

## 📚 Referencias Rápidas

### Rutas Principales
- Home: `app/(tabs)/home.tsx`
- Servicio Layout: `app/servicio/_layout.tsx`
- Flujo: `app/servicio/[id]/*.tsx`

### Parámetros Clave
- `id`: tipo de servicio (paseo, guarderia, etc.)
- `mascotaId`: ID de la mascota seleccionada
- `mascotaTamaño`: tamaño (grande, pequeño, mediano)
- `fecha`: YYYY-MM-DD
- `hora`: HH:00
- `prestadorId`: UID del prestador
- `precio`: costo en galletas

### Funciones Críticas
- `handleServicePress()` → inicia flujo
- `calcularDistancia()` → Haversine
- `handleConfirmarReserva()` → crea reserva y paga

---

## ✅ Checklist de Integración

- ✅ Home navega a servicios
- ✅ Flujo completo conectado
- ✅ Datos pasan correctamente
- ✅ Firestore actualiza saldo
- ✅ Home se actualiza al volver
- ✅ Errores manejan correctamente
- ✅ Validaciones funcionan
- ✅ Testing manual exitoso

---

**Estado:** 🟢 LISTO PARA USAR

El flujo está completamente integrado y funcionando desde Home hasta Confirmación.
