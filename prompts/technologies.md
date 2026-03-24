# Stack Tecnológico

## Resumen del Stack

```
┌─────────────────────────────────────────────────────────┐
│                       FRONTEND                          │
│                        Vue.js                           │
│         Framework progresivo para interfaces            │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                      COMUNICACIÓN                       │
│                     WebSockets                          │
│         Conexión bidireccional en tiempo real           │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                           │
│                       ElysiaJS                          │
│         Framework web sobre Bun runtime                 │
└─────────────────────────────────────────────────────────┘
                           ↕
         ┌─────────────────────────────────┐
         │        CAPA DE DATOS            │
         │                                 │
         │  ┌───────────┐  ┌───────────┐   │
         │  │PostgreSQL │  │   Redis   │   │
         │  └───────────┘  └───────────┘   │
         └─────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                   INFRAESTRUCTURA                       │
│                       Docker                            │
│         Contenedorización y orquestación                │
└─────────────────────────────────────────────────────────┘
```

---

## 1. ElysiaJS - Backend Framework

### ¿Qué es ElysiaJS?

ElysiaJS es un framework web moderno construido sobre **Bun** (un runtime de JavaScript ultra-rápido escrito en Zig). Es la respuesta de Bun a Express/Fastify, diseñado específicamente para aprovechar las capacidades de alto rendimiento de Bun.

### Justificación de Selección

#### 1.1. Rendimiento Extremo

```typescript
// Benchmark comparativo (requests por segundo)
Express.js:    ~15,000 req/s
Fastify:       ~45,000 req/s
ElysiaJS:      ~200,000 req/s  ← 4x más rápido que Fastify
```

**Razón**: En una aplicación de mensajería en tiempo real, cada milisegundo cuenta. ElysiaJS puede manejar 200,000+ requests por segundo gracias a:
- **Bun Runtime**: Motor de JavaScript extremadamente rápido (3x más rápido que Node.js)
- **Compilación JIT Optimizada**: Bun usa JavaScriptCore (el motor de Safari)
- **Sin Overhead de Node.js**: Elimina las capas de abstracción de Node.js

#### 1.2. Soporte Nativo de WebSockets

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
  .ws('/chat', {
    message(ws, message) {
      // Manejo nativo de WebSocket sin librerías adicionales
      ws.send(`Echo: ${message}`)
    }
  })
```

**Razón**: 
- WebSockets de primera clase, sin necesidad de Socket.io o ws
- Menor latencia (no hay capa de abstracción adicional)
- Gestión eficiente de memoria para miles de conexiones simultáneas

#### 1.3. Type Safety End-to-End

```typescript
app.post('/message', async ({ body }) => {
  // body es automáticamente tipado y validado
  return { id: 1, text: body.text }
}, {
  body: t.Object({
    text: t.String({ minLength: 1, maxLength: 5000 })
  })
})
```

**Razón**:
- Validación automática con TypeBox (más rápido que Zod)
- Type inference sin código adicional
- Menos bugs en producción

#### 1.4. Ecosistema Moderno

- **Elysia Plugins**: JWT, CORS, Static Files listos para usar
- **Compatibilidad con NPM**: Puede usar cualquier librería de Node.js
- **Developer Experience**: Hot reload ultra-rápido (50ms vs 1-2s de Node.js)

### Desventajas Consideradas

- **Comunidad Pequeña**: ElysiaJS es relativamente nuevo (2023)
- **Menos Recursos**: Menos tutoriales y Stack Overflow answers
- **Mitigación**: La documentación oficial es excelente y el código es más simple que Express

---

## 2. Vue.js - Frontend Framework

### ¿Qué es Vue.js?

Framework progresivo de JavaScript para construir interfaces de usuario. Creado por Evan You en 2014.

### Justificación de Selección

#### 2.1. Reactividad Eficiente para Chat en Tiempo Real

```vue
<script setup>
import { ref } from 'vue'

const messages = ref([])

// Actualización automática del DOM cuando llega un mensaje
websocket.on('message', (msg) => {
  messages.value.push(msg)  // Vue actualiza el UI automáticamente
})
</script>

<template>
  <div v-for="msg in messages" :key="msg.id">
    {{ msg.text }}
  </div>
</template>
```

**Razón**:
- **Sistema de Reactividad**: Vue actualiza el DOM automáticamente cuando cambian los datos
- **Virtual DOM Optimizado**: Solo re-renderiza los componentes que cambiaron
- **Perfecto para Listas Dinámicas**: Mensajes que llegan constantemente en tiempo real

#### 2.2. Curva de Aprendizaje Suave

```vue
<!-- Sintaxis simple y legible -->
<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage">
    <button @click="sendMessage">Enviar</button>
  </div>
</template>
```

**Razón**:
- Sintaxis declarativa e intuitiva
- Más fácil de aprender que React (no necesitas JSX)
- Menos boilerplate que Angular

#### 2.3. Composition API para Lógica Reutilizable

```typescript
// composables/useWebSocket.ts
export function useWebSocket() {
  const connected = ref(false)
  const messages = ref([])
  
  function connect() { /* ... */ }
  function send(msg) { /* ... */ }
  
  return { connected, messages, connect, send }
}

// Usar en cualquier componente
const { messages, send } = useWebSocket()
```

**Razón**:
- Lógica de WebSocket reutilizable entre componentes
- Mejor organización de código que Options API
- Similar a React Hooks pero más simple

#### 2.4. Ecosystem Maduro

- **Pinia**: State management moderno (reemplazo de Vuex)
- **Vue Router**: Navegación client-side
- **Vite**: Build tool ultra-rápido (creado por el mismo autor de Vue)
- **Nuxt** (opcional): Si en el futuro se necesita SSR

#### 2.5. Rendimiento

- **Tamaño**: ~40KB gzipped (vs React 42KB)
- **Speed**: Ligeramente más rápido que React en benchmarks
- **Memory**: Menor consumo de memoria en listas largas

### Comparación con Alternativas

| Característica | Vue.js | React | Angular |
|---------------|--------|-------|---------|
| Tamaño Bundle | 40KB | 42KB | 500KB+ |
| Curva Aprendizaje | Fácil | Media | Difícil |
| Reactividad | Automática | useState | RxJS |
| TypeScript | Excelente | Excelente | Nativo |
| Comunidad | Grande | Enorme | Media |

**Decisión**: Vue ofrece el mejor balance entre simplicidad y potencia para este proyecto.

---

## 3. WebSockets - Protocolo de Comunicación

### ¿Qué son WebSockets?

Protocolo de comunicación bidireccional full-duplex sobre TCP (RFC 6455). Permite conexiones persistentes entre cliente y servidor.

### Justificación de Selección

#### 3.1. Baja Latencia

```
HTTP Polling:          Cliente → GET /messages → Servidor (cada 5s)
                       Latencia: 0-5000ms

WebSocket:            Cliente ⟷ Servidor (conexión persistente)
                       Latencia: 10-50ms
```

**Razón**: 
- Mensajes entregados instantáneamente (sin polling)
- Ahorro masivo de bandwidth (sin headers HTTP repetidos)

#### 3.2. Comunicación Bidireccional

```typescript
// Servidor puede ENVIAR datos sin que el cliente lo pida
ws.send('User X está escribiendo...')

// Cliente también puede enviar cuando quiera
ws.send('Hola!')
```

**Razón**:
- Perfecto para chat (ambos lados necesitan iniciar comunicación)
- Actualizaciones de presencia ("está escribiendo...")
- Notificaciones push

#### 3.3. Menor Overhead

```
HTTP Request:
GET /api/messages HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0...
Accept: application/json
Cookie: session=abc123...
... (500-800 bytes de headers)

WebSocket Frame:
[2-14 bytes de header] + payload
```

**Razón**:
- 40x menos overhead que HTTP
- Crucial cuando se envían millones de mensajes cortos

#### 3.4. Compatibilidad Universal

- **Soporte de Navegadores**: 97%+ de usuarios (IE11+, Chrome, Firefox, Safari, Edge)
- **Fallback**: Si falla, se puede usar Long Polling automáticamente

### Comparación con Alternativas

| Tecnología | Latencia | Overhead | Complejidad | Soporte |
|------------|----------|----------|-------------|---------|
| HTTP Polling | Alta (1-5s) | Muy Alto | Baja | Universal |
| Long Polling | Media (100ms-1s) | Alto | Media | Universal |
| Server-Sent Events | Baja | Medio | Baja | Solo servidor→cliente |
| WebSockets | Muy Baja (<50ms) | Muy Bajo | Media | 97%+ |
| WebRTC | Ultra Baja | Bajo | Alta | P2P, complejo |

**Decisión**: WebSockets son el estándar de facto para chat en tiempo real.

---

## 4. Redis - Base de Datos en Memoria

### ¿Qué es Redis?

REmote DIctionary Server - Base de datos NoSQL en memoria, tipo key-value store. Soporta estructuras de datos avanzadas.

### Justificación de Selección

#### 4.1. Velocidad Extrema

```
PostgreSQL: ~10,000 reads/s por núcleo
Redis:      ~100,000 reads/s por núcleo  (10x más rápido)

Latencia:
PostgreSQL: 1-5ms
Redis:      0.1-0.3ms  (10x más rápido)
```

**Razón**: Perfecto para datos que se consultan constantemente:
- Estado de presencia de usuarios (online/offline)
- Contadores de mensajes no leídos
- Caché de datos de usuario frecuentes

#### 4.2. Pub/Sub Nativo

```typescript
// Publisher (Servidor 1)
redis.publish('room:123', JSON.stringify({
  from: 'user_a',
  text: 'Hola'
}))

// Subscriber (Servidor 2)
redis.subscribe('room:123', (message) => {
  // Recibe el mensaje instantáneamente
  broadcast(message)
})
```

**Razón**:
- **Distribución de Mensajes**: Si tienes múltiples servidores, Redis distribuye mensajes entre ellos
- **Desacoplamiento**: El remitente no necesita saber quién escucha
- **Latencia Sub-Milisegundo**: Más rápido que cualquier message queue

#### 4.3. Estructuras de Datos Avanzadas

```typescript
// STRING con TTL (Time To Live)
await redis.set('user:123:presence', 'online', 'EX', 30)
// Si no hay heartbeat en 30s, la clave desaparece automáticamente

// HASH para perfiles en caché
await redis.hset('user:123', {
  name: 'Juan',
  avatar: 'url...',
  status: 'online'
})

// SORTED SET para ranking de usuarios más activos
await redis.zadd('active_users', Date.now(), 'user:123')

// COUNTER para mensajes no leídos
await redis.incr('user:123:unread')  // Incremento atómico
```

**Razón**:
- **TTL Automático**: Ideal para presencia (si no hay heartbeat → usuario offline)
- **Operaciones Atómicas**: Incrementos/decrementos sin race conditions
- **Flexibilidad**: Diferentes estructuras para diferentes casos de uso

#### 4.4. Persistencia Opcional

```
RDB (Redis Database):
- Snapshot cada X minutos
- Perfecto para recuperación de desastres

AOF (Append Only File):
- Log de todas las operaciones
- Recuperación a un punto exacto en el tiempo
```

**Razón**:
- Aunque Redis es en-memoria, puede persistir datos críticos
- Balance entre velocidad y durabilidad
- En este proyecto: AOF para contadores, RDB para presencia (efímera)

#### 4.5. Casos de Uso Específicos en el Proyecto

| Caso de Uso | Estructura Redis | Por Qué |
|-------------|------------------|---------|
| Presencia Online | STRING + TTL | Expira automáticamente si no hay heartbeat |
| Pub/Sub Mensajes | PUB/SUB | Distribución instantánea a todos los clientes |
| Mensajes No Leídos | COUNTER | Incremento atómico sin bloqueos |
| Sesiones Activas | HASH | Almacenamiento rápido de datos de sesión |
| Rate Limiting | STRING + TTL | Bloquear usuarios que envían spam |
| Caché de Búsquedas | STRING | Evitar queries pesadas a PostgreSQL |

### Comparación con Alternativas

| Tecnología | Velocidad | Pub/Sub | TTL | Complejidad |
|------------|-----------|---------|-----|-------------|
| Memcached | Alta | No | Sí | Baja |
| Redis | Alta | Sí | Sí | Media |
| RabbitMQ | Media | Sí (complejo) | No | Alta |
| Apache Kafka | Media-Alta | Sí | No | Muy Alta |

**Decisión**: Redis ofrece la combinación perfecta de velocidad, Pub/Sub y TTL para este proyecto.

---

## 5. PostgreSQL - Base de Datos Relacional

### ¿Qué es PostgreSQL?

Sistema de gestión de bases de datos relacional de código abierto, considerado el más avanzado del mundo.

### Justificación de Selección

#### 5.1. Integridad de Datos

```sql
-- Constraints garantizan consistencia
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Razón**:
- **Foreign Keys**: Garantiza que un mensaje siempre tenga un usuario válido
- **Constraints**: Username único, email válido, etc.
- **ACID**: Transacciones confiables (Atomicidad, Consistencia, Aislamiento, Durabilidad)

#### 5.2. Consultas Complejas

```sql
-- Buscar mensajes con paginación y filtros
SELECT m.*, u.username, u.avatar 
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.room_id = $1
  AND m.created_at > $2
  AND m.content ILIKE '%búsqueda%'
ORDER BY m.created_at DESC
LIMIT 50 OFFSET 100;
```

**Razón**:
- **JOINs**: Relacionar mensajes con usuarios eficientemente
- **Full-Text Search**: Búsqueda de mensajes con índices GIN
- **Agregaciones**: Contar mensajes, calcular promedios, etc.

#### 5.3. JSON Nativo

```sql
-- Almacenar metadata flexible
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB  -- Attachments, mentions, reactions
);

-- Consultar dentro del JSON
SELECT * FROM messages
WHERE metadata @> '{"attachments": [{"type": "image"}]}';
```

**Razón**:
- **Flexibilidad**: Metadata de mensajes (archivos adjuntos, menciones, reacciones)
- **Indexable**: Crear índices GIN sobre campos JSON
- **Balance**: Estructura relacional + flexibilidad NoSQL

#### 5.4. Escalabilidad Vertical y Horizontal

**Vertical**:
- Puede manejar TB de datos en un solo servidor
- Hardware moderno (128GB RAM, SSD NVMe) = excelente rendimiento

**Horizontal**:
- **Read Replicas**: Múltiples servidores de lectura
- **Partitioning**: Dividir tabla de mensajes por fecha (partition por mes)
- **Sharding** (futuro): Dividir por usuario o sala

#### 5.5. Características Avanzadas Útiles

```sql
-- Índices parciales (solo mensajes recientes)
CREATE INDEX idx_recent_messages 
ON messages(created_at) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- Full-Text Search en español
CREATE INDEX idx_messages_search 
ON messages USING GIN(to_tsvector('spanish', content));

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_modified_time
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

### Casos de Uso Específicos en el Proyecto

| Caso de Uso | Por Qué PostgreSQL |
|-------------|-------------------|
| Usuarios y Perfiles | Datos estructurados, constraints, unicidad |
| Historial de Mensajes | Durabilidad, consultas complejas, búsqueda |
| Salas de Chat | Relaciones many-to-many con usuarios |
| Archivos Adjuntos | Metadata en JSONB, referencia a storage externo |
| Audit Log | Write-heavy, retención a largo plazo |

### Comparación con Alternativas

| Característica | PostgreSQL | MySQL | MongoDB |
|---------------|------------|-------|---------|
| ACID | Completo | Completo | Limitado |
| JSON | JSONB (indexable) | JSON | Nativo |
| Full-Text Search | Excelente | Básico | Bueno |
| Geoespacial | PostGIS | Limitado | Bueno |
| Complejidad | Media | Baja | Baja |
| Rendimiento Write | Alto | Muy Alto | Muy Alto |
| Rendimiento Read | Muy Alto | Alto | Alto |

**Decisión**: PostgreSQL ofrece el mejor balance entre potencia, flexibilidad y confiabilidad.

---

## 6. Docker - Contenedorización

### ¿Qué es Docker?

Plataforma de contenedorización que empaqueta aplicaciones y sus dependencias en contenedores aislados.

### Justificación de Selección

#### 6.1. Entorno Reproducible

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/chatdb
      REDIS_URL: redis://redis:6379
  
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
  
  redis:
    image: redis:7-alpine
```

**Razón**:
- **"Funciona en mi máquina"**: Mismo entorno en dev, staging, prod
- **Onboarding Rápido**: Nuevo developer solo ejecuta `docker-compose up`
- **CI/CD**: Build y deploy consistentes

#### 6.2. Aislamiento de Dependencias

```dockerfile
# Cada servicio tiene sus propias dependencias
FROM oven/bun:1.0-alpine

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
CMD ["bun", "run", "src/index.ts"]
```

**Razón**:
- PostgreSQL 16, Redis 7, Bun 1.0 - versiones exactas
- No contamina el sistema host
- Múltiples proyectos pueden usar versiones diferentes

#### 6.3. Escalabilidad Horizontal Facilitada

```yaml
# Escalar horizontalmente con un comando
docker-compose up --scale app=3
```

**Razón**:
- Múltiples instancias del backend sin configuración manual
- Load balancer (Nginx) puede distribuir tráfico
- Redis Pub/Sub sincroniza entre instancias

#### 6.4. Gestión de Recursos

```yaml
app:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        memory: 1G
```

**Razón**:
- Prevenir que un contenedor consuma todos los recursos
- Monitoreo de uso de CPU/RAM por contenedor
- Mejor control de costos en cloud

#### 6.5. Seguridad

```dockerfile
# Multi-stage build
FROM oven/bun:1.0-alpine AS builder
# ... build steps ...

FROM oven/bun:1.0-alpine
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001
USER appuser  # No corre como root

COPY --from=builder /app/dist ./dist
```

**Razón**:
- Contenedores no privilegiados
- Menor superficie de ataque
- Aislamiento de red entre contenedores

#### 6.6. Networking Simplificado

```
app → db:5432      (nombre de host automático)
app → redis:6379   (DNS interno de Docker)
```

**Razón**:
- No necesitas IPs hardcodeadas
- Service discovery automático
- Network isolation (contenedores solo ven lo que necesitan)

### Comparación con Alternativas

| Característica | Docker | VM | Bare Metal |
|---------------|--------|-----|------------|
| Startup Time | 1-2s | 30-60s | N/A |
| Overhead | Bajo (~50MB) | Alto (~1GB+) | Ninguno |
| Portabilidad | Alta | Media | Baja |
| Aislamiento | Bueno | Excelente | Ninguno |
| Complejidad | Media | Alta | Baja |

**Decisión**: Docker ofrece el mejor balance entre aislamiento, portabilidad y rendimiento.

---

## Integración del Stack Completo

### Flujo de Datos Completo

```
1. Usuario escribe mensaje en Vue.js
   ↓
2. WebSocket envía a ElysiaJS
   ↓
3. ElysiaJS valida y autentica
   ↓
4. Guarda en PostgreSQL (async)
   ↓
5. Publica en Redis Pub/Sub
   ↓
6. Redis distribuye a todos los suscriptores
   ↓
7. ElysiaJS recibe del Pub/Sub
   ↓
8. WebSocket envía a Vue.js de receptores
   ↓
9. Vue.js actualiza UI reactivamente
```

### Justificación del Stack Completo

Este stack fue elegido porque:

1. **Rendimiento**: ElysiaJS + Bun + Redis = latencias <50ms
2. **Escalabilidad**: PostgreSQL + Redis Pub/Sub permiten escalar horizontalmente
3. **Developer Experience**: TypeScript end-to-end, hot reload, type safety
4. **Madurez**: Todas las tecnologías son production-ready (excepto ElysiaJS, que es riesgoso pero mitigable)
5. **Costo**: Todo es open-source, sin licencias
6. **Comunidad**: Cada tecnología tiene comunidad activa (excepto ElysiaJS, pero Bun está creciendo rápido)

### Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| ElysiaJS es nuevo | La API es simple, fácil migrar a Fastify si es necesario |
| Bun no es Node.js | 95%+ de librerías NPM son compatibles |
| Redis es en-memoria | Usar AOF persistence para datos críticos |
| WebSockets no escalan fácilmente | Redis Pub/Sub + sticky sessions soluciona esto |

### Conclusión

Este stack tecnológico representa la mejor combinación de:
- **Velocidad de desarrollo** (Vue, ElysiaJS, Docker)
- **Rendimiento en producción** (Bun, Redis, PostgreSQL)
- **Mantenibilidad a largo plazo** (TypeScript, Docker, SQL)

Es un stack moderno, probado en producción (excepto ElysiaJS), y diseñado específicamente para aplicaciones en tiempo real.