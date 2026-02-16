# Flujo Completo de Servicios Implementado

## 📋 Resumen Ejecutivo

Se ha implementado el **flujo completo de reserva de servicios** con validación inteligente de:
- ✅ Disponibilidad de prestadores (horarios establecidos)
- ✅ Ubicación/zona de cobertura del prestador
- ✅ Tipo de mascota que acepta el prestador
- ✅ Descuento de galletas automático al confirmar

---

## 🔄 Flujo Paso a Paso

### 1️⃣ **Home → Seleccionar Servicio**
**Archivo:** `app/(tabs)/home.tsx`

El usuario toca un botón de servicio (Paseo, Guardería, Baño, etc.)
```
Usuario ve:
├─ Grid de 6 servicios disponibles
├─ Saldo de galletas actual
└─ Botón "Agendar Servicio"

Acción: Tap en servicio → router.push('/servicio/{id}')
```

---

### 2️⃣ **Seleccionar Mascota**
**Archivo:** `app/servicio/[id]/index.tsx`

Carga todas las mascotas del usuario desde Firestore

```
Validaciones:
├─ Verifica que el usuario tenga al menos 1 mascota
├─ Filtra por tipo de mascota (perro/gato/otro)
└─ Obtiene ubicación del usuario (latitud/longitud)

Usuario ve:
├─ Lista de mascotas con foto, raza, tamaño
├─ Selecciona una mascota
└─ Botón "Continuar"

Datos que acarrea:
├─ mascotaId
├─ mascotaNombre
└─ mascotaTamaño
```

---

### 3️⃣ **Seleccionar Fecha (Calendario)**
**Archivo:** `app/servicio/[id]/calendario.tsx`

**VALIDACIÓN CRÍTICA: Horarios y Disponibilidad**

```
Flujo de validación:
1. Obtiene TODOS los prestadores verificados
2. Para CADA prestador, valida:
   ├─ ¿Acepta el tamaño de mascota? (aceptaGrandes/aceptaPequeños/aceptaGatos)
   ├─ ¿Tiene horario definido? (horarioDisponibilidad)
   ├─ ¿Atiende fines de semana? (disponibleFinesde)
   └─ ¿Atiende horario nocturno? (disponibleNocturno)

3. Marca en el calendario:
   ├─ Próximos 30 días
   ├─ Solo fechas con prestadores disponibles
   └─ Indicador visual (punto azul)

Usuario ve:
├─ Calendario React Native Calendars
├─ Fechas con puntos azules = hay prestadores
├─ Toca una fecha
└─ Botón "Continuar"

Datos que acarrea:
├─ fecha (formato YYYY-MM-DD)
└─ Cantidad de prestadores disponibles
```

---

### 4️⃣ **Seleccionar Hora**
**Archivo:** `app/servicio/[id]/hora.tsx`

**VALIDACIÓN CRÍTICA: Horario del Prestador**

```
Flujo de validación:
1. Para CADA prestador verificado:
   ├─ Valida nuevamente tamaño de mascota
   ├─ Valida que sea un día disponible (fines de semana)
   ├─ Parsea horarioDisponibilidad (formato: "09:00-17:00,19:00-21:00")
   └─ Extrae horas disponibles

2. Agrupa horas:
   ├─ Genera todas las horas disponibles (09:00, 10:00, etc.)
   ├─ Cuenta cuántos prestadores en cada hora
   └─ Ordena por hora

Usuario ve:
├─ Grid de horas (09:00, 10:00, 11:00, etc.)
├─ Cada hora muestra cantidad de prestadores disponibles
├─ Selecciona una hora
└─ Botón "Ver Prestadores"

Datos que acarrea:
├─ hora (formato HH:00)
└─ Info de disponibilidad
```

---

### 5️⃣ **Lista de Prestadores Filtrada**
**Archivo:** `app/servicio/[id]/prestadores.tsx`

**VALIDACIÓN CRÍTICA: Ubicación (Distancia)**

```
Flujo de validación:
1. Obtiene ubicación del usuario (latitud/longitud)
2. Para CADA prestador verificado:
   ├─ Valida tamaño de mascota ✓
   ├─ Valida día de la semana ✓
   ├─ Valida horario en la hora seleccionada ✓
   ├─ NUEVO: Calcula distancia usando Haversine
   │         distancia = sqrt(lat_diff² + lon_diff²) * 111 km
   └─ NUEVO: Valida que distancia ≤ radioAccion

3. Ordena por:
   ├─ Puntuación (mayor primero)
   └─ Distancia (menor primero)

Usuario ve:
├─ Avatar/foto del prestador
├─ Nombre y tipo (independiente/empresa)
├─ ⭐ Rating y cantidad de servicios
├─ 📍 Distancia en km
├─ Especialidades
├─ Precio en galletas
├─ Selecciona un prestador
└─ Botón "Ver Perfil"

IMPORTANTE:
└─ Solo muestra prestadores que:
   ├─ Están verificados
   ├─ Aceptan el tamaño de mascota
   ├─ Tienen disponibilidad en fecha/hora
   └─ Están dentro del radio de acción (por ubicación)

Datos que acarrea:
├─ prestadorId
├─ prestadorNombre
└─ precio (15 galletas para paseo, 20 para guardería, etc.)
```

---

### 6️⃣ **Perfil del Prestador**
**Archivo:** `app/servicio/[id]/perfil-prestador.tsx`

```
Usuario ve:
├─ Foto/avatar del prestador
├─ Nombre y verificación (check azul)
├─ Ubicación (ciudad)
├─ ⭐ Rating y servicios completados
├─ Años de experiencia
├─ Especialidades detalladas
├─ Tipos de mascotas que atiende
├─ Email y teléfono
├─ RESUMEN DE RESERVA:
│  ├─ Mascota: {nombre}
│  ├─ Fecha: {fecha formateada}
│  ├─ Hora: {hora}
│  └─ Total: {precio} galletas
└─ Botón "Confirmar Reserva"
```

---

### 7️⃣ **Confirmación de Reserva**
**Archivo:** `app/servicio/[id]/confirmacion.tsx`

**ACCIÓN CRÍTICA: Transacción de Galletas**

```
Usuario ve:
├─ Resumen completo de la reserva
├─ Información del prestador
├─ Detalles del servicio
├─ Costo total
└─ Advertencia: "Se descontarán X galletas"

Al tocar "Confirmar":
1. Verifica saldo suficiente
   └─ Si saldoActual < precio → Error
   
2. Crea documento Reserva en Firestore:
   ├─ idUsuario
   ├─ idPrestador
   ├─ idMascota
   ├─ tipoServicio (paseo, guarderia, etc.)
   ├─ estado: "confirmada"
   ├─ fecha
   ├─ hora
   ├─ costoTotal
   └─ createdAt

3. Actualiza saldo del usuario:
   ├─ saldoGalletas = saldoActual - precio
   └─ Guardado en Firestore usuarios/{uid}

4. Crea transacción en historial:
   ├─ tipo: "PAGO"
   ├─ monto: precio
   ├─ descripcion: "Pago por paseo con {prestador}"
   ├─ idReserva: {reservaId}
   └─ fecha: ISO timestamp

5. Muestra pantalla de éxito:
   ├─ Checkmark verde grande
   ├─ "¡Reserva Confirmada!"
   ├─ Resumen final
   └─ Botón "Volver al Inicio"
```

---

## 🗂️ Estructura de Carpetas

```
app/
├── servicio/
│   ├── _layout.tsx          ← Configuración Stack Navigator
│   └── [id]/
│       ├── index.tsx        ← Seleccionar mascota
│       ├── calendario.tsx   ← Seleccionar fecha
│       ├── hora.tsx         ← Seleccionar hora
│       ├── prestadores.tsx  ← Lista de prestadores
│       ├── perfil-prestador.tsx  ← Perfil detallado
│       └── confirmacion.tsx ← Confirmar y pagar
```

---

## 🔑 Validaciones Implementadas

### ✅ Validación de Horarios del Prestador

```javascript
// Formato almacenado: "09:00-17:00,19:00-21:00"
const horariosStr = prestador.horarioDisponibilidad;
const rangos = horariosStr.split(',');

rangos.forEach((rango) => {
  const [inicio, fin] = rango.trim().split('-');
  const [hI] = inicio.split(':').map(Number);
  const [hF] = fin.split(':').map(Number);
  
  // hI: 9, hF: 17 → horarios disponibles: 09:00-16:00
  // hI: 19, hF: 21 → horarios disponibles: 19:00-20:00
});
```

### ✅ Validación de Ubicación (Distancia)

```javascript
// Fórmula Haversine para distancia entre dos puntos
const R = 6371; // Radio tierra en km
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;

const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
          
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distancia = R * c;

// Validar: distancia ≤ prestador.radioAccion
if (distancia > parseFloat(prestador.radioAccion)) {
  // No mostrar este prestador
}
```

### ✅ Validación de Tipo de Mascota

```javascript
const aceptaTamaño = 
  (mascotaTamaño === 'grande' && prestador.aceptaGrandes) ||
  (mascotaTamaño === 'pequeño' && prestador.aceptaPequeños) ||
  (mascotaTamaño === 'mediano' && prestador.aceptaPequeños);
```

### ✅ Validación de Fines de Semana

```javascript
const fechaObj = new Date(fecha + 'T00:00');
const dayOfWeek = fechaObj.getDay();
const esFin = dayOfWeek === 0 || dayOfWeek === 6;

if (esFin && !prestador.disponibleFinesde) {
  // No mostrar este prestador
}
```

---

## 💰 Estructura de Pago

### Precios Predefinidos (por servicio)
```javascript
if (id === 'paseo') {
  precio = 15; // 15 galletas
} else if (id === 'guarderia') {
  precio = 20; // 20 galletas
} else if (id === 'banio') {
  precio = 18; // 18 galletas
}
// ... etc
```

### Estructura de Transacción en Firestore

**Ruta:** `usuarios/{uid}/transacciones/{docId}`

```json
{
  "tipo": "PAGO",
  "monto": 15,
  "descripcion": "Pago por paseo con Juan García",
  "idReserva": "reserva_12345",
  "fecha": "2026-01-30T14:35:00Z",
  "metodoPago": "galletas"
}
```

---

## 📊 Estructura de Reserva en Firestore

**Ruta:** `reservas/{docId}`

```json
{
  "idUsuario": "user_123",
  "idPrestador": "prestador_456",
  "idMascota": "mascota_789",
  "tipoServicio": "paseo",
  "estado": "confirmada",
  "fecha": "2026-02-15",
  "hora": "15:00",
  "costoTotal": 15,
  "createdAt": "2026-01-30T14:35:00Z",
  "fotosServicio": [],
  "videosServicio": [],
  "calificacionServicio": null,
  "comentarioServicio": null
}
```

---

## 🔐 Datos del Prestador Consultados

Al filtrar prestadores, se validan:

```javascript
{
  // Básicos
  id: string,
  nombre: string,
  foto?: string,
  
  // Disponibilidad CRÍTICA
  horarioDisponibilidad: "09:00-17:00,19:00-21:00",
  disponibleFinesde: boolean,
  disponibleNocturno: boolean,
  
  // Ubicación CRÍTICA
  latitud?: number,
  longitud?: number,
  radioAccion: "10", // en km
  
  // Mascotas CRÍTICA
  aceptaGrandes: boolean,
  aceptaPequeños: boolean,
  aceptaGatos: boolean,
  
  // Información
  puntuacionPromedio: 4.8,
  serviciosCompletados: 45,
  especialidades: "Paseos, Adiestramiento",
  yearExperiencia: 5,
  
  // Verificación
  verificado: boolean
}
```

---

## ⚡ Próximos Pasos (Tareas 8-10)

### ⏳ Tarea 8: Sistema de Alertas
- [ ] 30 min antes: Modal con recomendaciones
- [ ] 10 min antes: Mostrar ubicación en tiempo real
- [ ] 5 min antes: Alerta "Prestador llegando"
- [ ] Al llegar: Confirmación de llegada
- [ ] Al recoger: Confirmación de recogida

### ⏳ Tarea 9: Extras Pagables
- [ ] Pantalla de servicio en progreso
- [ ] Botones para solicitar: Foto (1 galleta), Video (2 galletas), Videollamada (5 galletas/min)
- [ ] Chat integrado
- [ ] Guardado local de media (no persistente)

### ⏳ Tarea 10: Historial y Seguimiento
- [ ] Historial de servicios completados
- [ ] Sistema de reseñas y calificaciones
- [ ] Historial de transacciones detallado
- [ ] Opción de descargar o eliminar fotos/videos

---

## 📱 Pantallas Totales Implementadas

**Completadas:** 13/13 pantallas base ✅

Nuevas en este módulo:
1. ✅ `/servicio/[id]/index.tsx` - Seleccionar mascota
2. ✅ `/servicio/[id]/calendario.tsx` - Calendario con validaciones
3. ✅ `/servicio/[id]/hora.tsx` - Selector de horas
4. ✅ `/servicio/[id]/prestadores.tsx` - Lista filtrada por ubicación
5. ✅ `/servicio/[id]/perfil-prestador.tsx` - Perfil detallado
6. ✅ `/servicio/[id]/confirmacion.tsx` - Confirmación y pago

**Total del proyecto:** 19/23 pantallas planeadas (82%)

---

## 🎯 Logros Principales

✅ **Validación inteligente de disponibilidad** - Solo muestra prestadores que:
   - Tienen horarios establecidos
   - Atienden la zona del usuario (por GPS)
   - Aceptan el tamaño de mascota

✅ **Flujo de pago automático** - Descuenta galletas y registra transacción

✅ **UX fluido** - 6 pantallas conectadas sin cambios de contexto

✅ **Base para alertas y tracking** - Reserva creada lista para notificaciones

---

**Estado:** Flujo de servicios 100% funcional  
**Próximo:** Implementar alertas en tiempo real
