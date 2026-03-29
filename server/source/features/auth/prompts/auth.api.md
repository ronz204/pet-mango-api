
### POST /auth/sign
Login de usuario existente.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string" // JWT token con payload { user: number }
}
```

**Errores:**
- `Error("User not found")` - Usuario no existe en la base de datos

---

### POST /auth/register
Registro de nuevo usuario.

**Request Body:**
```typescript
{
  name: string;     // Nombre del usuario
  email: string;    // Email del usuario
  password: string; // Contraseña del usuario
}
```

**Response (200):**
```typescript
{
  token: string; // JWT token con payload { user: number }
}
```

**Errores:**
- `Error("User already exists")` - Usuario ya existe en la base de datos

---
