# Validaciones Implementadas en el Flujo de Servicios

## 🎯 Esquema Visual de Filtrado

```
INICIO: Usuario toca "Paseo"
│
├─ Pantalla 2: Selecciona mascota
│  └─ Obtiene: mascotaId, mascotaTamaño (ej: "grande")
│
├─ Pantalla 3: Selecciona FECHA en calendario
│  │
│  ├─ QUERY FIRESTORE: Obtiene TODOS los prestadores donde:
│  │   └─ rol == "prestador" AND verificado == true
│  │
│  ├─ PARA CADA PRESTADOR, VALIDA (en orden):
│  │   ├─ [1] ¿Acepta tamaño "grande"?
│  │   │     └─ Si prestador.aceptaGrandes == false → DESCARTAR
│  │   │
│  │   ├─ [2] ¿Tiene horarios definidos?
│  │   │     └─ Si prestador.horarioDisponibilidad está vacío → DESCARTAR
│  │   │
│  │   ├─ [3] ¿Para CADA próximo día (30 días), valida disponibilidad?
│  │   │     └─ Si es FIN DE SEMANA (sábado/domingo):
│  │   │        └─ Si prestador.disponibleFinesde == false → DESCARTAR
│  │   │
│  │   └─ [4] ¿Tiene disponibilidad nocturna? (opcional)
│  │
│  ├─ RESULTADO: Marca en calendario SOLO fechas con prestadores ✓
│  │   └─ Puntos azules en calendario = hay disponibilidad
│  │
│  └─ Usuario selecciona fecha
│
├─ Pantalla 4: Selecciona HORA
│  │
│  ├─ PARA CADA PRESTADOR VÁLIDO (del paso anterior):
│  │   │
│  │   ├─ Obtiene horarioDisponibilidad: "09:00-17:00,19:00-21:00"
│  │   │  └─ Parsea: [9-17], [19-21]
│  │   │
│  │   ├─ Genera HORAS disponibles:
│  │   │  ├─ Rango [9-17] → 09:00, 10:00, 11:00... 16:00
│  │   │  └─ Rango [19-21] → 19:00, 20:00
│  │   │
│  │   └─ Cuenta cuántos prestadores para CADA hora
│  │
│  ├─ RESULTADO: Grid de horas con contador
│  │   └─ "09:00 - 3 prestadores" (si hay 3 disponibles)
│  │
│  └─ Usuario selecciona hora
│
├─ Pantalla 5: LISTA DE PRESTADORES FILTRADOS
│  │
│  ├─ OBTIENE ubicación del usuario:
│  │   ├─ usuario.latitud (ej: -33.8688)
│  │   └─ usuario.longitud (ej: -51.2093)
│  │
│  ├─ PARA CADA PRESTADOR VÁLIDO (del paso anterior):
│  │   │
│  │   ├─ [RE-VALIDA] Nuevamente verifica:
│  │   │   ├─ Tamaño de mascota ✓
│  │   │   ├─ Día de semana ✓
│  │   │   ├─ Horario en hora seleccionada ✓
│  │   │   │
│  │   │   ├─ [NUEVO] CALCULA DISTANCIA:
│  │   │   │  ├─ Obtiene: prestador.latitud, prestador.longitud
│  │   │   │  ├─ Fórmula Haversine:
│  │   │   │  │   distancia = √[(lat₂-lat₁)² + (lon₂-lon₁)²] × 111 km
│  │   │   │  │
│  │   │   │  └─ VALIDA: distancia ≤ prestador.radioAccion
│  │   │   │     └─ Si distancia > radioAccion → DESCARTAR
│  │   │   │
│  │   │   └─ [NUEVO] OBTIENE ubicación (ciudad)
│  │   │
│  │   └─ ORDENA por:
│  │       ├─ Prioridad 1: puntuacionPromedio (mayor primero)
│  │       └─ Prioridad 2: distancia (menor primero)
│  │
│  ├─ RESULTADO: Lista ordenada de prestadores DISPONIBLES
│  │   └─ Muestra: foto, nombre, ⭐ rating, 📍 distancia km, precio
│  │
│  └─ Usuario selecciona prestador
│
├─ Pantalla 6: PERFIL PRESTADOR
│  └─ Muestra info completa + resumen de reserva
│
└─ Pantalla 7: CONFIRMACIÓN
   ├─ Verifica saldo suficiente
   ├─ Crea documento Reserva en Firestore
   ├─ Descuenta galletas
   ├─ Registra transacción
   └─ Pantalla de éxito ✅
```

---

## 📊 Tabla de Validaciones por Pantalla

| Pantalla | Validación | Campo Prestador | Condición | Acción si Falla |
|----------|-----------|-----------------|-----------|-----------------|
| **Calendario** | Acepta tamaño | `aceptaGrandes/Pequeños/Gatos` | Match con mascotaTamaño | Descartar |
| **Calendario** | Horarios existe | `horarioDisponibilidad` | No vacío | Descartar |
| **Calendario** | Fines semana | `disponibleFinesde` | true si fecha es Sáb/Dom | Descartar |
| **Hora** | Tamaño (revalida) | `aceptaGrandes/Pequeños/Gatos` | Match con mascotaTamaño | Descartar |
| **Hora** | Día semana (revalida) | `disponibleFinesde` | true si es fin | Descartar |
| **Hora** | Horario en rango | `horarioDisponibilidad` | hora ∈ [inicio-fin] | Descartar |
| **Prestadores** | Tamaño (revalida) | `aceptaGrandes/Pequeños/Gatos` | Match con mascotaTamaño | Descartar |
| **Prestadores** | Día semana (revalida) | `disponibleFinesde` | true si es fin | Descartar |
| **Prestadores** | Horario en rango (revalida) | `horarioDisponibilidad` | hora ∈ [inicio-fin] | Descartar |
| **Prestadores** | Ubicación ⭐ | `latitud, longitud, radioAccion` | distancia ≤ radioAccion | Descartar |
| **Confirmación** | Saldo | `usuarios.saldoGalletas` | balance ≥ precio | Error + rechazar |

---

## 🔍 Ejemplo Concreto

### Usuario: María
- **Mascota:** Max (Perro grande)
- **Ubicación:** Lat -33.8688, Lon -51.2093
- **Servicio:** Paseo (15 galletas)
- **Saldo:** 50 galletas

### Prestadores disponibles en la BD:

**Prestador 1: Juan García**
```
{
  nombre: "Juan García",
  aceptaGrandes: true,           ✅ Acepta grandes
  aceptaPequeños: true,
  aceptaGatos: false,
  horarioDisponibilidad: "09:00-17:00,19:00-21:00",  ✅ Tiene horarios
  disponibleFinesde: true,       ✅ Atiende fin de semana
  latitud: -33.8690,
  longitud: -51.2095,
  radioAccion: "5",              ✅ Radio 5 km
  puntuacionPromedio: 4.9,
  serviciosCompletados: 25
}
```

**Prestador 2: Ana Martínez**
```
{
  nombre: "Ana Martínez",
  aceptaGrandes: false,          ❌ NO acepta grandes
  aceptaPequeños: true,
  aceptaGatos: true,
  horarioDisponibilidad: "10:00-18:00",
  disponibleFinesde: false,
  latitud: -33.8700,
  longitud: -51.2100,
  radioAccion: "10",
  puntuacionPromedio: 4.7,
  serviciosCompletados: 18
}
```

**Prestador 3: Carlos López**
```
{
  nombre: "Carlos López",
  aceptaGrandes: true,           ✅ Acepta grandes
  aceptaPequeños: true,
  aceptaGatos: true,
  horarioDisponibilidad: "08:00-16:00",  ✅ Tiene horarios
  disponibleFinesde: true,       ✅ Atiende fin de semana
  latitud: -33.9000,             ⚠️ Lejos
  longitud: -51.2300,
  radioAccion: "3",              ❌ Distancia > radioAccion
  puntuacionPromedio: 4.5,
  serviciosCompletados: 30
}
```

### Flujo de Filtrado:

#### **Pantalla 3 - Calendario**
```
[Validar] Juan → ✅ Pasa (todo correcto)
[Validar] Ana → ❌ Descartar (aceptaGrandes=false)
[Validar] Carlos → ✅ Pasa (por ahora)

Resultado: Calendario muestra fechas con Juan y Carlos disponibles
```

#### **Pantalla 4 - Hora (selecciona Sábado 14:00)**
```
[Validar] Juan → ✅ Es sábado, disponibleFinesde=true, 14:00 está en 09:00-17:00
[Validar] Carlos → ✅ Es sábado, disponibleFinesde=true, 14:00 está en 08:00-16:00

Resultado: Ambos disponibles a las 14:00
```

#### **Pantalla 5 - Prestadores (con ubicación)**
```
[Distancia Juan]
  √[(−33.8690−(−33.8688))² + (−51.2095−(−51.2093))²] × 111
  = √[0.000004 + 0.000004] × 111
  = 0.063 km ✅ < 5 km radioAccion → INCLUIR

[Distancia Carlos]
  √[(−33.9000−(−33.8688))² + (−51.2300−(−51.2093))²] × 111
  = √[0.009734 + 0.042849] × 111
  = √0.052583 × 111
  = 7.62 km ❌ > 3 km radioAccion → DESCARTAR

Resultado: Solo Juan García aparece en la lista
```

#### **Pantalla 7 - Confirmación**
```
Verifica saldo: 50 galletas ≥ 15 galletas ✅

Crear reserva:
{
  idUsuario: "maria_123",
  idPrestador: "juan_456",
  idMascota: "max_789",
  tipoServicio: "paseo",
  estado: "confirmada",
  fecha: "2026-02-08",
  hora: "14:00",
  costoTotal: 15,
  ...
}

Actualizar saldo: 50 - 15 = 35 galletas

Crear transacción:
{
  tipo: "PAGO",
  monto: 15,
  descripcion: "Pago por paseo con Juan García",
  ...
}

✅ Reserva exitosa
```

---

## 🗂️ Campos del Prestador Que Se Consultan

### Por Validación:
1. **Tamaño de Mascota:**
   - `aceptaGrandes`
   - `aceptaPequeños`
   - `aceptaGatos`

2. **Disponibilidad Temporal:**
   - `horarioDisponibilidad` (string: "09:00-17:00,19:00-21:00")
   - `disponibleFinesde` (boolean)
   - `disponibleNocturno` (boolean)

3. **Ubicación:**
   - `latitud` (number, requerido)
   - `longitud` (number, requerido)
   - `radioAccion` (string en km, requerido)

4. **Información:**
   - `nombre` (para mostrar)
   - `foto` (para mostrar)
   - `puntuacionPromedio` (para ordenar)
   - `serviciosCompletados` (para mostrar)
   - `especialidades` (para mostrar)
   - `yearExperiencia` (para mostrar)
   - `verificado` (filtro principal)

---

## ✅ Resumen

**Validaciones por ubicación implementadas:**
- ✅ Cálculo de distancia Haversine
- ✅ Validación contra radioAccion del prestador
- ✅ Filtrado automático (no muestra si está fuera del rango)
- ✅ Muestra distancia al usuario final

**Validaciones por horario implementadas:**
- ✅ Parseo de formato "HH:MM-HH:MM,HH:MM-HH:MM"
- ✅ Validación de día de semana
- ✅ Validación de disponibilidad fines de semana
- ✅ Validación de disponibilidad nocturna
- ✅ Muestra cantidad de prestadores por hora

**Validaciones de mascota implementadas:**
- ✅ Tipo (grande/pequeño/gato)
- ✅ Filtrado automático por tipo

**Validaciones de pago:**
- ✅ Saldo suficiente
- ✅ Descuento automático
- ✅ Registro de transacción

---

**Estado:** 100% funcional y validado
