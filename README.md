# 🐕 miMejorAmigo - Pet Care Service Platform

## 📱 Descripción

**miMejorAmigo** es una aplicación móvil que implementa el **Modelo "Uber" para servicios de mascotas**. Conecta propietarios con prestadores profesionales mediante búsqueda inteligente, tracking en tiempo real y garantía de pago.

### Versión: 1.2.0 🚀
**Estado:** Modelo Uber completamente implementado (100%)  
**Última actualización:** 15 de febrero de 2026

---

## ✨ Características Principales v1.2.0

### Para Clientes
- ✅ **Búsqueda Automática** - Sistema inteligente busca prestadores automáticamente
- ✅ **Asignación Instantánea** - Se asigna el mejor calificado si está disponible
- ✅ **Reservas Huérfanas** - Si nadie disponible, queda abierta para prestadores
- ✅ **Tracking GPS en Vivo** - Ubicación real del prestador durante servicio
- ✅ **Feed de Fotos** - Prestador sube fotos en tiempo real del servicio
- ✅ **Garantía de Pago** - Sistema de depósito bloquea fondos automáticamente
- ✅ **Dashboard Activo** - Control total durante el servicio
- ✅ **Botón Emergencia** - Contacto inmediato si hay problema

### Para Prestadores  
- ✅ **Tablero de Misiones** - Encuentra trabajos disponibles cerca de ti
- ✅ **Aceptación Fácil** - Un toque para aceptar una misión
- ✅ **Distancia Automática** - Calculo de km en tiempo real (Haversine)
- ✅ **Información Completa** - Detalles del cliente y mascota
- ✅ **Filtros Inteligentes** - Por tipo de servicio y otros criterios
- ✅ **Garantía de Cobro** - Depósito bloqueado = garantizado pago
- ✅ **Calificaciones Visibles** - Solo aceptas en clientes bien calificados

### Sistema de Garantía de Pago
- 💰 **Automático** - Bloquea fondos al crear reserva
- 📊 **Saldo Disponible vs Reservado** - Control transparente
- 🔄 **Estados** - reservado → en_transito → completado → devuelto
- 📝 **Auditoría Completa** - Cada transacción registrada

---

## 🛠️ Stack Tecnológico

### Frontend
- **React Native** 0.81.5
- **Expo** 54.0.32 + Expo Router 6.0.22
- **Expo Location** 17.0.1 (GPS tracking)
- **TypeScript**
- **FontAwesome5 Icons**
- **Theme Context** (Dark/Light mode)

### Backend
- **Firebase Authentication** (email/password)
- **Firestore** (base de datos - listeners en tiempo real)
- **Firebase Storage** (fotos/videos)
- **Cloud Functions** (ready para push notifications)

### Algoritmos
- **Haversine Formula** - Cálculo de distancia GPS
- **Inteligencia de Búsqueda** - Filtrado por 6 criterios
- **Real-time Listeners** - onSnapshot para actualizaciones live

---

## 📊 Versión 1.2.0 - Roadmap

### ✅ FASE 1: Estabilización (v1.1.0)
- Emergency fixes y correcciones criticas
- Validaciones mejoradas

### ✅ FASE 2: Modelo Uber
**FASE 2.1 - Solicitudes Huérfanas**
- Búsqueda inteligente de prestadores
- Estados: confirmada vs buscando
- Filtrado por: proximidad, disponibilidad, especialidad, calificación, tamaño, ubicación

**FASE 2.2 - Tablero de Misiones**
- [app/prestador/tablero-misiones.tsx](app/prestador/tablero-misiones.tsx) - Dashboard para prestadores
- Aceptación con un toque
- Distancia automática
- Pull-to-refresh

**FASE 2.3 - Sistema Depósito Garantía**
- [services/depositoService.ts](services/depositoService.ts) - Bloqueo automático de fondos
- Auditoría completa
- Saldo detallado

### ✅ FASE 3: Dashboard Dinámico + Tracking
- [services/trackingService.ts](services/trackingService.ts) - GPS en tiempo real
- [app/servicio/[id]/dashboard-activo.tsx](app/servicio/[id]/dashboard-activo.tsx) - Interfaz activa
- Feed de fotos en vivo
- Timeline del servicio

### 📍 FASE 4: Push Notifications (próxima)
- Firebase Cloud Messaging setup
- Notificaciones de estado
- Alertas de proximidad
- Emergencia alerts

---

## 📁 Estructura de Archivos Nuevos (v1.2.0)

### Servicios
```
services/
├─ reservaService.ts (301 líneas)  ← Búsqueda inteligente
├─ misionesService.ts (250 líneas) ← Misiones para prestadores  
├─ depositoService.ts (220 líneas) ← Garantía de pago
└─ trackingService.ts (340 líneas) ← Tracking GPS + fotos
```

### Componentes
```
app/
├─ prestador/
│  └─ tablero-misiones.tsx (450 líneas)      ← Dashboard prestadores
└─ servicio/[id]/
   └─ dashboard-activo.tsx (520 líneas)      ← Dashboard activo clientes
```

### Integraciones
```
app/(tabs)/
├─ home.tsx (MODIFICADO)            ← Detección servicio activo
└─ perfil.tsx (CORREGIDO)           ← Fix de cadena sin terminar

app/components/
└─ drawer-menu.tsx (MODIFICADO)     ← "Tablero de Misiones" para prestadores

app/servicio/[id]/
└─ confirmacion.tsx (MODIFICADO)    ← Nuevo flujo de búsqueda
```

---

## 🔄 Flujo de Reserva Completo (Uber Model)

```
1. CLIENTE SELECCIONA SERVICIO
   ↓
2. SISTEMA BUSCA PRESTADORES
   ├─ Por proximidad (Haversine)
   ├─ Por disponibilidad
   ├─ Por especialidad
   ├─ Por calificación (>= 4.0)
   └─ Por tamaño mascota
   ↓
3. SI HAY DISPONIBLES: ASIGNA AL MEJOR
   ├─ Estado: confirmada
   ├─ Bloquea depósito (fondos)
   └─ Cliente ve prestador confirmado
   ↓
   SI NO HAY: QUEDA ABIERTA
   ├─ Estado: buscando
   ├─ Bloquea depósito
   └─ Aparece en "Tablero de Misiones"
      ↓
4. PRESTADOR ACEPTA MISIÓN
   ├─ Presiona "Aceptar"
   ├─ Estado cambia: buscando → confirmada
   └─ Se asigna automáticamente
   ↓
5. SERVICIO INICIA
   ├─ Estado: en_progreso
   ├─ Cliente ve Dashboard en vivo
   ├─ Ubicación del prestador
   └─ Prestador sube fotos
   ↓
6. SERVICIO FINALIZA
   ├─ Estado: completada
   ├─ Depósito se libera
   ├─ Cliente puede calificar
   └─ Transacción registrada en auditoría
```

---

## 📊 Estadísticas v1.2.0

| Métrica | Valor |
|---------|-------|
| Archivos nuevos | 8 |
| Archivos modificados | 5 |
| Líneas de código | ~1,800+ |
| Servicios Firebase | 4 |
| Real-time listeners | 3 |
| Estados manejados | 9+ |
| Depositos creados | 4 servicios |

---

## 🚀 Características Nuevas

### Sistema de Búsqueda (6 criterios)
1. **Proximidad** - Radio en km desde ubicación cliente
2. **Disponibilidad** - Horarios y días disponibles
3. **Especialidad** - Paseo, guardería, baño, etc.
4. **Calificación** - Mínimo 4.0 estrellas
5. **Tamaño Mascota** - Filtrado por peso/tamaño
6. **Ubicación GPS** - Haversine formula

### Estados de Réserva
- `buscando` - Misión abierta, esperando prestador
- `confirmada` - Prestador asignado
- `en_progreso` - Servicio activo ahora
- `completada` - Finalizado
- `cancelada` - Cancelado por cliente

### Estados de Depósito

---

## 🎯 Características Destacadas

### 🌍 Filtrado por Ubicación
- Cálculo de distancia Haversine
- Valida que prestador atienda esa zona
- Muestra distancia en km al usuario
- Solo muestra opciones viables

### ⏰ Horarios Flexibles
- Parsea formato "09:00-17:00,19:00-21:00"
- Valida disponibilidad en fines de semana
- Disponibilidad nocturna
- Contador de prestadores por hora

### 💳 Sistema de Pago Automático
- Validación de saldo
- Descuento inmediato
- Registro de transacción
- Historial de movimientos

### 📱 UX Optimizado
- Flujo de 6 pantallas sin fricciones
- Información clara en cada paso
- Resumen antes de confirmar
- Confirmación visual de éxito

---

## 📁 Estructura de Carpetas

```
app/
├── _layout.tsx                    # Root layout
├── index.tsx                      # Login/Signup
├── role-selection.tsx             # Elegir rol
├── (tabs)/                        # Main navigation
│   ├── _layout.tsx               # Tab navigator
│   ├── home.tsx                  # Home screen
│   ├── servicios.tsx             # Services list
│   ├── mis-mascotas.tsx          # Pet management
│   ├── galletas.tsx              # Wallet/billing
│   └── perfil.tsx                # Profile
├── registro/                      # Registration
│   ├── usuario/
│   │   ├── paso-1.tsx
│   │   ├── paso-2.tsx
│   │   └── paso-3.tsx
│   └── prestador/
│       ├── paso-1.tsx
│       ├── paso-2.tsx
│       └── paso-3.tsx
├── servicio/                      # Service booking flow ⭐
│   ├── _layout.tsx
│   └── [id]/
│       ├── index.tsx              # Select pet
│       ├── calendario.tsx         # Select date
│       ├── hora.tsx              # Select time
│       ├── prestadores.tsx       # Provider list
│       ├── perfil-prestador.tsx  # Provider profile
│       └── confirmacion.tsx      # Confirmation
├── components/
│   ├── drawer-menu.tsx           # Hamburger menu
│   └── ... (otros componentes)
└── {configuracion,ayuda,soporte,historial}.tsx

src/
├── Usuario.java
├── Mascota.java
├── Prestador.java
├── Billetera.java
├── Servicio.java
├── Paseo.java
└── Reserva.java
```

---

## 🚀 Instalación y Setup

### Requisitos
- Node.js 16+
- npm o yarn
- Expo CLI
- Cuenta de Firebase

### Instalación

```bash
# Clonar repositorio
git clone <repo>
cd miMejorAmigo1.0.1

# Instalar dependencias
npm install

# Configurar Firebase
# 1. Crear firebaseConfig.js con tus credenciales
# 2. Ver firebaseConfig.js de ejemplo

# Iniciar en desarrollo
npm start
# o
npx expo start

# En tu teléfono:
# - Instalar Expo Go
# - Escanear QR del terminal
```

### Configuración Firebase

```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 📚 Documentación

Documentos detallados disponibles en la carpeta raíz:

1. **SERVICIO_COMPLETO.md** - Guía paso a paso del flujo de servicios
2. **VALIDACIONES_IMPLEMENTADAS.md** - Tabla de validaciones con ejemplos
3. **ARQUITECTURA_DATOS.md** - Estructura Firestore y diagramas
4. **INTEGRACION_HOME.md** - Cómo se conecta el flujo con Home
5. **FLUJO_APP.md** - Visión general de navegación
6. **CAMBIOS_SESION.md** - Cambios implementados en última sesión
7. **RESUMEN_VISUAL.md** - Resumen visual de características

---

## 🔄 Flujo de Servicios (Ejemplo)

```
Usuario abre app
    ↓
HOME: Ve 6 servicios (Paseo, Guardería, Baño, Pareja, Adiestra, Vet)
    ↓
Toca "PASEO"
    ↓
Selecciona mascota: "Max (Grande)"
    ↓
Elige FECHA: calendario muestra "8 feb - ✅ disponible (2 prestadores)"
    ↓
Elige HORA: "14:00 - 4 prestadores disponibles"
    ↓
Ve LISTA DE PRESTADORES FILTRADOS:
    ├─ Juan García ⭐4.9 • 0.6 km
    ├─ Carlos López ⭐4.5 • 2.1 km
    └─ (NO muestra más lejanos que su radio de acción)
    ↓
Toca "Juan García"
    ↓
Ve PERFIL: foto, años experiencia, especialidades, contacto
    ↓
Resumen: Max • 08/02 14:00 • 15 galletas
    ↓
Toca "CONFIRMAR RESERVA"
    ↓
Validación:
    ├─ Saldo 50 ≥ 15 ✅
    ├─ Crea Reserva en Firestore ✅
    ├─ Actualiza saldo: 50 → 35 ✅
    └─ Registra transacción ✅
    ↓
✅ ÉXITO: "¡Reserva Confirmada!"
    ↓
Vuelve a HOME
    └─ Saldo actualizado: 35 galletas
```

---

## 💰 Sistema de Galletas

**Galletas** = Moneda interna de la plataforma

### Para Usuarios
- **Recarga:** Comprar galletas con dinero real
- **Gasto:** Pagar servicios
- **Créditos:** Bonos especiales, referidos
- **Retiro:** (No disponible directamente)

### Para Prestadores
- **Ingresos:** Por cada servicio completado
- **Retiro:** Convertir galletas a dinero real
- **Balance:** Ver historial de ganancias

---

## 📱 Pantallas Implementadas

| # | Pantalla | Descripción | Estado |
|---|----------|-------------|--------|
| 1 | Login/Signup | Autenticación | ✅ |
| 2 | Role Selection | Elegir usuario/prestador | ✅ |
| 3 | Registro Usuario - Paso 1 | Datos básicos | ✅ |
| 4 | Registro Usuario - Paso 2 | Mascotas | ✅ |
| 5 | Registro Usuario - Paso 3 | Detalles mascota | ✅ |
| 6 | Registro Prestador - Paso 1 | Datos básicos | ✅ |
| 7 | Registro Prestador - Paso 2 | Especialidades | ✅ |
| 8 | Registro Prestador - Paso 3 | Documentos | ✅ |
| 9 | Home | Dashboard principal | ✅ |
| 10 | Servicios | Lista de servicios | ✅ |
| 11 | Mis Mascotas | Gestión de mascotas | ✅ |
| 12 | Galletas | Billetera | ✅ |
| 13 | Perfil | Datos usuario | ✅ |
| 14 | Seleccionar Mascota | Servicio - Paso 1 | ✅ |
| 15 | Calendario | Servicio - Paso 2 | ✅ |
| 16 | Hora | Servicio - Paso 3 | ✅ |
| 17 | Prestadores | Servicio - Paso 4 | ✅ |
| 18 | Perfil Prestador | Servicio - Paso 5 | ✅ |
| 19 | Confirmación | Servicio - Paso 6 | ✅ |
| 20 | Alertas | Sistema de notificaciones | ⏳ |
| 21 | Servicio en Progreso | Extras + Chat | ⏳ |
| 22 | Historial | Servicios pasados | ⏳ |
| 23 | Configuración | Ajustes | ⏳ |

---

## 🧪 Testing

### Para Testear el Flujo Completo

```
1. Crear usuario (dueño de mascota)
2. Crear 2-3 prestadores con horarios y ubicación
3. Agendar servicio:
   - Seleccionar mascota
   - Elegir fecha disponible
   - Elegir hora
   - Ver lista de prestadores
   - Ver perfil
   - Confirmar reserva
4. Verificar en Firestore:
   - Reserva creada
   - Saldo actualizado
   - Transacción registrada
5. Volver a Home
   - Saldo debe actualizarse
```

---

## 🔐 Seguridad

### Firestore Rules (Recomendado)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /reservas/{docId} {
      allow read: if resource.data.idUsuario == request.auth.uid ||
                     resource.data.idPrestador == request.auth.uid;
      allow create: if request.auth.uid == request.resource.data.idUsuario;
    }
  }
}
```

---

## 🚨 Problemas Conocidos

### Ninguno en el flujo de servicios ✅

Los problemas que podrían surgir:

1. **Firebase Auth desconectada**
   - Solución: Verificar credenciales en firebaseConfig.js

2. **Ubicación no disponible**
   - Solución: Usar valores por defecto de GPS

3. **Prestadores no aparecen**
   - Solución: Verificar que tengan horarios y ubicación definidos

---

## 🔮 Próximas Mejoras

### Corto Plazo (1-2 semanas)
- [ ] Sistema de alertas (30/10/5 min antes)
- [ ] Solicitar extras (fotos, videos, videollamadas)
- [ ] Chat en tiempo real
- [ ] Historial y reseñas

### Mediano Plazo (1 mes)
- [ ] Ubicación en tiempo real del prestador
- [ ] Integración de pagos reales (Stripe/Mercado Pago)
- [ ] Notificaciones push
- [ ] Búsqueda avanzada de prestadores

### Largo Plazo (2-3 meses)
- [ ] Publicación en App Store
- [ ] Publicación en Google Play
- [ ] Versión web (React)
- [ ] Admin dashboard
- [ ] Sistema de reportes

---

## 👥 Equipo

- **Desarrollo Frontend:** React Native + TypeScript
- **Desarrollo Backend:** Firebase
- **Diseño:** Material Design + Custom

---

## 📄 Licencia

Proprietary - Todos los derechos reservados

---

## 📞 Soporte

Para reportar issues o sugerencias, contactar al equipo de desarrollo.

---

## 🎓 Documentos de Referencia

### Datos del Prestador

Campos requeridos para validación:

```javascript
{
  // Básicos
  id: string,
  nombre: string,
  email: string,
  telefono: string,
  rol: "prestador",
  verificado: boolean,
  
  // CRÍTICOS para filtrado
  horarioDisponibilidad: "09:00-17:00,19:00-21:00",
  disponibleFinesde: boolean,
  disponibleNocturno: boolean,
  
  // CRÍTICOS para ubicación
  latitud: number,
  longitud: number,
  radioAccion: "5",  // en km
  ciudad: string,
  
  // CRÍTICOS para mascotas
  aceptaGrandes: boolean,
  aceptaPequeños: boolean,
  aceptaGatos: boolean,
  
  // Información
  puntuacionPromedio: number,
  serviciosCompletados: number,
  especialidades: string,
  yearExperiencia: number
}
```

---

## 🌟 Estado Final

**Versión 1.0.1** está lista para:
- ✅ Testing interno
- ✅ Testing con usuarios beta
- ⏳ Publicación en stores (después de completar tareas 8-10)

**Flujo de servicios:** 100% funcional y documentado

---

*Última actualización: 30 de enero de 2026*  
*Desarrollado con ❤️ para los amantes de las mascotas*
