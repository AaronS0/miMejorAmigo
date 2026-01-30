# miMejorAmigo - Estructura de Proyecto Actualizada

## ✅ Cambios Realizados

### 1. **Actualización de Clases Java**
Se expandieron todas las clases del modelo de datos:

- **Usuario.java**: Ahora incluye datos completos (dirección, ciudad, provincia, rol, tipo de prestador, empresa, documentos, calificación)
- **Mascota.java**: Incluye comportamientos, historial clínico, alergias, medicamentos, alimentación, foto, nivel de energía
- **Billetera.java**: Sistema de transacciones completo con historial
- **Servicio.java**: Clase abstracta mejorada con más fields
- **Paseo.java**: Extendida con zona de cobertura
- **Reserva.java**: Nueva clase para gestionar reservas de servicios
- **Prestador.java**: Nueva clase que extiende Usuario con datos específicos del prestador

### 2. **Sistema de Autenticación y Registro**

#### Pantalla de Login/Registro (`index.tsx`)
- Permite crear cuenta o iniciar sesión
- Validación de campos
- Redirige automáticamente según estado de autenticación

#### Pantalla de Selección de Rol (`role-selection.tsx`)
- Usuario elige entre: **Usuario con mascota** o **Prestador de servicios**
- Interfaz amigable con iconos y descripciones

### 3. **Registro de Usuario (3 pasos)**

**Paso 1** (`registro/usuario/paso-1.tsx`):
- Datos básicos: nombre, email, teléfono, dirección, ciudad, provincia, código postal
- Validación obligatoria

**Paso 2** (`registro/usuario/paso-2.tsx`):
- Agregar mascotas: nombre, tipo, raza
- Interfaz para añadir múltiples mascotas
- Eliminación de mascotas

**Paso 3** (`registro/usuario/paso-3.tsx`):
- Detalles por mascota:
  - Foto de perfil
  - Información física (tamaño, color)
  - Comportamiento (tags seleccionables)
  - Miedos/fobias
  - Nivel de energía
  - Historial clínico
  - Alergias y medicamentos
  - Alimentación (tipo, marca, cantidad, alimentos prohibidos)
- Guarda todo en Firebase

### 4. **Registro de Prestador (3 pasos)**

**Paso 1** (`registro/prestador/paso-1.tsx`):
- Datos básicos: nombre, email, teléfono, dirección, ciudad
- Selección de tipo: independiente o empresa
- Si es empresa: nombre de empresa y RUT

**Paso 2** (`registro/prestador/paso-2.tsx`):
- Años de experiencia
- Especialidades (tags seleccionables)
- Precios por 30 y 60 minutos
- Tipos de mascotas que atiende (checkboxes)

**Paso 3** (`registro/prestador/paso-3.tsx`):
- Carga de documentos de identidad (obligatorio)
- Carga de certificaciones (opcional)
- Disponibilidad (fines de semana, nocturno)

### 5. **Sistema de Navegación**

#### Bottom Tab Bar (`(tabs)/_layout.tsx`)
Implementa navegación con 5 tabs:
1. **Inicio** (home) - Dashboard principal
2. **Servicios** (servicios) - Lista de servicios disponibles
3. **Mis Mascotas** (mis-mascotas) - Gestión de mascotas
4. **Galletas** (galletas) - Billetera y saldo
5. **Perfil** (perfil) - Mi perfil de usuario

#### Menú Hamburguesa (`components/drawer-menu.tsx`)
Opciones disponibles:
- ⚙️ Configuración
- ❓ Ayuda
- 🎧 Soporte
- 📜 Historial
- 🌙 Modo Oscuro (toggle)
- 🚪 Cerrar Sesión

### 6. **Pantallas de Tabs**

**Home** (`(tabs)/home.tsx`):
- Saludo personalizado
- Menú hamburguesa
- Saldo de galletas
- Grid de servicios disponibles
- Sección de próximas reservas

**Servicios** (`(tabs)/servicios.tsx`):
- Lista de todos los servicios disponibles
- Acceso rápido a cada servicio

**Mis Mascotas** (`(tabs)/mis-mascotas.tsx`):
- Listado de mascotas registradas
- Información de cada mascota

**Galletas** (`(tabs)/galletas.tsx`):
- Mostrar saldo actual
- **Para usuario**: Botón "Agregar Fondos"
- **Para prestador**: Botón "Retirar Fondos"
- Información sobre galletas
- Historial de transacciones

**Perfil** (`(tabs)/perfil.tsx`):
- Avatar y nombre del usuario
- Información de contacto
- Estadísticas (calificación, servicios realizados)
- Botones para editar perfil y cambiar contraseña

### 7. **Páginas Placeholder (En Desarrollo)**
- `configuracion.tsx`
- `ayuda.tsx`
- `soporte.tsx`
- `historial.tsx`

---

## 🎨 Diseño y Colores

**Paleta de colores:**
- Principal: `#4ECDC4` (Turquesa)
- Secundarios: `#FF6B6B`, `#FFE66D`, `#FF85A2`, `#A8E6CF`, `#B19CD9`
- Texto: `#2C3E50`
- Subtexto: `#7F8C8D`
- Fondo: `#F8F9FA`
- Borde: `#E0E0E0`

---

## 📋 Funcionalidades Pendientes

Por implementar en próximas fases:

1. **Flujo de Servicio Completo** (Calendario → Hora → Lista de prestadores → Perfil → Reservar)
2. **Sistema de Alertas** (30 min, 10 min, 5 min, al llegar, al recoger)
3. **Ubicación en Tiempo Real** (Maps)
4. **Extras Pagables** (Fotos, videos, videollamadas)
5. **Chat y Llamadas**
6. **Sistema de Reseñas y Calificaciones**
7. **Métodos de Pago** (Tarjeta, transferencia bancaria)
8. **Descarga de Fotos/Videos**
9. **Notificaciones Push**
10. **Panel de Admin**

---

## 📱 Estructura de Carpetas

```
app/
├── index.tsx                          # Login/Signup
├── role-selection.tsx                 # Selección de rol
├── configuracion.tsx                  # Configuración
├── ayuda.tsx                          # Ayuda
├── soporte.tsx                        # Soporte
├── historial.tsx                      # Historial
├── _layout.tsx                        # Layout principal
├── (tabs)/
│   ├── _layout.tsx                   # Layout de tabs
│   ├── home.tsx                      # Home screen
│   ├── servicios.tsx                 # Servicios
│   ├── mis-mascotas.tsx              # Mascotas
│   ├── galletas.tsx                  # Billetera
│   └── perfil.tsx                    # Perfil
├── registro/
│   ├── usuario/
│   │   ├── paso-1.tsx               # Datos básicos
│   │   ├── paso-2.tsx               # Mascotas
│   │   └── paso-3.tsx               # Detalles mascota
│   └── prestador/
│       ├── paso-1.tsx               # Datos básicos
│       ├── paso-2.tsx               # Especialidades
│       └── paso-3.tsx               # Documentos
└── components/
    └── drawer-menu.tsx               # Menú hamburguesa
```

---

## 🔧 Próximos Pasos

1. Implementar pantalla de selección de servicios con calendario
2. Crear lista de prestadores disponibles
3. Implementar sistema de reservas
4. Agregar geolocalización
5. Implementar métodos de pago
6. Sistema de notificaciones

---

## 📝 Notas Importantes

- Todo está almacenado en **Firebase Firestore**
- Las imágenes se guardan en **Firebase Storage**
- Los extras (fotos/videos) se muestran en la app y se borran si no se descargan
- Sistema de "galletas" como moneda interna
- Validación en cliente y servidor

---

## ✨ Características Destacadas

✅ **Seguridad**: Autenticación con Firebase Auth  
✅ **Validación**: Campos obligatorios y validación de datos  
✅ **Experiencia de Usuario**: Interfaz limpia y moderna  
✅ **Escalabilidad**: Estructura preparada para agregar nuevas funciones  
✅ **Rol Discriminado**: Diferentes flujos para usuario y prestador  
✅ **Mascotas Detalladas**: Información completa y personalizada por mascota  
✅ **Menú Completo**: Acceso a configuración, ayuda, historial, etc.  

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.1
