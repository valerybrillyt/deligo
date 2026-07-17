# Componentes DeliGo — frontend

Todos en `src/app/`:

| Carpeta | Pantalla | Quién la usa |
|---------|----------|--------------|
| `home/` | `/` | Todos |
| `login/` | `/login` | Invitados |
| `registro/` | `/registro` | Invitados |
| `restaurantes/` | `/restaurantes` | **cliente**, admin |
| `menu/` | `/menu/:id` | **cliente**, admin |
| `seguimiento/` | `/seguimiento` | **cliente**, admin |
| `admin-logs/` | `/admin/logs` | **admin** (ver logs) |
| `repartidor/` | `/repartidor` | **repartidor** |
| `restaurante-panel/` | `/restaurante` | **restaurante** |
| `roles-guia/` | `/roles` | Todos (explicación de roles) |
| `patrones/` | `/patrones` | Todos (patrones de diseño) |
| `services/` | — | api.service, auth.service |

## Cuentas demo por rol

| Rol | Correo | Clave |
|-----|--------|-------|
| Cliente | demo@deligo.com | demo123 |
| Admin | admin@deligo.com | admin123 |
| Repartidor | repartidor@deligo.com | repart123 |
| Restaurante | pizza@deligo.com | rest123 |

Guía completa: **http://localhost:4200/roles**

## Ejecutar

```bash
cd frontend
npm start
```

Abrir: **http://localhost:4200**
