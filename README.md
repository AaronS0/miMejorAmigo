# 🐕 miMejorAmigo - Pet Care Service Platform

## 📱 Descripción

**miMejorAmigo** es una aplicación móvil de servicios para mascotas que conecta propietarios con prestadores profesionales. Permite agendar servicios como paseos, guardería, baño, adiestramiento y más.

### Versión: 1.1.0
**Estado:** En desarrollo (82% completado)  
**Última actualización:** 30 de enero de 2026

---

## ✨ Características Principales

### Para Usuarios (Dueños de mascotas)
- ✅ Registro con datos detallados de mascotas
- ✅ Seleccionar y agendar servicios
- ✅ Ver prestadores disponibles en su zona
- ✅ Sistema interno de moneda ("galletas")
- ✅ Historial de servicios
- ✅ Calificar prestadores
- 🔄 Solicitar extras durante servicio (fotos, videos, videollamadas)

### Para Prestadores
- ✅ Registro con especialidades y certificaciones
- ✅ Definir horarios y zona de cobertura
- ✅ Recibir solicitudes de servicios
- ✅ Gestionar disponibilidad
- ✅ Retirar ganancias en galletas
- 🔄 Enviar fotos/videos de servicios

---

## 🛠️ Stack Tecnológico

### Frontend
- **React Native** 0.81.5
- **Expo** 54.0.32
- **Expo Router** 6.0.22 (file-based routing)
- **React Navigation** 7.1.8 (bottom tabs + drawer)
- **TypeScript**
- **React Native Calendars** (selector de fechas)

### Backend
- **Firebase Authentication** (email/password)
- **Firestore** (base de datos en tiempo real)
- **Firebase Storage** (almacenamiento de fotos/videos)

### Diseño
- **FontAwesome5 Icons**
- **React Native StyleSheet**
- **Diseño responsivo**

---

## 📊 Progreso del Proyecto

```
IMPLEMENTADO:
├─ 19 pantallas de 23 (82%)
├─ Autenticación (login/signup)
├─ Registro de usuario (3 pasos)
├─ Registro de prestador (3 pasos)
├─ Sistema de navegación (tabs + drawer)
├─ Saldo de galletas
├─ Flujo completo de reserva ⭐
│  ├─ Seleccionar mascota
│  ├─ Calendario con validación
│  ├─ Selector de hora
│  ├─ Lista prestadores (filtrada por ubicación)
│  ├─ Perfil prestador
│  └─ Confirmación y pago
└─ Documentación completa

PRÓXIMO:
├─ Sistema de alertas (30/10/5 min antes)
├─ Extras pagables (fotos, videos, llamadas)
├─ Historial y reseñas
└─ Publicación en Google Play / App Store
```

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
