### Auth Module Specification

### Propósito
El módulo `auth` maneja la autenticación de usuarios mediante login y registro, generando tokens JWT para sesiones autenticadas.

### Funcionalidades

### 1. Login (Sign In)
**Flujo:**
1. Usuario envía `email` y `password` a `/auth/sign`
2. Handler busca usuario en DB con `SearchUserSpecify`
3. Si usuario no existe → error `"User not found"`
4. Si existe → genera JWT con `{ user: userId }`
5. Retorna token al cliente

**Reglas:**
- Email y password son requeridos
- Usuario debe existir en la base de datos
- No hay validación de password hasheado (implementar en futuro)

### 2. Register (Sign Up)
**Flujo:**
1. Usuario envía `name`, `email` y `password` a `/auth/register`
2. Handler verifica que usuario NO exista con `SearchUserSpecify`
3. Si existe → error `"User already exists"`
4. Si no existe → crea usuario con `RegisterSpecify`
5. Genera JWT con `{ user: userId }`
6. Retorna token al cliente

**Reglas:**
- Name, email y password son requeridos
- Email debe ser único
- Password se guarda en texto plano (implementar hash en futuro)
- Auto-login después del registro (retorna token inmediatamente)

## Arquitectura

### Estructura de capas
```
Plugin (routes) → Handler (business logic) → Specify (query builder) → Prisma (DB)
                                         ↓
                                    Mapper (transform response)
```

### Componentes

**Plugins:**
- `AuthPlugin` - Agrupa LoginPlugin y RegisterPlugin bajo `/auth`
- `LoginPlugin` - Define ruta POST `/sign`
- `RegisterPlugin` - Define ruta POST `/register`

**Handlers:**
- `LoginHandler` - Lógica de login
- `RegisterHandler` - Lógica de registro

**Mappers:**
- `LoginMapper` - Convierte User → LoginOutput
- `RegisterMapper` - Convierte User → RegisterOutput

**Specifies:**
- `RegisterSpecify` - Construye query de creación de usuario
- `SearchUserSpecify` - Construye query de búsqueda (de módulo users)

## Mejoras Pendientes

1. **Seguridad:**
   - Hashear passwords con bcrypt/argon2
   - Validar formato de email
   - Rate limiting para prevenir brute force
   - Verificar password en login

2. **Validación:**
   - Password mínimo 8 caracteres
   - Email válido con regex
   - Name no vacío
