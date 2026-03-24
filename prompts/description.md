# Descripción del Proyecto

## Nombre del Proyecto

**Mango** - Plataforma de Mensajería Instantánea en Tiempo Real

---

## Visión General

Se trata de una aplicación web de mensajería instantánea diseñada para permitir la comunicación fluida entre usuarios en tiempo real, con latencias por debajo de 100ms. El sistema está optimizado para manejar miles de usuarios conectados simultáneamente, ofreciendo una experiencia similar a aplicaciones consolidadas como WhatsApp Web, Telegram Web o Slack, pero con una arquitectura moderna y eficiente.

---

## Problema que Resuelve

### Alta Latencia en Sistemas Tradicionales

Las aplicaciones de mensajería tradicionales basadas únicamente en bases de datos relacionales sufren de:

1. **Cuello de Botella en BD**: Cada mensaje requiere múltiples lecturas/escrituras en disco
2. **Polling Ineficiente**: Clientes consultando constantemente "¿hay mensajes nuevos?" consume recursos
3. **Escalabilidad Limitada**: Bases de datos relacionales no están diseñadas para micro-transacciones masivas

**Ejemplo del Problema**:
```
Usuario A escribe "Hola"
  ↓
Tradicional (HTTP Polling cada 5s):
  - Usuario A → POST /send → Guarda en DB → OK (100ms)
  - Usuario B → GET /messages (5s después) → "Hola" (latencia total: 5100ms)
  
Nuestra Solución (WebSocket + Redis):
  - Usuario A → WebSocket → Redis Pub/Sub → Usuario B (latencia total: 50ms)
```

### Experiencia de Usuario Deficiente

Los usuarios modernos esperan:
- **Mensajes instantáneos**: Ver el mensaje del otro lado en <100ms
- **Indicadores de presencia**: Saber si el amigo está "En línea" o "Escribiendo..."
- **Historial persistente**: Poder cerrar sesión y volver a ver toda la conversación
- **Contadores precisos**: Notificaciones de mensajes no leídos en tiempo real

---

## Solución Propuesta

### Arquitectura Híbrida: Redis + PostgreSQL

El proyecto resuelve estos problemas mediante una **arquitectura de doble capa de persistencia**:

#### Capa Rápida (Redis - En Memoria)
- **Mensajes en tránsito**: Los mensajes se distribuyen instantáneamente vía Redis Pub/Sub
- **Estados efímeros**: Presencia online/offline, "está escribiendo", sesiones activas
- **Contadores en tiempo real**: Mensajes no leídos, usuarios activos, métricas

#### Capa Durable (PostgreSQL - En Disco)
- **Historial de mensajes**: Todos los mensajes se guardan de forma asíncrona
- **Perfiles de usuario**: Información de usuarios, fotos, configuraciones
- **Relaciones**: Amistades, salas de chat, permisos

### WebSockets para Comunicación Bidireccional

En lugar de HTTP polling (cliente preguntando constantemente), usamos WebSockets:

```
HTTP Polling (Tradicional):
Cliente: ¿Hay mensajes? → Servidor: No
Cliente: ¿Hay mensajes? → Servidor: No
Cliente: ¿Hay mensajes? → Servidor: Sí, "Hola"

WebSocket (Nuestra Solución):
Cliente ⟷ Servidor (conexión persistente)
Servidor: "Hola" → Cliente (push instantáneo)
```

**Beneficios**:
- 40x menos overhead de red
- Comunicación bidireccional (servidor puede "empujar" mensajes sin que el cliente lo pida)
- Latencia reducida de 5000ms a 50ms

---

## ¿Cómo Funciona?

### Flujo de Registro y Autenticación

```
1. Usuario visita la página → Frontend (Vue.js)
   ↓
2. Completa formulario de registro → POST /api/auth/register
   ↓
3. Backend valida datos → Hash de contraseña (bcrypt)
   ↓
4. Guarda en PostgreSQL → users table
   ↓
5. Genera JWT token → {userId: 123, exp: ...}
   ↓
6. Frontend guarda token → localStorage
   ↓
7. Frontend establece WebSocket → ws://server?token=...
   ↓
8. Backend valida token → Conexión WebSocket autorizada
   ↓
9. Usuario aparece "En línea" → Redis SET user:123:presence "online" EX 30
```

### Flujo de Envío de Mensaje

```
1. Usuario A escribe "Hola" → Input de Vue.js
   ↓
2. Presiona Enter → websocket.send({to: userB, text: "Hola"})
   ↓
3. WebSocket Server (ElysiaJS) recibe mensaje
   ↓
4. Validaciones:
   - ¿Token válido? ✓
   - ¿Usuario A tiene permiso para hablar con B? ✓
   - ¿Texto válido (no vacío, <5000 chars)? ✓
   ↓
5. GUARDAR EN POSTGRESQL (async, no bloqueante):
   INSERT INTO messages (sender_id, receiver_id, content, created_at)
   VALUES (123, 456, 'Hola', NOW())
   ↓
6. PUBLICAR EN REDIS PUB/SUB (instantáneo):
   PUBLISH channel:chat:userB '{"from": 123, "text": "Hola", "timestamp": ...}'
   ↓
7. Redis distribuye el mensaje a todos los suscriptores
   ↓
8. WebSocket de Usuario B recibe el mensaje
   ↓
9. Frontend de Usuario B actualiza la UI:
   messages.value.push(nuevoMensaje) → Vue re-renderiza automáticamente
   ↓
10. Usuario B ve "Hola" en su pantalla (total: 50ms desde que A presionó Enter)
```

### Flujo de Presencia ("En Línea", "Escribiendo...")

#### Estado "En Línea"

```
1. Conexión WebSocket establecida
   ↓
2. Cliente envía heartbeat cada 30 segundos:
   websocket.send({type: 'heartbeat'})
   ↓
3. Servidor actualiza Redis con TTL (Time To Live):
   SET user:123:presence "online" EX 45
   (Si no llega heartbeat en 45s, la clave expira automáticamente)
   ↓
4. Si la clave expira:
   Redis: key expired event
   ↓
   Servidor escucha evento: keyspace notification
   ↓
   Servidor publica: PUBLISH presence:updates '{"userId": 123, "status": "offline"}'
   ↓
   Amigos de Usuario 123 reciben actualización → UI muestra "Desconectado"
```

#### Indicador "Escribiendo..."

```
1. Usuario A empieza a escribir en el input
   ↓
2. Evento @input en Vue.js
   ↓
3. Debounce (espera 500ms de inactividad antes de enviar)
   ↓
4. Si sigue escribiendo:
   websocket.send({type: 'typing', to: userB})
   ↓
5. Servidor valida y publica:
   SET user:123:typing:userB "true" EX 5
   (Expira en 5 segundos si no hay más eventos)
   ↓
6. Usuario B recibe evento → UI muestra "Usuario A está escribiendo..."
   ↓
7. Si pasan 5s sin más eventos → Indicador desaparece automáticamente
```

### Flujo de Carga de Historial

```
1. Usuario abre conversación con Usuario B
   ↓
2. Frontend: GET /api/messages?with=userB&limit=50&offset=0
   ↓
3. Backend consulta PostgreSQL:
   SELECT m.*, u.username, u.avatar
   FROM messages m
   JOIN users u ON m.sender_id = u.id
   WHERE (m.sender_id = 123 AND m.receiver_id = 456)
      OR (m.sender_id = 456 AND m.receiver_id = 123)
   ORDER BY m.created_at DESC
   LIMIT 50 OFFSET 0
   ↓
4. Respuesta: [{id: 1, text: "Hola", sender: {...}, created_at: ...}, ...]
   ↓
5. Frontend renderiza mensajes en orden cronológico inverso (más recientes abajo)
   ↓
6. Si usuario hace scroll hacia arriba → Cargar más (offset=50)
```

### Flujo de Contadores de Mensajes No Leídos

```
1. Usuario B está desconectado
   ↓
2. Usuario A envía 3 mensajes
   ↓
3. Backend incrementa contador en Redis:
   INCR user:456:unread:from:123
   INCR user:456:unread:from:123
   INCR user:456:unread:from:123
   → Resultado: 3
   ↓
4. Usuario B se conecta → GET /api/unread
   ↓
5. Backend consulta Redis:
   KEYS user:456:unread:*
   → user:456:unread:from:123: 3
   ↓
6. Frontend muestra badge: "Usuario A (3)"
   ↓
7. Usuario B abre chat con A:
   - Frontend: POST /api/messages/mark-read?from=123
   - Backend: DEL user:456:unread:from:123
   - Contador desaparece
```

---

## Características Principales

### 1. Mensajería Instantánea

- **Latencia Ultra-Baja**: Mensajes entregados en <100ms
- **Entrega Garantizada**: PostgreSQL asegura que ningún mensaje se pierda
- **Orden Consistente**: Timestamps precisos garantizan orden correcto
- **Soporte de Texto Largo**: Hasta 5000 caracteres por mensaje

### 2. Presencia en Tiempo Real

- **Estados de Usuario**:
  - 🟢 **En Línea**: Conectado activamente (heartbeat cada 30s)
  - 🟡 **Ausente**: Sin actividad por 5 minutos (no mueve el mouse, no escribe)
  - 🔴 **Desconectado**: Sesión cerrada o heartbeat expirado
  - ✍️ **Escribiendo...**: Indicador dinámico en tiempo real

- **Implementación Eficiente**:
  - Redis TTL maneja expiración automática
  - Sin polling del cliente (push-based)
  - Mínimo consumo de bandwidth (solo cambios de estado)

### 3. Historial Persistente

- **Almacenamiento Permanente**: Todos los mensajes en PostgreSQL
- **Carga Paginada**: Solo cargar 50 mensajes a la vez (scroll infinito)
- **Búsqueda Full-Text**: Buscar dentro de conversaciones (índice GIN en PostgreSQL)
- **Exportación**: Capacidad de descargar historial en JSON/CSV

### 4. Interfaz de Usuario Reactiva

- **Actualización Automática**: Vue.js re-renderiza solo lo necesario
- **Optimistic UI**: Mensajes aparecen instantáneamente (antes de confirmación del servidor)
- **Indicadores Visuales**:
  - ✓ Enviado
  - ✓✓ Entregado
  - ✓✓ Leído (azul)
- **Temas**: Claro/Oscuro con preferencia guardada en localStorage

### 5. Notificaciones

- **En la Aplicación**:
  - Badge rojo con contador de no leídos
  - Sonido configurable al recibir mensaje
  
- **Del Navegador** (Web Push API):
  - Notificación incluso si la pestaña está en segundo plano
  - Solo si el usuario dio permiso

### 6. Gestión de Sesiones

- **JWT Tokens**: Stateless, no necesita session storage en servidor
- **Logout Universal**: Invalidar token en todas las sesiones
- **Seguridad**:
  - Tokens firmados con secret key
  - HTTPS obligatorio en producción
  - Rate limiting por IP (1000 requests/hora)

---

## Escalabilidad

### Gestión de Miles de Usuarios Conectados

#### Conexiones Concurrentes

```
ElysiaJS + Bun puede manejar:
- 10,000 WebSockets concurrentes en un servidor de $50/mes (4 CPU, 8GB RAM)
- Cada WebSocket consume ~50KB de RAM
- Total: 10,000 × 50KB = 500MB de RAM solo para WebSockets
```

#### Uso Eficiente de Memoria

**Redis**:
- 1 millón de claves de presencia: ~100MB de RAM
- Pub/Sub: Solo mantiene canales activos (casi sin memoria)
- Mensajes en tránsito: <10MB en cualquier momento

**PostgreSQL**:
- Almacenamiento en disco (barato)
- 100 millones de mensajes: ~10GB en disco
- Índices: ~2GB adicionales

#### Escalabilidad Horizontal (Futuro)

Si un solo servidor no es suficiente:

```
┌──────────────────────────────────────────────────┐
│               Load Balancer (Nginx)              │
│         Distribución Round-Robin + Sticky        │
└──────────────────────────────────────────────────┘
        │                │                │
        ↓                ↓                ↓
   ┌────────┐       ┌────────┐       ┌────────┐
   │ Server │       │ Server │       │ Server │
   │   1    │       │   2    │       │   3    │
   └────────┘       └────────┘       └────────┘
        │                │                │
        └────────────────┴────────────────┘
                        ↓
              ┌──────────────────┐
              │   Redis Cluster  │
              │  (Pub/Sub Shared)│
              └──────────────────┘
                        ↓
              ┌──────────────────┐
              │  PostgreSQL      │
              │  (Read Replicas) │
              └──────────────────┘
```

**Cómo Funciona**:
1. Usuario A conecta a Server 1
2. Usuario B conecta a Server 2
3. Usuario A envía mensaje → Server 1 → Redis Pub/Sub
4. Redis distribuye a Server 1 y Server 2
5. Server 2 envía mensaje a Usuario B vía su WebSocket

**Sticky Sessions**: Asegurar que todas las requests de un usuario van al mismo servidor (mientras esté vivo).

---

## Seguridad

### Autenticación

- **JWT (JSON Web Tokens)**:
  - Firmados con HS256 (HMAC-SHA256)
  - Payload: `{userId, username, exp, iat}`
  - Expiración: 15 minutos (refresh token para renovar)

- **Hashing de Contraseñas**:
  - bcrypt con salt rounds = 12
  - Contraseñas nunca se guardan en texto plano
  - Imposible de revertir (one-way hash)

### Autorización

- **Middleware de Validación**:
  ```typescript
  // Validar que solo puedes enviar mensajes como tú mismo
  if (message.sender_id !== jwt.userId) {
    throw new Error('Unauthorized')
  }
  
  // Validar que tienes permiso para hablar con el destinatario
  const areFriends = await db.checkFriendship(userId, recipientId)
  if (!areFriends) {
    throw new Error('Forbidden')
  }
  ```

### Validación de Input

- **Sanitización**:
  - Escapar HTML para prevenir XSS
  - Limitar longitud de mensajes (5000 chars)
  - Validar formato de email, username

- **Rate Limiting**:
  - 10 mensajes por segundo por usuario (prevenir spam)
  - 1000 requests HTTP por hora por IP
  - Implementado con Redis INCR + TTL

### Comunicación Segura

- **HTTPS**: Todo el tráfico HTTP encriptado con TLS
- **WSS**: WebSockets sobre TLS (wss:// en vez de ws://)
- **CORS**: Solo permitir requests de dominios autorizados

### Base de Datos

- **Prepared Statements**: Prevenir SQL injection
- **Least Privilege**: Usuario de BD solo tiene permisos necesarios
- **Encriptación en Reposo**: PostgreSQL con LUKS/dm-crypt (opcional)
- **Backups**: Snapshots diarios encriptados

---

## Rendimiento

### Benchmarks Estimados

```
Servidor: 4 CPU, 8GB RAM, SSD NVMe

Métrica                          | Valor
---------------------------------|------------------
Usuarios conectados simultáneos  | 10,000
Mensajes por segundo             | 50,000
Latencia promedio (envío)        | 30-50ms
Latencia p99 (99% de usuarios)   | 100ms
Throughput HTTP                  | 200,000 req/s
Memoria usada (10k users)        | 2GB
CPU idle (sin tráfico)           | 5%
CPU bajo carga (50k msg/s)       | 60-70%
```

---

## Tecnologías y Por Qué

### Backend: ElysiaJS

- **Velocidad**: 4x más rápido que Fastify
- **WebSockets Nativos**: Sin dependencias adicionales
- **Type Safety**: TypeScript end-to-end

### Frontend: Vue.js

- **Reactividad**: Actualización automática del DOM
- **Simplicidad**: Más fácil que React
- **Ecosystem**: Pinia (state), Vue Router, Vite

### Base de Datos: PostgreSQL

- **Confiabilidad**: ACID compliant
- **Flexibilidad**: SQL + JSONB
- **Potencia**: Full-text search, índices avanzados

### Caché: Redis

- **Velocidad**: 100,000 ops/s
- **Pub/Sub**: Distribución instantánea de mensajes
- **Estructuras**: TTL, counters, hashes

### Infraestructura: Docker

- **Reproducibilidad**: Mismo entorno en todas partes
- **Aislamiento**: Cada servicio en su propio contenedor
- **Escalabilidad**: `docker-compose scale app=5`

---

## Conclusión

Este proyecto representa una solución moderna, eficiente y escalable para mensajería en tiempo real. Al combinar tecnologías de vanguardia (ElysiaJS, Bun) con estándares probados (PostgreSQL, Redis, WebSockets), se logra un sistema que:

- **Es Rápido**: Latencias <100ms gracias a Redis y WebSockets
- **Es Confiable**: PostgreSQL garantiza que ningún mensaje se pierda
- **Escala Bien**: Puede manejar miles de usuarios con hardware modesto
- **Es Mantenible**: Docker + TypeScript + arquitectura clara
- **Es Seguro**: JWT, bcrypt, HTTPS, validación estricta

El enfoque de **arquitectura híbrida** (Redis para velocidad, PostgreSQL para durabilidad) resuelve elegantemente el problema de latencia sin sacrificar la integridad de datos, estableciendo una base sólida para futuras expansiones.