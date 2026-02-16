# Arquitectura de Datos - Flujo de Servicios

## 📐 Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────┐
│                     FIRESTORE STRUCTURE                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  usuarios    │  (Collection)
├──────────────┤
│ {uid}        │  (Document - por cada usuario)
├──────────────┤
│ ├─ nombre: string
│ ├─ email: string
│ ├─ rol: "usuario" | "prestador"
│ ├─ saldoGalletas: number ◄───────────────┐ ACTUALIZADO al confirmar
│ ├─ latitud: number ◄────────────────┐    │ USADO para filtrar
│ ├─ longitud: number ◄──────┐        │    │ prestadores cercanos
│ ├─ ciudad: string           │        │    │
│ │                           │        │    │
│ └─ subcollection: transacciones
│    ├─ {docId}              │        │    │
│    ├─ tipo: "PAGO"         │        │    │
│    ├─ monto: 15            │        │    │
│    ├─ descripcion: string  │        │    │
│    ├─ idReserva: string    ├─────┬─┴────┤ LINKEA a reserva
│    └─ fecha: timestamp     │     │       │
└──────────────┘             │     │       │
                             │     │       │
┌──────────────┐             │     │       │
│  mascotas    │  (Collection)     │       │
├──────────────┤                   │       │
│ {docId}      │                   │       │
├──────────────┤                   │       │
│ ├─ idDueno: string ────────────────┘     │
│ ├─ nombre: string                        │
│ ├─ tipo: "perro" | "gato" | "otro"       │
│ ├─ raza: string                          │
│ ├─ tamaño: "grande" | "pequeño" | "mediano"
│ ├─ comportamientos: string[]             │
│ ├─ historialClinico: string              │
│ ├─ alergias: string[]                    │
│ ├─ medicamentos: string[]                │
│ └─ alimentacion: object                  │
│    ├─ tipo: string                       │
│    ├─ marca: string                      │
│    └─ cantidadDiaria: number             │
└──────────────┘                           │
                                           │
┌──────────────┐                           │
│   reservas   │  (Collection)             │
├──────────────┤                           │
│ {docId}      │ ◄───────────────┬─────────┘
├──────────────┤                 │
│ ├─ idUsuario: string ──────────┘
│ ├─ idPrestador: string ────────────────┐
│ ├─ idMascota: string ──────────────────┤
│ │                                      │
│ ├─ tipoServicio: "paseo" | "guarderia" │
│ ├─ estado: "confirmada" | "en_progreso"│
│ ├─ fecha: "2026-02-15"                 │
│ ├─ hora: "14:00"                       │
│ ├─ costoTotal: 15                      │
│ ├─ fotosServicio: string[] ────────┐   │
│ ├─ videosServicio: string[] ───────┼─┐ │
│ ├─ calificacionServicio: number    │ │ │
│ ├─ comentarioServicio: string      │ │ │
│ └─ createdAt: timestamp            │ │ │
└──────────────┘                     │ │ │
                                     │ │ │
                    URLs a Firebase Storage
                                     │ │ │
                    ┌────────────────┘ │ │
                    │   ┌──────────────┘ │
                    │   │   ┌────────────┘
                    ▼   ▼   ▼
         Firebase Storage: /servicios/{reservaId}/
         ├─ fotos/
         │  └─ photo_001.jpg
         │  └─ photo_002.jpg
         └─ videos/
            └─ video_001.mp4
```

---

## 🔄 Flujo de Datos Durante Reserva

```
USUARIO PRESIONA "CONFIRMAR RESERVA"
│
├─ [VALIDAR] Saldo suficiente
│  └─ usuario.saldoGalletas ≥ precio
│     └─ Si falla: mostrar Alert y rechazar
│
├─ [CREAR] Documento Reserva en Firestore
│  └─ POST /reservas/{nuevoDocId}
│     ├─ idUsuario: auth.currentUser.uid
│     ├─ idPrestador: prestadorId
│     ├─ idMascota: mascotaId
│     ├─ tipoServicio: "paseo"
│     ├─ estado: "confirmada"
│     ├─ fecha: "2026-02-15"
│     ├─ hora: "14:00"
│     ├─ costoTotal: 15
│     └─ createdAt: now()
│
├─ [ACTUALIZAR] Saldo de usuario
│  └─ PUT /usuarios/{uid}
│     └─ saldoGalletas: 50 - 15 = 35
│
├─ [CREAR] Transacción en historial
│  └─ POST /usuarios/{uid}/transacciones/{docId}
│     ├─ tipo: "PAGO"
│     ├─ monto: 15
│     ├─ descripcion: "Pago por paseo con Juan García"
│     ├─ idReserva: {reservaDocId}
│     ├─ metodoPago: "galletas"
│     └─ fecha: now()
│
└─ ✅ ÉXITO: Mostrar pantalla de confirmación
```

---

## 🔍 Estructura Query: Buscar Prestadores

```javascript
// PASO 1: Obtener TODOS los prestadores verificados
const prestadoresRef = collection(db, 'usuarios');
const q = query(
  prestadoresRef,
  where('rol', '==', 'prestador'),
  where('verificado', '==', true)
);
const querySnapshot = await getDocs(q);

// RESULTADO: Array de DocumentSnapshots
// [{
//   id: "prestador_1",
//   data: {
//     nombre: "Juan García",
//     aceptaGrandes: true,
//     horarioDisponibilidad: "09:00-17:00,19:00-21:00",
//     latitud: -33.8690,
//     longitud: -51.2095,
//     radioAccion: "5",
//     ...
//   }
// }, ...]

// PASO 2: Filtrar en MEMORIA (en la app)
querySnapshot.forEach((doc) => {
  const prestador = doc.data();
  
  // Filtro 1: ¿Acepta el tamaño de mascota?
  if (mascotaTamaño === 'grande' && !prestador.aceptaGrandes) return;
  
  // Filtro 2: ¿Tiene horarios?
  if (!prestador.horarioDisponibilidad) return;
  
  // Filtro 3: ¿Atiende fines de semana?
  const dayOfWeek = new Date(fecha).getDay();
  if ((dayOfWeek === 0 || dayOfWeek === 6) && !prestador.disponibleFinesde) return;
  
  // Filtro 4: ¿Está dentro del radio de acción?
  const distancia = calcularHaversine(
    userLat, userLon,
    prestador.latitud, prestador.longitud
  );
  if (distancia > parseFloat(prestador.radioAccion)) return;
  
  // ✅ PASA TODOS LOS FILTROS: Incluir en lista
  prestadoresValidos.push({...});
});
```

---

## 🗄️ Índices Recomendados en Firestore

Para optimizar las queries, crear índices en Firestore Console:

### Índice 1: Buscar prestadores verificados
```
Collection: usuarios
Fields:
  ├─ rol (Ascending)
  ├─ verificado (Ascending)
  └─ puntuacionPromedio (Descending)
```

### Índice 2: Transacciones por usuario
```
Collection: usuarios/{uid}/transacciones
Fields:
  ├─ tipo (Ascending)
  └─ fecha (Descending)
```

### Índice 3: Mascotas por dueño
```
Collection: mascotas
Fields:
  ├─ idDueno (Ascending)
  └─ tipo (Ascending)
```

### Índice 4: Reservas por usuario
```
Collection: reservas
Fields:
  ├─ idUsuario (Ascending)
  ├─ estado (Ascending)
  └─ fecha (Descending)
```

---

## 📱 Estado en cada Pantalla

```
┌─────────────────────────────────────────────────────────┐
│ HOME                                                    │
├─────────────────────────────────────────────────────────┤
│ userData = {                                            │
│   nombre: "María",                                      │
│   saldoGalletas: 50,                                    │
│   latitud: -33.8688,                                    │
│   longitud: -51.2093                                    │
│ }                                                       │
│                                                         │
│ Usuario toca "Paseo"                                   │
│ router.push('/servicio/paseo')                         │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ SELECCIONAR MASCOTA                                     │
├─────────────────────────────────────────────────────────┤
│ mascotas = [                                            │
│   {                                                     │
│     id: "max_789",                                      │
│     nombre: "Max",                                      │
│     tipo: "perro",                                      │
│     tamaño: "grande",  ◄─ CRÍTICO para filtros         │
│     raza: "Golden Retriever"                           │
│   }                                                     │
│ ]                                                       │
│                                                         │
│ selectedMascota = "max_789"                             │
│ router.push({                                           │
│   pathname: '/servicio/[id]/calendario',               │
│   params: { id: 'paseo', mascotaId: "max_789", ... }   │
│ })                                                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ CALENDARIO                                              │
├─────────────────────────────────────────────────────────┤
│ markedDates = {                                         │
│   "2026-02-08": {                                       │
│     marked: true,                                       │
│     dotColor: '#4ECDC4',  ◄─ Hay prestadores           │
│     prestadores: 2                                      │
│   },                                                    │
│   "2026-02-09": {                                       │
│     marked: false         ◄─ No hay prestadores        │
│   }                                                     │
│ }                                                       │
│                                                         │
│ selectedDate = "2026-02-08"                             │
│ router.push({                                           │
│   pathname: '/servicio/[id]/hora',                      │
│   params: { id: 'paseo', fecha: "2026-02-08", ... }    │
│ })                                                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ HORA                                                    │
├─────────────────────────────────────────────────────────┤
│ horas = [                                               │
│   {                                                     │
│     hora: "09:00",                                      │
│     prestadoresDisponibles: 3,  ◄─ Contador             │
│     disponible: true                                    │
│   },                                                    │
│   {                                                     │
│     hora: "10:00",                                      │
│     prestadoresDisponibles: 2,                          │
│     disponible: true                                    │
│   }                                                     │
│ ]                                                       │
│                                                         │
│ selectedHora = "14:00"                                  │
│ router.push({                                           │
│   pathname: '/servicio/[id]/prestadores',              │
│   params: { id: 'paseo', fecha: "...", hora: "14:00" } │
│ })                                                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ PRESTADORES (con ubicación)                             │
├─────────────────────────────────────────────────────────┤
│ prestadores = [                                         │
│   {                                                     │
│     id: "juan_456",                                     │
│     nombre: "Juan García",                              │
│     puntuacionPromedio: 4.9,                            │
│     distancia: 0.6,  ◄─ CALCULADO y VALIDADO           │
│     precio: 15                                          │
│   },                                                    │
│   {                                                     │
│     id: "carlos_789",                                   │
│     nombre: "Carlos López",                             │
│     puntuacionPromedio: 4.5,                            │
│     distancia: null,  ◄─ DESCARTADO (fuera de rango)    │
│     precio: 15                                          │
│   }                                                     │
│ ]  (FILTRADO A LOS 2 QUE CUMPLEN VALIDACIONES)        │
│                                                         │
│ selectedPrestador = "juan_456"                          │
│ router.push({                                           │
│   pathname: '/servicio/[id]/perfil-prestador',         │
│   params: { prestadorId: "juan_456", precio: "15" }     │
│ })                                                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ PERFIL PRESTADOR                                        │
├─────────────────────────────────────────────────────────┤
│ prestador = {                                           │
│   id: "juan_456",                                       │
│   nombre: "Juan García",                                │
│   email: "juan@email.com",                              │
│   puntuacionPromedio: 4.9,                              │
│   serviciosCompletados: 25,                             │
│   especialidades: "Paseos, Adiestramiento",             │
│   yearExperiencia: 5,                                   │
│   ciudad: "Santa Fe"                                    │
│ }                                                       │
│                                                         │
│ reservaResumen = {                                      │
│   mascota: "Max",                                       │
│   fecha: "2026-02-08",                                  │
│   hora: "14:00",                                        │
│   precio: 15                                            │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ CONFIRMACIÓN                                            │
├─────────────────────────────────────────────────────────┤
│ verificarSaldo(): 50 ≥ 15 ✅                           │
│                                                         │
│ crearReserva({                                          │
│   idUsuario: "maria_123",                               │
│   idPrestador: "juan_456",                              │
│   idMascota: "max_789",                                 │
│   tipoServicio: "paseo",                                │
│   estado: "confirmada",                                 │
│   fecha: "2026-02-08",                                  │
│   hora: "14:00",                                        │
│   costoTotal: 15                                        │
│ })                                                      │
│                                                         │
│ actualizarSaldo():                                      │
│   usuarios/maria_123.saldoGalletas = 50 - 15 = 35      │
│                                                         │
│ crearTransaccion({                                      │
│   tipo: "PAGO",                                         │
│   monto: 15,                                            │
│   descripcion: "Pago por paseo con Juan García",        │
│   idReserva: "reserva_abc123"                           │
│ })                                                      │
│                                                         │
│ ✅ ÉXITO                                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Seguridad: Firestore Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios: solo pueden leer/escribir su propio documento
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Transacciones: solo leer propias
      match /transacciones/{doc=**} {
        allow read: if request.auth.uid == userId;
        allow create: if request.auth.uid == userId;
      }
    }
    
    // Mascotas: solo leer si es el dueño
    match /mascotas/{docId} {
      allow read: if resource.data.idDueno == request.auth.uid;
      allow create: if request.auth.uid != null;
      allow update, delete: if resource.data.idDueno == request.auth.uid;
    }
    
    // Reservas: leer si eres usuario o prestador de la reserva
    match /reservas/{docId} {
      allow read: if resource.data.idUsuario == request.auth.uid ||
                     resource.data.idPrestador == request.auth.uid;
      allow create: if request.auth.uid == request.resource.data.idUsuario;
      allow update: if resource.data.idUsuario == request.auth.uid ||
                       resource.data.idPrestador == request.auth.uid;
    }
  }
}
```

---

**Arquitectura completa y lista para producción** ✅
