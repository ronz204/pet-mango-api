# Guía de Implementación Detallada

Este documento describe la implementación técnica de cada módulo del sistema, incluyendo endpoints del backend, schemas de base de datos, reglas de negocio, interfaces del frontend y las interacciones entre componentes.

---

# Índice

1. [Módulo de Autenticación y Perfiles](#1-módulo-de-autenticación-y-perfiles)
2. [Módulo de Presencia en Tiempo Real](#2-módulo-de-presencia-en-tiempo-real)
3. [Módulo de Mensajería Instantánea](#3-módulo-de-mensajería-instantánea)
4. [Módulo de Historial y Persistencia](#4-módulo-de-historial-y-persistencia)
5. [Módulo de Notificaciones y Contadores](#5-módulo-de-notificaciones-y-contadores)
6. [Interacciones Entre Módulos](#6-interacciones-entre-módulos)

---

# 1. Módulo de Autenticación y Perfiles

## Propósito

Gestionar el registro, autenticación y perfiles de usuarios. Este módulo se encarga de la identidad del usuario en el sistema.

## Backend

### Schemas de PostgreSQL

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'away', 'offline')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Tabla de relaciones de amistad
CREATE TABLE friendships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

### Endpoints HTTP (ElysiaJS)

#### POST /api/auth/register

**Descripción**: Registrar un nuevo usuario

**Request Body**:
```typescript
{
  username: string,  // 3-50 chars, alphanumeric + underscore
  email: string,     // Formato válido de email
  password: string   // Mínimo 8 chars, debe incluir mayúscula, minúscula, número
}
```

**Validación**:
```typescript
const registerSchema = t.Object({
  username: t.String({ 
    minLength: 3, 
    maxLength: 50, 
    pattern: '^[a-zA-Z0-9_]+$' 
  }),
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 8 })
})
```

**Flujo**:
1. Validar schema
2. Verificar que username y email no existan
3. Hashear contraseña con bcrypt (salt rounds: 12)
4. Insertar en PostgreSQL
5. Generar JWT access token (exp: 24 horas)

**Response 201**:
```typescript
{
  user: {
    id: number,
    username: string,
    email: string,
  },
  access_token: string
}
```

**Response 400 (Error)**:
```typescript
{
  error: "Username already exists" | "Email already exists" | "Invalid email format"
}
```

---

#### POST /api/auth/login

**Descripción**: Iniciar sesión

**Request Body**:
```typescript
{
  email: string,
  password: string
}
```

**Flujo**:
1. Buscar usuario por email
2. Verificar contraseña con bcrypt.compare()
3. Si es correcto: generar access token

**Response 200**:
```typescript
{
  user: {
    id: number,
    username: string,
    email: string,
  },
  access_token: string
}
```

---

#### GET /api/users/me

**Descripción**: Obtener perfil del usuario autenticado

**Headers**:
```
Authorization: Bearer <access_token>
```

**Middleware**: Verificar JWT y extraer userId

**Response 200**:
```typescript
{
  id: number,
  username: string,
  email: string,
  bio: string | null,
  status: 'online' | 'away' | 'offline',
  created_at: string
}
```

---

#### PATCH /api/users/me

**Descripción**: Actualizar perfil del usuario

**Request Body** (todos opcionales):
```typescript
{
  username?: string,
  bio?: string,
  avatar_url?: string
}
```

**Flujo**:
1. Validar que username no esté tomado (si se cambia)
2. Actualizar campos en PostgreSQL
3. Invalidar caché de Redis del perfil

---

#### POST /api/users/search

**Descripción**: Buscar usuarios para agregar como amigos

**Request Body**:
```typescript
{
  query: string  // username o email
}
```

**Response 200**:
```typescript
{
  users: [
    {
      id: number,
      username: string,
      avatar_url: string | null,
      is_friend: boolean
    }
  ]
}
```

---

### Reglas de Negocio

1. **Unicidad**: Username y email deben ser únicos en todo el sistema
2. **Seguridad de Contraseñas**: 
   - Mínimo 8 caracteres
   - Debe incluir al menos: 1 mayúscula, 1 minúscula, 1 número
   - Hash con bcrypt (salt rounds: 12)
3. **Tokens JWT**:
   - Access Token: 24 horas de vida
   - Token se renueva automáticamente en cada request si está próximo a expirar
4. **Rate Limiting**:
   - Login: Máximo 5 intentos por IP cada 15 minutos
   - Register: Máximo 3 registros por IP cada hora
5. **Avatar**:
   - Si no se proporciona, usar Gravatar basado en email
   - Tamaño máximo: 2MB
   - Formatos permitidos: JPEG, PNG, WebP

---

## Frontend (Vue.js)

### Pantalla de Login

**Vista**: Formulario centrado con diseño limpio y minimalista

**Elementos visuales**:
- Contenedor centrado con fondo blanco y sombra suave
- Título "Iniciar Sesión" en la parte superior
- Dos campos de entrada:
  - **Email**: Input tipo email con placeholder "tu@email.com"
  - **Contraseña**: Input tipo password con placeholder "••••••••"
- Botón azul "Iniciar Sesión" que se vuelve ancho y cambia a "Iniciando..." durante la carga
- Mensaje de error en rojo si falla la autenticación ("Email o contraseña incorrectos")
- Link al final: "¿No tienes cuenta? Regístrate"

**Flujo de interacción**:
1. Usuario ingresa email y contraseña
2. Al hacer clic en "Iniciar Sesión", el botón se deshabilita y muestra "Iniciando..."
3. Se hace llamada HTTP a `/api/auth/login`
4. Si es exitoso: redirige a `/chat` y guarda token en localStorage
5. Si falla: muestra mensaje de error debajo del botón

**Validaciones frontend**:
- Email debe tener formato válido
- Contraseña requerida
- Ambos campos son obligatorios

---

### Store de Autenticación (Estado Global)

**Responsabilidades**:
- Mantener el estado del usuario autenticado en toda la aplicación
- Gestionar token JWT de autenticación
- Proveer métodos para login, registro y logout

**Estado reactivo**:
- `user`: Objeto con datos del usuario actual (id, username, email, avatar_url, bio)
- `accessToken`: JWT almacenado en localStorage
- `isAuthenticated`: Computed boolean basado en la existencia del accessToken

**Métodos principales**:
- `login(email, password)`: Llama al endpoint de login, guarda token y actualiza estado
- `register(username, email, password)`: Llama al endpoint de registro
- `logout()`: Limpia estado y localStorage
- `fetchCurrentUser()`: Obtiene datos frescos del usuario desde `/api/users/me`

**Persistencia**:
- Token se guarda en localStorage para sobrevivir recargas de página
- Al iniciar la app, se verifica si hay accessToken válido y se carga el usuario
- Si el token expira, el usuario debe volver a iniciar sesión

---

# 2. Módulo de Presencia en Tiempo Real

## Propósito

Mostrar el estado de conexión de los usuarios (En línea, Ausente, Desconectado) y el indicador "Escribiendo...".

## Backend

### Estructuras en Redis

```typescript
// Estado de presencia (con TTL)
Key: user:{userId}:presence
Value: "online" | "away" | "offline"
TTL: 45 segundos

// Indicador de escribiendo (con TTL)
Key: user:{senderId}:typing:{receiverId}
Value: "true"
TTL: 5 segundos

// Última vez visto
Key: user:{userId}:last_seen
Value: timestamp (Unix)
TTL: 30 días
```

### Endpoints WebSocket

#### ws.on('connection')

**Flujo al conectar**:
```typescript
app.ws('/ws', {
  open(ws) {
    // 1. Validar JWT del query string
    const token = ws.data.query.token
    const decoded = jwt.verify(token, SECRET)
    ws.data.userId = decoded.userId
    
    // 2. Suscribirse a canal personal de Redis
    const channel = `user:${decoded.userId}`
    redisSubscriber.subscribe(channel)
    
    // 3. Marcar usuario como online en Redis
    await redis.set(`user:${decoded.userId}:presence`, 'online', 'EX', 45)
    
    // 4. Notificar a amigos que el usuario está online
    const friends = await db.getFriends(decoded.userId)
    for (const friend of friends) {
      redisPublisher.publish(`user:${friend.id}`, JSON.stringify({
        type: 'presence_update',
        userId: decoded.userId,
        status: 'online'
      }))
    }
    
    // 5. Iniciar heartbeat timer
    ws.data.heartbeatInterval = setInterval(() => {
      ws.send(JSON.stringify({ type: 'ping' }))
    }, 30000)
  },
  
  message(ws, message) {
    const data = JSON.parse(message)
    
    switch (data.type) {
      case 'heartbeat':
        // Renovar TTL de presencia
        await redis.set(`user:${ws.data.userId}:presence`, 'online', 'EX', 45)
        break
        
      case 'typing':
        // Indicar que está escribiendo
        const key = `user:${ws.data.userId}:typing:${data.to}`
        await redis.set(key, 'true', 'EX', 5)
        
        // Notificar al destinatario
        redisPublisher.publish(`user:${data.to}`, JSON.stringify({
          type: 'typing',
          userId: ws.data.userId
        }))
        break
    }
  },
  
  close(ws) {
    // 1. Detener heartbeat
    clearInterval(ws.data.heartbeatInterval)
    
    // 2. Marcar como offline
    await redis.set(`user:${ws.data.userId}:presence`, 'offline')
    await redis.set(`user:${ws.data.userId}:last_seen`, Date.now())
    
    // 3. Notificar a amigos
    const friends = await db.getFriends(ws.data.userId)
    for (const friend of friends) {
      redisPublisher.publish(`user:${friend.id}`, JSON.stringify({
        type: 'presence_update',
        userId: ws.data.userId,
        status: 'offline'
      }))
    }
  }
})
```

---

### Redis Keyspace Notifications

```typescript
// Configurar Redis para notificar cuando expiren claves
redis.config('SET', 'notify-keyspace-events', 'Ex')

// Escuchar eventos de expiración
redisSubscriber.psubscribe('__keyevent@0__:expired', async (pattern, channel, key) => {
  // Formato: user:123:presence
  if (key.includes(':presence')) {
    const userId = key.split(':')[1]
    
    // Usuario se desconectó (heartbeat expiró)
    await redis.set(`user:${userId}:presence`, 'offline')
    await redis.set(`user:${userId}:last_seen`, Date.now())
    
    // Notificar a amigos
    const friends = await db.getFriends(userId)
    for (const friend of friends) {
      redisPublisher.publish(`user:${friend.id}`, JSON.stringify({
        type: 'presence_update',
        userId: userId,
        status: 'offline'
      }))
    }
  }
})
```

---

### Reglas de Negocio

1. **Heartbeat**:
   - Cliente envía heartbeat cada 30 segundos
   - TTL de presencia es 45 segundos (margen de 15s)
   - Si no llega heartbeat, Redis expira la clave automáticamente

2. **Estados**:
   - **Online**: Heartbeat activo (< 45s)
   - **Away**: No hay actividad por 5 minutos (detectado en frontend)
   - **Offline**: Sin heartbeat (clave expirada)

3. **Indicador "Escribiendo..."**:
   - Se envía solo si el usuario escribe por más de 500ms (debounce)
   - TTL de 5 segundos (desaparece automáticamente si deja de escribir)
   - Solo visible para el destinatario del mensaje

4. **Privacidad**:
   - Solo amigos pueden ver el estado de presencia
   - "Última vez visto" solo visible si el usuario lo permite en configuración

---

## Frontend (Vue.js)

### Sistema de Detección de Presencia

**Composable `usePresence`** (lógica reutilizable)

**Responsabilidades**:
- Mantener un heartbeat activo cada 30 segundos con el servidor
- Detectar actividad del usuario (movimiento de mouse, teclas)
- Cambiar automáticamente a "Ausente" después de 5 minutos de inactividad
- Escuchar actualizaciones de presencia de otros usuarios vía WebSocket
- Gestionar indicadores de "escribiendo..." con timeout automático

**Estado reactivo**:
- `presence`: Objeto con estado de cada usuario (userId → 'online' | 'away' | 'offline')
- `typingUsers`: Set de IDs de usuarios que están escribiendo actualmente

**Comportamiento automático**:
1. **Heartbeat**: Envía mensaje `{type: 'heartbeat'}` cada 30s para mantener presencia activa
2. **Detección de inactividad**: Listeners en `mousemove` y `keydown` resetean timer de 5 minutos
3. **Actualización reactiva**: Al recibir `presence_update` del servidor, actualiza el estado local
4. **Typing timeout**: Cuando llega evento de "escribiendo", lo muestra por 5 segundos máximo

---

### Indicador Visual de Presencia

**Componente `PresenceBadge`**

**Apariencia**:
- Pequeño punto circular de color + texto al lado
- **Verde** 🟢: "En línea" (heartbeat activo)
- **Amarillo** 🟡: "Ausente" (sin actividad por 5+ minutos)
- **Gris** ⚫: "Desconectado" (sin conexión WebSocket)

**Cálculo de tiempo relativo**:
Si el usuario está offline, muestra cuándo fue la última vez visto:
- Menos de 1 hora: "Hace 15 min"
- Menos de 24 horas: "Hace 3h"
- Más de 24 horas: "Hace 2d"

**Uso**: Se coloca junto al nombre del usuario en:
- Lista de amigos
- Header del chat activo
- Resultados de búsqueda de usuarios

---

# 3. Módulo de Mensajería Instantánea

## Propósito

Envío y recepción de mensajes en tiempo real usando WebSockets y Redis Pub/Sub.

## Backend

### Schema PostgreSQL (Persistencia)

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),
  metadata JSONB,  -- attachments, reactions, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para consultas eficientes
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_room ON messages(room_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

-- Full-text search
CREATE INDEX idx_messages_content_search ON messages USING GIN(to_tsvector('spanish', content));
```

---

### Endpoint WebSocket: Enviar Mensaje

```typescript
ws.on('message', async (ws, message) => {
  const data = JSON.parse(message)
  
  if (data.type === 'send_message') {
    const { to, content } = data
    
    // 1. Validaciones
    if (!content || content.length > 5000) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message content' 
      }))
      return
    }
    
    // 2. Verificar que son amigos
    const areFriends = await db.query(`
      SELECT 1 FROM friendships 
      WHERE (user_id = $1 AND friend_id = $2 AND status = 'accepted')
         OR (user_id = $2 AND friend_id = $1 AND status = 'accepted')
    `, [ws.data.userId, to])
    
    if (!areFriends.rows.length) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Not friends with recipient' 
      }))
      return
    }
    
    // 3. Guardar en PostgreSQL (asíncrono, no bloqueante)
    const dbPromise = db.query(`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, created_at
    `, [ws.data.userId, to, content])
    
    // 4. Publicar en Redis Pub/Sub (instantáneo)
    const messagePayload = {
      type: 'new_message',
      id: null,  // se actualizará cuando PostgreSQL responda
      from: ws.data.userId,
      to: to,
      content: content,
      created_at: new Date().toISOString(),
      temp_id: data.temp_id  // ID temporal del frontend para matching
    }
    
    // Publicar al canal del destinatario
    await redisPublisher.publish(`user:${to}`, JSON.stringify(messagePayload))
    
    // Publicar al canal del remitente (para otros dispositivos)
    await redisPublisher.publish(`user:${ws.data.userId}`, JSON.stringify(messagePayload))
    
    // 5. Esperar respuesta de PostgreSQL y actualizar con ID real
    const dbResult = await dbPromise
    messagePayload.id = dbResult.rows[0].id
    messagePayload.created_at = dbResult.rows[0].created_at
    
    // 6. Confirmar al remitente
    ws.send(JSON.stringify({
      type: 'message_sent',
      temp_id: data.temp_id,
      id: messagePayload.id,
      created_at: messagePayload.created_at
    }))
    
    // 7. Incrementar contador de no leídos en Redis
    await redis.incr(`user:${to}:unread:from:${ws.data.userId}`)
    
    // 8. Notificar contador actualizado
    const unreadCount = await redis.get(`user:${to}:unread:from:${ws.data.userId}`)
    await redisPublisher.publish(`user:${to}`, JSON.stringify({
      type: 'unread_update',
      from: ws.data.userId,
      count: parseInt(unreadCount)
    }))
  }
})
```

---

### Redis Pub/Sub: Distribuir Mensajes

```typescript
// Suscriptor Redis (escucha mensajes publicados)
redisSubscriber.on('message', (channel, message) => {
  const data = JSON.parse(message)
  
  // Encontrar todas las conexiones WebSocket de este usuario
  const connections = wsConnections.get(data.to) || []
  
  for (const ws of connections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message)
    }
  }
})

// Mantener mapa de userId → WebSocket connections
const wsConnections = new Map<number, Set<WebSocket>>()

ws.on('open', (ws) => {
  const userId = ws.data.userId
  if (!wsConnections.has(userId)) {
    wsConnections.set(userId, new Set())
  }
  wsConnections.get(userId).add(ws)
})

ws.on('close', (ws) => {
  const userId = ws.data.userId
  wsConnections.get(userId)?.delete(ws)
})
```

---

### Reglas de Negocio

1. **Longitud de Mensajes**:
   - Mínimo: 1 carácter
   - Máximo: 5000 caracteres
   - Espacios en blanco al inicio/final son eliminados

2. **Permisos**:
   - Solo puedes enviar mensajes a amigos aceptados
   - No puedes enviar mensajes a usuarios bloqueados

3. **Rate Limiting**:
   - Máximo 10 mensajes por segundo por usuario
   - Implementado con Redis INCR + TTL

4. **Entrega**:
   - Mensajes se entregan vía Pub/Sub instantáneamente
   - PostgreSQL guarda asíncronamente (no bloquea entrega)
   - Si PostgreSQL falla, el mensaje no se persiste pero sí se entrega

5. **Orden**:
   - Los mensajes se ordenan por `created_at` de PostgreSQL (timestamp del servidor)
   - No se confía en timestamps del cliente

---

## Frontend (Vue.js)

### Ventana de Chat Principal

**Vista `ChatWindow`**

**Layout de 3 secciones**:

**1. Header superior (fijo)**:
- Avatar circular del amigo (50x50px)
- Nombre del amigo en negrita
- Badge de presencia (🟢 En línea / 🟡 Ausente / ⚫ Desconectado)
- Fondo blanco con borde inferior gris claro

**2. Área de mensajes (scrollable)**:
- Fondo gris claro (#f9fafb)
- Burbujas de mensajes:
  - **Mensajes propios**: Alineados a la derecha, fondo azul, texto blanco
  - **Mensajes del amigo**: Alineados a la izquierda, fondo blanco, texto negro
- Cada burbuja muestra:
  - Contenido del mensaje
  - Hora de envío (formato: "14:35")
  - Estado (solo en propios): ⏱ Enviando / ✓ Enviado / ✓✓ Leído
- Al final: Indicador "[Nombre] está escribiendo..." (cursiva, gris) cuando el amigo escribe
- Auto-scroll al fondo cuando llega nuevo mensaje o se envía uno

**3. Input de mensaje (footer fijo)**:
- Textarea expandible (crece hasta 5 líneas)
- Placeholder: "Escribe un mensaje..."
- Botón azul "Enviar" a la derecha
- Enter envía mensaje, Shift+Enter añade nueva línea
- Botón deshabilitado si el textarea está vacío

**Comportamiento Optimistic UI**:
1. Al escribir mensaje y presionar Enter:
   - Mensaje aparece inmediatamente en la UI con estado "Enviando" y ID temporal
   - Input se limpia instantáneamente
   - Se envía por WebSocket en background
2. Cuando el servidor confirma:
   - Se reemplaza ID temporal por ID real de base de datos
   - Estado cambia a "Enviado" (✓)
3. Cuando el destinatario lo lee:
   - Estado cambia a "Leído" (✓✓)

**Indicador de "Escribiendo..."**:
- Se envía evento al servidor cada vez que el usuario escribe (con debounce de 500ms)
- Aparece texto en cursiva al final del área de mensajes
- Desaparece automáticamente después de 5 segundos si no hay más eventos

**Carga de historial**:
- Al abrir el chat, se cargan los últimos 50 mensajes desde PostgreSQL
- Se marca automáticamente toda la conversación como leída
- Scroll se posiciona en el último mensaje

---

### Store de Chat (Estado Global)

**Responsabilidades**:
- Gestionar todas las conversaciones activas en memoria
- Sincronizar mensajes enviados/recibidos vía WebSocket con la UI
- Cargar historial desde PostgreSQL cuando se abre un chat
- Marcar mensajes como leídos

**Estado reactivo**:
- `conversations`: Map donde la clave es `friendId` y el valor es array de mensajes

**Métodos principales**:
- `addMessage(message)`: Añade mensaje a la conversación (usado para optimistic UI y mensajes recibidos)
- `updateMessageStatus(tempId, realId, status)`: Reemplaza ID temporal por real cuando el servidor confirma
- `loadMessages(friendId, offset, limit)`: Carga historial desde `/api/messages` (paginado)
- `markAsRead(friendId)`: Llama a `/api/messages/mark-read` y borra contador de no leídos
- `getMessagesWithUser(friendId)`: Retorna array de mensajes con ese usuario

**Estructura de cada mensaje**:
```typescript
{
  id: number | null,           // null si está pending
  temp_id?: string,            // ID temporal para optimistic UI
  from: number,                // User ID del remitente
  to: number,                  // User ID del destinatario
  content: string,             // Texto del mensaje
  created_at: string,          // ISO timestamp
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}
```

---

# 4. Módulo de Historial y Persistencia

## Propósito

Almacenar todos los mensajes en PostgreSQL para que el historial persista entre sesiones.

## Backend

### Endpoint HTTP: GET /api/messages

**Descripción**: Obtener historial de mensajes con un usuario específico

**Query Params**:
```typescript
{
  with: number,      // User ID del amigo
  offset?: number,   // Default: 0
  limit?: number     // Default: 50, Max: 100
}
```

**SQL Query**:
```sql
SELECT 
  m.id,
  m.sender_id as from,
  m.receiver_id as to,
  m.content,
  m.is_read,
  m.created_at,
  u.username as sender_username,
  u.avatar_url as sender_avatar
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE 
  (m.sender_id = $1 AND m.receiver_id = $2)
  OR (m.sender_id = $2 AND m.receiver_id = $1)
ORDER BY m.created_at DESC
LIMIT $3 OFFSET $4
```

**Response 200**:
```typescript
{
  messages: [
    {
      id: number,
      from: number,
      to: number,
      content: string,
      is_read: boolean,
      created_at: string,
      sender: {
        username: string,
        avatar_url: string
      }
    }
  ],
  total: number,
  has_more: boolean
}
```

---

### Endpoint HTTP: POST /api/messages/mark-read

**Descripción**: Marcar mensajes como leídos

**Request Body**:
```typescript
{
  from: number  // User ID del remitente
}
```

**SQL Query**:
```sql
UPDATE messages
SET is_read = TRUE, updated_at = NOW()
WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE
```

**Efecto Secundario**: Borrar contador de no leídos en Redis
```typescript
await redis.del(`user:${userId}:unread:from:${fromUserId}`)
```

---

### Endpoint HTTP: GET /api/messages/search

**Descripción**: Buscar mensajes usando full-text search

**Query Params**:
```typescript
{
  q: string,      // Búsqueda
  with?: number   // Opcional: limitar a conversación con usuario
}
```

**SQL Query**:
```sql
SELECT 
  m.id,
  m.sender_id,
  m.receiver_id,
  m.content,
  m.created_at,
  ts_headline('spanish', m.content, query) as highlighted
FROM messages m, 
     to_tsquery('spanish', $1) query
WHERE to_tsvector('spanish', m.content) @@ query
  AND (m.sender_id = $2 OR m.receiver_id = $2)
ORDER BY ts_rank(to_tsvector('spanish', m.content), query) DESC
LIMIT 50
```

**Response 200**:
```typescript
{
  results: [
    {
      id: number,
      content: string,
      highlighted: string,  // Contenido con <b>términos</b> resaltados
      created_at: string,
      with_user: {
        id: number,
        username: string
      }
    }
  ]
}
```

---

### Reglas de Negocio

1. **Paginación**:
   - Default: 50 mensajes por página
   - Máximo: 100 mensajes por página
   - Scroll infinito en el frontend

2. **Orden**:
   - Mensajes ordenados por `created_at DESC` (más recientes primero en la query)
   - Frontend invierte el orden para mostrar más recientes abajo

3. **Caché**:
   - Cachear en Redis los últimos 100 mensajes de cada conversación
   - TTL: 1 hora
   - Invalidar al enviar/recibir nuevo mensaje

4. **Retención**:
   - Mensajes nunca se borran automáticamente
   - Usuario puede borrar mensajes (soft delete)
   - Exportar historial en JSON/CSV

---

## Frontend

### Sistema de Scroll Infinito para Mensajes

**Componente `InfiniteScrollMessages`**

**Propósito**: Cargar mensajes históricos de forma incremental cuando el usuario hace scroll hacia arriba.

**Comportamiento**:
1. **Carga inicial**: Al montar el componente, carga los últimos 50 mensajes
2. **Detección de scroll**: Listener en el contenedor detecta cuando el scroll está cerca del tope
3. **Carga incremental**: Si `scrollTop < 100px`, dispara `loadMore()`
4. **Paginación**: Cada llamada carga 50 mensajes más usando `offset` incremental
5. **Fin del historial**: Cuando `has_more === false`, muestra texto "Inicio de la conversación"

**Estados visuales**:
- **Loading**: Spinner en la parte superior mientras carga mensajes antiguos
- **Fin de historial**: Mensaje centrado "Inicio de la conversación" (gris, pequeño)
- **Mensajes**: Se insertan arriba de los existentes (preservando posición de scroll)

**Optimizaciones**:
- No permite múltiples cargas simultáneas (bandera `loading`)
- No intenta cargar si ya no hay más mensajes
- Mantiene posición de scroll al insertar mensajes antiguos (UX crítica)

**Uso típico**:
- Usuario abre chat → ve últimos 50 mensajes
- Usuario hace scroll hacia arriba para ver historial → se cargan 50 más
- Continúa hasta llegar al primer mensaje de la conversación

---

# 5. Módulo de Notificaciones y Contadores

## Propósito

Gestionar contadores de mensajes no leídos y notificaciones del navegador.

## Backend

### Estructuras en Redis

```typescript
// Contador de mensajes no leídos por remitente
Key: user:{userId}:unread:from:{senderId}
Value: integer (número de mensajes)
TTL: 30 días

// Total de mensajes no leídos
Key: user:{userId}:unread:total
Value: integer
TTL: 30 días
```

### Endpoint HTTP: GET /api/unread

**Descripción**: Obtener contadores de mensajes no leídos

**Response 200**:
```typescript
{
  total: number,
  by_user: [
    {
      user_id: number,
      username: string,
      avatar_url: string,
      unread_count: number
    }
  ]
}
```

**Implementación**:
```typescript
app.get('/api/unread', async ({ user }) => {
  const keys = await redis.keys(`user:${user.id}:unread:from:*`)
  
  const byUser = []
  for (const key of keys) {
    const senderId = key.split(':')[4]
    const count = await redis.get(key)
    const sender = await db.query('SELECT username, avatar_url FROM users WHERE id = $1', [senderId])
    
    byUser.push({
      user_id: parseInt(senderId),
      username: sender.rows[0].username,
      avatar_url: sender.rows[0].avatar_url,
      unread_count: parseInt(count)
    })
  }
  
  const total = byUser.reduce((sum, u) => sum + u.unread_count, 0)
  
  return { total, by_user: byUser }
})
```

---

### WebSocket: Notificar Contador Actualizado

```typescript
// Cuando llega un nuevo mensaje
ws.on('message', async (ws, data) => {
  if (data.type === 'send_message') {
    // ... enviar mensaje ...
    
    // Incrementar contador
    await redis.incr(`user:${data.to}:unread:from:${ws.data.userId}`)
    
    // Notificar al destinatario
    const count = await redis.get(`user:${data.to}:unread:from:${ws.data.userId}`)
    
    redisPublisher.publish(`user:${data.to}`, JSON.stringify({
      type: 'unread_update',
      from: ws.data.userId,
      count: parseInt(count)
    }))
  }
})
```

---

## Frontend

### Badge de Mensajes No Leídos

**Componente `UnreadBadge`**

**Apariencia**:
- Pequeño círculo rojo con número blanco en negrita
- Tamaño: Texto pequeño (0.75rem), padding ajustado
- Solo se muestra si `count > 0`
- Si count > 99, muestra "99+"

**Ubicaciones de uso**:
- Al lado del nombre de cada amigo en la lista lateral
- En el ícono de la aplicación (favicon badge)
- En el título de la página (ej: "(3) Chat - Mango")

**Actualización reactiva**:
- Se actualiza automáticamente cuando llega evento `unread_update` por WebSocket
- Al abrir un chat, se pone en 0 para ese usuario (se llama a `markAsRead`)

---

### Sistema de Notificaciones del Navegador

**Composable `useNotifications`**

**Propósito**: Mostrar notificaciones nativas del sistema operativo cuando llegan mensajes nuevos.

**Flujo de permisos**:
1. Al iniciar la app, se verifica si `Notification.permission === 'default'`
2. Si es default, se pide permiso al usuario (diálogo del navegador)
3. Si el usuario acepta, se guarda como `'granted'`
4. Si rechaza, no se vuelve a pedir (respeta la decisión)

**Lógica de notificaciones**:
- **Solo se muestran si**:
  - Permiso está concedido
  - La pestaña NO está en foco (`!document.hasFocus()`)
  - El mensaje es de otra persona (no del propio usuario)

**Contenido de la notificación**:
- **Título**: "Nuevo mensaje de [Username]"
- **Cuerpo**: Primeros 100 caracteres del mensaje
- **Ícono**: Avatar del remitente
- **Badge**: Logo de la aplicación (muestra en notificaciones agrupadas)

**Interacción**:
- Click en la notificación → enfoca la pestaña del chat
- Notificación se cierra automáticamente

**Escucha de eventos**:
- Se suscribe al evento `new_message` del WebSocket Store
- Filtra mensajes para evitar notificar de mensajes propios

---

# 6. Interacciones Entre Módulos

## Diagrama de Flujo Completo: Enviar Mensaje

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Usuario A)                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ 1. Escribe "Hola" y presiona Enter
                           ↓
                    ┌──────────────┐
                    │ ChatWindow   │
                    │   .vue       │
                    └──────────────┘
                           │
                           │ 2. sendMessage()
                           ↓
                    ┌──────────────┐
                    │  ChatStore   │ 3. Optimistic UI: añade mensaje con temp_id
                    └──────────────┘
                           │
                           │ 4. wsStore.send({type: 'send_message', ...})
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 WebSocket Connection                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ 5. Mensaje llega al servidor
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (ElysiaJS)                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ 6. ws.on('message')
                           ↓
                    ┌──────────────┐
                    │ Validaciones │
                    │  • Auth?     │
                    │  • Amigos?   │
                    │  • Límite?   │
                    └──────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
          7a. PostgreSQL      7b. Redis Pub/Sub
         (async, no bloquea)    (instantáneo)
                  │                 │
                  ↓                 ↓
         ┌────────────┐     ┌──────────────┐
         │INSERT INTO │     │PUBLISH canal │
         │  messages  │     │ "new_message"│
         └────────────┘     └──────────────┘
                  │                 │
                  │                 │ 8. Redis distribuye
                  │                 ↓
                  │         ┌──────────────┐
                  │         │ Suscriptores │
                  │         │ (Server WS)  │
                  │         └──────────────┘
                  │                 │
                  │         ┌───────┴───────┐
                  │         │               │
                  │   Usuario A      Usuario B
                  │   WebSocket      WebSocket
                  │         │               │
                  ↓         ↓               ↓
         ┌────────────────────────────────────┐
         │  9. PostgreSQL responde con ID     │
         └────────────────────────────────────┘
                           │
                           │ 10. Confirmar a Usuario A
                           ↓
┌─────────────────────────────────────────────────────────────┐
│             FRONTEND (Usuario A) - Actualización             │
└─────────────────────────────────────────────────────────────┘
                           │
                    ┌──────────────┐
                    │ ChatStore    │ 11. Actualiza temp_id → id real
                    │              │     Cambia status: 'sending' → 'sent'
                    └──────────────┘
                           │
                           │ 12. Vue reactivity actualiza UI
                           ↓
                    ┌──────────────┐
                    │ MessageBubble│ ✓ Enviado (checkmark azul)
                    └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│             FRONTEND (Usuario B) - Recibe                    │
└─────────────────────────────────────────────────────────────┘
                           │
                    ┌──────────────┐
                    │ WebSocket    │ 13. Recibe evento 'new_message'
                    │   Store      │
                    └──────────────┘
                           │
                           │ 14. chatStore.addMessage()
                           ↓
                    ┌──────────────┐
                    │ ChatWindow   │ 15. Vue actualiza UI
                    │   .vue       │     Nuevo mensaje aparece
                    └──────────────┘
                           │
                           │ 16. Sonido de notificación (opcional)
                           ↓
                    ┌──────────────┐
                    │ Notification │ 17. Si pestaña en background
                    │   Browser    │     "Nuevo mensaje de Usuario A"
                    └──────────────┘
```

---

## Interacción: Presencia Online/Offline

```
Usuario A se conecta
        │
        ↓
┌─────────────────┐
│ Frontend Vue    │
│ WebSocket.open()│
└─────────────────┘
        │
        │ ws://server?token=...
        ↓
┌─────────────────────────────────┐
│ Backend ElysiaJS                │
│                                 │
│ 1. Validar JWT                  │
│ 2. Redis SET user:A:presence    │
│    "online" EX 45               │
│ 3. Buscar amigos de A en PG    │
│ 4. Notificar a cada amigo       │
│    via Redis Pub/Sub            │
└─────────────────────────────────┘
        │
        │ Redis Pub/Sub
        ↓
┌─────────────────────────────────┐
│ Amigos de A (B, C, D)           │
│                                 │
│ WebSocket recibe:               │
│ {                               │
│   type: 'presence_update',      │
│   userId: A,                    │
│   status: 'online'              │
│ }                               │
└─────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────┐
│ Frontend de B, C, D             │
│                                 │
│ presence.value[A] = 'online'    │
│ Vue actualiza PresenceBadge     │
│ 🟢 En línea                     │
└─────────────────────────────────┘
```

---

## Conclusión

Esta implementación detallada muestra cómo cada módulo interactúa con los demás, desde el frontend Vue.js pasando por el backend ElysiaJS hasta las bases de datos PostgreSQL y Redis. La arquitectura híbrida permite:

- **Baja latencia**: Redis Pub/Sub entrega mensajes en <50ms
- **Persistencia confiable**: PostgreSQL guarda todo de forma durable
- **Escalabilidad**: Redis maneja estados efímeros, PostgreSQL datos permanentes
- **UX fluida**: Optimistic UI, actualizaciones en tiempo real, indicadores de presencia

Cada módulo tiene responsabilidades claras y se comunica con los demás a través de interfaces bien definidas (HTTP, WebSocket, Redis Pub/Sub, SQL).