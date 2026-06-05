# Backend DeliGo

API en Node.js con patrones: **Singleton**, **Factory**, **Decorator**, **Composite**.

## Paso 1 — Base de datos (DBeaver)

1. Abre **DBeaver** y conéctate a **MySQL**.
2. Abre el archivo: `../database/schema.sql`
3. Ejecuta todo el script (Ctrl+Enter).
4. Debe crearse la base `delivery_db` con restaurantes de ejemplo.

## Paso 2 — Archivo .env

En la carpeta `backend`, copia el ejemplo:

```bash
cp .env.example .env
```

Edita `.env` y cambia `DB_PASSWORD` por tu contraseña real de MySQL:

```
DB_PASSWORD=TU_CLAVE_AQUI
```

## Paso 3 — Instalar y ejecutar

```bash
cd backend
npm install
npm start
```

Si todo está bien verás:

```
DeliGo API → http://localhost:3000
```

Prueba en el navegador:
- http://localhost:3000/api/health  ← estado de conexión
- http://localhost:3000/api/restaurantes

Si MySQL no está encendido, el API usa **modo demo** con datos de ejemplo (la web igual funciona).

## Rutas del API

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/restaurantes` | Lista restaurantes |
| POST | `/api/usuarios/registro` | Registrar usuario |
| POST | `/api/usuarios/login` | Login (Singleton) |
| GET | `/api/restaurantes/:id/menu` | Menú (Composite) |
| POST | `/api/pedidos` | Crear pedido (Factory + Decorator) |
| GET | `/api/pedidos/:id/seguimiento` | Seguimiento mapa |

## Patrones (carpeta `patterns/`)

- `singleton/databaseConnection.js` — conexión BD
- `singleton/authService.js` — sesión login
- `factory/orderFactory.js` — tipos de pedido
- `decorator/orderDecorator.js` — extras del pedido
- `composite/menuComposite.js` — menú en árbol
