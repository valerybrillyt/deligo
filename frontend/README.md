# FrontedDeligo — Frontend DeliGo

Proyecto Angular para abrir en **Visual Studio Code**.

## Estructura de componentes

Cada pantalla tiene sus 4 archivos:

| Carpeta | Archivos |
|---------|----------|
| `home/` | bienvenida DeliGo |
| `restaurantes/` | lista de restaurantes |
| `registro/` | registro de usuario |
| `login/` | iniciar sesión |
| `menu/` | selección de productos y pedido |
| `seguimiento/` | mapa y estado del pedido |
| `services/` | `api.service.ts` (llamadas al backend) |

## Cómo abrir en VS Code

1. **File → Open Folder**
2. Elige la carpeta `FrontedDeligo` (o la raíz `PROYECTO DE DISEÑO`)

## Cómo ejecutar (después de liberar espacio en disco)

```bash
cd FrontedDeligo
npm install
npm start
```

Abre: http://localhost:4200

El backend debe estar en http://localhost:3000 (carpeta `backend` del proyecto).

## Rutas

- `/` — Inicio
- `/restaurantes` — Lista
- `/registro` — Crear cuenta
- `/login` — Entrar
- `/menu/:id` — Menú del restaurante
- `/seguimiento` — Rastreo del pedido
