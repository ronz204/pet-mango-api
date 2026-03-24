# Arquitectura del Sistema

## Visión General

El proyecto está diseñado como una **aplicación web monolítica client-server** de alto rendimiento, optimizada para comunicación en tiempo real. La arquitectura centraliza toda la lógica de negocio, gestión de sesiones y comunicación en tiempo real en una única unidad de despliegue, lo que simplifica el mantenimiento y facilita la consistencia de datos.

## Tipo de Arquitectura: Monolítica

### Justificación de la Elección Monolítica

1. **Consistencia de Datos**: Al centralizar toda la lógica en un único proceso, se evitan los problemas de sincronización entre microservicios.

2. **Simplicidad Operacional**: Un solo artefacto de despliegue reduce la complejidad de DevOps, logging y debugging.

3. **Menor Latencia**: Las llamadas entre módulos son llamadas a funciones locales, no llamadas HTTP entre servicios.

4. **Gestión de WebSockets Simplificada**: Los WebSockets mantienen conexiones stateful; mantenerlas en un único servidor simplifica la gestión de sesiones.

## Modelo Cliente-Servidor

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Vue.js SPA (Single Page App)             │  │
│  │                                                       │  │
│  │  • Interfaz de Usuario Reactiva                       │  │
│  │  • Gestión de Estado Local (Pinia)                    │  │
│  │  • WebSocket Client (conexión persistente)            │  │
│  │  • HTTP Client (autenticación, carga inicial)         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
              WebSocket (mensajes en tiempo real)
              HTTP/REST (autenticación, datos iniciales)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        SERVIDOR                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   ElysiaJS Backend                    │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ HTTP/REST    │  │ WebSocket   │  │ Business    │   │  │
│  │  │ Endpoints    │  │ Handler     │  │ Logic       │   │  │
│  │  └──────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌─────────────┐                    │  │
│  │  │ Auth         │  │ Validation  │                    │  │
│  │  │ Middleware   │  │ Layer       │                    │  │
│  │  └──────────────┘  └─────────────┘                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
        ┌────────────────────────────────────────┐
        │         CAPA DE PERSISTENCIA           │
        │                                        │
        │  ┌──────────────┐  ┌──────────────┐    │
        │  │  PostgreSQL  │  │    Redis     │    │
        │  │              │  │              │    │
        │  │ • Usuarios   │  │ • Presencia  │    │
        │  │ • Perfiles   │  │ • Pub/Sub    │    │
        │  │ • Historial  │  │ • Contadores │    │
        │  │ • Metadata   │  │ • Caché      │    │
        │  └──────────────┘  └──────────────┘    │
        └────────────────────────────────────────┘
```

## Capas de la Aplicación

### 1. Capa de Presentación (Cliente)

- **Responsabilidad**: Interfaz de usuario, experiencia de usuario, gestión de estado local
- **Tecnología**: Vue.js con componentes reactivos
- **Comunicación**: 
  - HTTP/REST para operaciones CRUD (autenticación, carga de perfil)
  - WebSocket para mensajería en tiempo real y actualizaciones de presencia

### 2. Capa de Aplicación (Servidor)

- **Responsabilidad**: Lógica de negocio, orquestación de servicios, validación
- **Tecnología**: ElysiaJS (Bun runtime)
- **Componentes**:
  - **Router HTTP**: Maneja endpoints REST (login, registro, búsqueda)
  - **WebSocket Server**: Gestiona conexiones persistentes y enrutamiento de mensajes
  - **Middleware**: Autenticación JWT, validación de esquemas, rate limiting
  - **Business Logic**: Reglas de negocio, procesamiento de mensajes

### 3. Capa de Persistencia (Datos)

- **PostgreSQL**: 
  - Datos estructurados y relacionales
  - Persistencia a largo plazo
  - Integridad referencial
  
- **Redis**:
  - Datos en memoria de acceso ultra-rápido
  - Estados efímeros (presencia, sesiones)
  - Pub/Sub para distribución de mensajes
  - Contadores y métricas en tiempo real

## Flujo de Comunicación

### Autenticación y Carga Inicial (HTTP)

```
Cliente → POST /api/auth/login → Servidor
                                    ↓
                            Validar contra PostgreSQL
                                    ↓
                            Generar JWT Token
                                    ↓
Servidor → {token, user_data} → Cliente
                                    ↓
                            Guardar token en localStorage
                                    ↓
                            Establecer WebSocket con token
```

### Mensajería en Tiempo Real (WebSocket + Redis Pub/Sub)

```
Usuario A: "Hola" → WebSocket → Servidor ElysiaJS
                                      ↓
                            1. Validar mensaje
                            2. Guardar en PostgreSQL (async)
                            3. Publicar en Redis Pub/Sub canal "room:123"
                                      ↓
                            Redis distribuye el mensaje
                                      ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
            WebSocket Usuario A              WebSocket Usuario B
                    ↓                               ↓
              "Mensaje enviado"              Recibe "Hola"
```

### Actualización de Presencia (WebSocket + Redis TTL)

```
Cliente: Heartbeat cada 30s → WebSocket → Servidor
                                              ↓
                                    Redis SET user:123:presence "online" EX 45
                                              ↓
                                    Si no llega heartbeat → clave expira
                                              ↓
                                    Estado cambia a "offline"
```

## Ventajas de esta Arquitectura

### 1. Rendimiento

- **Latencia Mínima**: Sin overhead de red entre módulos internos
- **Gestión Eficiente de Memoria**: Redis maneja estados temporales, PostgreSQL datos permanentes
- **WebSockets Nativos**: Conexión bidireccional permanente sin polling

### 2. Escalabilidad Vertical

- **Bun Runtime**: Alto rendimiento en operaciones I/O
- **Redis**: Capacidad de manejar millones de operaciones por segundo
- **Conexiones Concurrentes**: ElysiaJS puede manejar miles de WebSockets simultáneos

### 3. Mantenibilidad

- **Código Unificado**: Una única base de código, un único lenguaje (TypeScript/JavaScript)
- **Debugging Simplificado**: Todos los logs en un solo lugar
- **Despliegue Atómico**: Una sola unidad de despliegue

## Consideraciones de Escalabilidad Futura

### Escalabilidad Horizontal (cuando sea necesario)

Si el proyecto crece más allá de la capacidad de un único servidor:

1. **Múltiples Instancias del Servidor**:
   - Load balancer (Nginx/HAProxy) distribuye tráfico HTTP
   - Redis Pub/Sub permite que múltiples instancias compartan mensajes
   - Sticky sessions para WebSockets

2. **Particionamiento de Redis**:
   - Redis Cluster para distribuir datos
   - Sharding por usuario o por sala de chat

3. **Replicación de PostgreSQL**:
   - Read replicas para consultas de historial
   - Master para escrituras

## Contenedorización (Docker)

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                       │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   app      │  │  postgres  │  │   redis    │         │
│  │ (ElysiaJS) │  │            │  │            │         │ 
│  │   + Vue    │  │  Port 5432 │  │  Port 6379 │         │
│  │  Port 3000 │  │            │  │            │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│         │               │               │               │
│         └───────────────┴───────────────┘               │
│                   Network Bridge                        │
└─────────────────────────────────────────────────────────┘
```

### Beneficios de Docker

- **Aislamiento**: Cada componente corre en su propio contenedor
- **Reproducibilidad**: Mismo entorno en desarrollo, staging y producción
- **Facilidad de Despliegue**: `docker-compose up` levanta todo el stack
- **Gestión de Dependencias**: Versiones específicas de PostgreSQL y Redis

## Seguridad

### Nivel de Transporte

- **HTTPS**: Todo el tráfico HTTP encriptado con TLS
- **WSS**: WebSockets seguros (WebSocket over TLS)

### Nivel de Aplicación

- **JWT**: Tokens firmados para autenticación stateless
- **Password Hashing**: bcrypt/argon2 para contraseñas en PostgreSQL
- **Rate Limiting**: Límites por IP y por usuario en Redis
- **Input Validation**: Validación estricta de esquemas con TypeBox/Zod

### Nivel de Base de Datos

- **Prepared Statements**: Prevención de SQL injection
- **Roles de PostgreSQL**: Usuario de aplicación con permisos mínimos
- **Redis AUTH**: Contraseña requerida para conexión
- **Network Isolation**: Bases de datos accesibles solo desde el contenedor de la app

## Monitoreo y Observabilidad

### Logging

- **Winston/Pino**: Logs estructurados en JSON
- **Niveles**: ERROR, WARN, INFO, DEBUG
- **Rotación**: Archivos de log rotados diariamente

### Métricas

- **Redis**: Contadores de mensajes enviados/recibidos
- **Healthchecks**: Endpoints `/health` y `/ready`
- **WebSocket Stats**: Conexiones activas, mensajes por segundo

### Alertas

- **Redis Monitor**: Alertar si la memoria excede el 80%
- **PostgreSQL Connections**: Alertar si se acerca al límite de conexiones
- **Error Rate**: Alertar si tasa de errores 5xx supera el 1%

## Conclusión

Esta arquitectura monolítica client-server ofrece el balance perfecto entre **simplicidad operacional** y **rendimiento en tiempo real**. Al combinar PostgreSQL para persistencia confiable y Redis para estados efímeros y distribución de mensajes, se logra un sistema que puede manejar miles de usuarios conectados simultáneamente con latencias por debajo de 100ms, mientras mantiene la capacidad de escalar horizontalmente en el futuro si es necesario.