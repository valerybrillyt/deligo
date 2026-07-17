# DeliGo — Base de datos SQLite en DBeaver

**No necesitas instalar MySQL.** La BD es un archivo pequeño (~50 KB).

## Paso 1 — Crear el archivo (automático)

En la terminal:

```bash
cd backend
npm install
npm start
```

Eso crea: `database/deligo.db` con tablas y 3 restaurantes.

## Paso 2 — Abrir en DBeaver

1. **Database** → **New Database Connection**
2. Elige **SQLite** (no MySQL)
3. **Path:** busca el archivo:
   ```
   PROYECTO DE DISEÑO/database/deligo.db
   ```
4. **Test Connection** → Finish

## Paso 3 — Ver tablas

Expande:

```
deligo.db → Tables
```

- usuarios
- restaurantes
- productos
- pedidos
- **logs** ← auditoría de acciones del usuario

Clic derecho en **logs** → **View data** → verás login, pedidos, páginas visitadas, etc.

**Consulta SQL correcta:**

```sql
SELECT * FROM logs ORDER BY id DESC;
```

(No escribas solo `SELECT FROM logs` — falta el `*`.)

### Si la tabla `logs` sale vacía

1. **Ruta correcta:** debe ser exactamente  
   `.../PROYECTO DE DISEÑO/database/deligo.db`  
   (no `schema.sql`, no otra carpeta del proyecto).

2. **Refrescar DBeaver:** clic derecho en la conexión → **Refresh** (o F5).

3. **Arrancar el backend** (crea la tabla y datos de ejemplo si está vacía):
   ```bash
   cd backend && npm start
   ```

4. **Usar la app** un poco (login, ver restaurantes, pedir) — cada acción guarda un log.

5. **Ver por API:** abre http://localhost:3000/api/logs

6. Si sigue vacío: `cd backend && npm run reset-db && npm start`

### Roles de usuario (`usuarios.rol`)

| Rol | Permisos principales |
|-----|----------------------|
| `cliente` | Pedir comida, ver sus pedidos |
| `admin` | Ver **todos** los logs y pedidos |
| `repartidor` | Ver entregas activas, marcar en camino / entregado |
| `restaurante` | Ver pedidos de su local, marcar en preparación |

Cuentas demo: `admin@deligo.com` / `admin123` · `repartidor@deligo.com` / `repart123` · `pizza@deligo.com` / `rest123`

### Qué guarda la tabla `logs`

| Campo | Significado |
|-------|-------------|
| usuario_id | Quién hizo la acción (puede ser NULL si no había sesión) |
| accion | Ej: `LOGIN_OK`, `CREAR_PEDIDO`, `VER_MENU`, `ACCESO_DENEGADO` |
| detalle | Info extra (id de pedido, email, error…) |
| exito | 1 = bien, 0 = falló |
| creado_en | Fecha y hora |

Si la app se cae, la profesora puede revisar esta tabla para saber en qué paso quedó el usuario.

Clic derecho en **restaurantes** → **View data** → 8 restaurantes.

## Ventajas

| | SQLite | MySQL |
|---|--------|-------|
| Instalar servidor | No | Sí (~500 MB) |
| Espacio en disco | ~50 KB | Mucho más |
| DBeaver | Sí | Sí |
| Patrón Singleton | Sí (misma conexión al archivo) |

## Backend

`npm start` en `backend` → debe decir **SQLite conectado**.

Health: http://localhost:3000/api/health → `"modo": "sqlite"`
