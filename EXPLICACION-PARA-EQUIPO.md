# DeliGo — Explicación completa para principiantes

Guía para ti y tus amigos: qué es cada cosa, por qué existe cada archivo y cómo se conecta todo.

---

## 1. La idea general (como un restaurante real)

Imagina **DeliGo** como un restaurante con 3 zonas:

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Angular)          Lo que VES en el navegador    │
│  Pantallas, botones, colores   http://localhost:4200        │
└───────────────────────────────┬─────────────────────────────┘
                                │ Pide datos (HTTP)
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Node.js)           El "cerebro" del sistema      │
│  Reglas, login, pedidos        http://localhost:3000        │
└───────────────────────────────┬─────────────────────────────┘
                                │ Lee y guarda datos
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  BASE DE DATOS (SQLite)      La "bodega" de información    │
│  Archivo deligo.db           Se abre en DBeaver             │
└─────────────────────────────────────────────────────────────┘
```

| Parte | ¿Qué es? | Analogía |
|-------|----------|----------|
| **Frontend** | La web que el usuario ve y toca | El mesero que te muestra el menú |
| **Backend** | Programa en el servidor que procesa peticiones | La cocina que prepara el pedido |
| **Base de datos** | Donde se guardan usuarios, restaurantes, pedidos | La despensa con ingredientes anotados |

**No se mezclan:** el frontend NO guarda datos permanentes; el backend NO dibuja botones. Cada uno tiene su trabajo.

---

## 2. ¿Qué es Angular? (el frontend)

**Angular** es un framework (herramienta) para hacer webs organizadas en **piezas llamadas componentes**.

En lugar de un solo archivo HTML gigante, divides la app en pantallas:

- Pantalla de inicio → carpeta `home/`
- Pantalla de restaurantes → carpeta `restaurantes/`
- etc.

Angular usa **TypeScript** (`.ts`) = JavaScript con tipos, más ordenado para proyectos grandes.

### Los 4 archivos de cada componente

Cada pantalla tiene **4 archivos con el mismo nombre**:

| Archivo | Extensión | Para qué sirve |
|---------|-----------|----------------|
| Lógica | `.component.ts` | Comportamiento: qué pasa al hacer clic, llamar al API |
| Vista | `.component.html` | Lo visual: textos, botones, formularios (HTML) |
| Estilos | `.component.css` | Colores, tamaños, diseño de ESA pantalla |
| Pruebas | `.component.spec.ts` | Tests automáticos (la universidad a veces lo pide) |

**Ejemplo:** `home.component.ts` + `home.component.html` = la pantalla "Bienvenido a DeliGo".

---

## 3. Las líneas `import` arriba de los `.ts`

Al inicio de casi todo archivo `.ts` verás líneas como:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
```

**¿Qué significa?**

- `import` = "necesito usar código que está en otro archivo o librería"
- `{ Component }` = traigo solo la parte llamada `Component`
- `from '@angular/core'` = viene de Angular (ya instalado en `node_modules`)
- `from '../services/api.service'` = viene de un archivo **nuestro** del proyecto

**Rutas relativas (`../`):**

- `.` = carpeta actual
- `..` = subir una carpeta

Ejemplo desde `home/home.component.ts`:

```
../services/api.service  →  sube a app/  →  entra a services/
```

Sin esos `import`, el archivo no sabría qué es `Component` ni `ApiService`.

---

## 4. Estructura del FRONTEND (`frontend/`)

Trabajad en la carpeta **`frontend/`** (es la misma que `FrontedDeligo`, usad una sola).

```
frontend/
├── package.json          ← Lista de librerías (Angular, etc.)
├── angular.json          ← Configuración del proyecto Angular
├── proxy.conf.json       ← (opcional) Redirige /api al backend
├── src/
│   ├── index.html        ← Página HTML mínima; aquí se monta la app
│   ├── main.ts           ← Punto de entrada: "arranca Angular"
│   ├── styles.css        ← Estilos globales (toda la web)
│   └── app/
│       ├── app.component.*     ← Marco general (menú arriba, pie abajo)
│       ├── app.config.ts       ← Configuración (HTTP, rutas)
│       ├── app.routes.ts       ← MAPA de URLs → pantallas
│       ├── services/
│       │   └── api.service.ts  ← Habla con el backend
│       ├── home/               ← Pantalla inicio
│       ├── restaurantes/       ← Lista de restaurantes
│       ├── registro/           ← Crear cuenta
│       ├── login/              ← Iniciar sesión
│       ├── menu/               ← Elegir productos
│       └── seguimiento/        ← Rastrear pedido
```

### Archivos importantes del frontend

#### `src/main.ts`
- **Qué hace:** Enciende Angular y carga `AppComponent`.
- **Analogía:** El botón de "encender" la aplicación.

#### `src/index.html`
- **Qué hace:** Tiene `<app-root></app-root>` donde Angular inserta todo.
- **Analogía:** El marco vacío del cuadro; Angular pinta dentro.

#### `app.component.html` + `app.component.ts`
- **Qué hace:** El **layout** común: logo DeliGo, menú (Inicio, Restaurantes, Registro…), `<router-outlet>` donde cambia cada pantalla.
- **`<router-outlet>`:** Hueco donde Angular muestra home, restaurantes, etc. según la URL.

#### `app.routes.ts` — LAS RUTAS (muy importante)

```typescript
{ path: 'restaurantes', component: RestaurantesComponent }
```

| URL en el navegador | Componente que se muestra |
|---------------------|---------------------------|
| `http://localhost:4200/` | HomeComponent (inicio) |
| `http://localhost:4200/restaurantes` | RestaurantesComponent |
| `http://localhost:4200/registro` | RegistroComponent |
| `http://localhost:4200/login` | LoginComponent |
| `http://localhost:4200/menu/1` | MenuComponent (restaurante id=1) |
| `http://localhost:4200/seguimiento` | SeguimientoComponent |

**Ruta** = la dirección web. **Componente** = la pantalla que corresponde.

Los links del menú usan `routerLink="/restaurantes"` para cambiar de pantalla **sin recargar** toda la página.

#### `app.config.ts`
- Activa el **router** (rutas) y **HttpClient** (para llamar al backend).

#### `services/api.service.ts` — CONEXIÓN FRONTEND → BACKEND

Este archivo es el **mensajero** entre la web y el servidor.

```typescript
const API = 'http://localhost:3000/api';

getRestaurantes() {
  return this.http.get(`${API}/restaurantes`);
}
```

**Flujo cuando abres Restaurantes:**

1. `restaurantes.component.ts` llama a `this.api.getRestaurantes()`
2. `api.service.ts` hace una petición HTTP a `http://localhost:3000/api/restaurantes`
3. El **backend** responde con JSON: `[{ nombre: "Pizza Express", ... }]`
4. El componente muestra esa lista en el HTML

**Importante:** El frontend **nunca** toca `deligo.db` directo. Solo habla con el backend por HTTP.

#### Cada componente y el caso de estudio

| Componente | Requisito del caso de estudio |
|------------|-------------------------------|
| **home** | Mensaje de bienvenida |
| **restaurantes** | Lista de restaurantes disponibles |
| **registro** | Registro de usuario |
| **login** | Iniciar sesión |
| **menu** | Selección de productos y crear pedido |
| **seguimiento** | Seguimiento del pedido (mapa / coordenadas) |

#### Ejemplo: `restaurantes.component.ts` (simplificado)

```typescript
ngOnInit() {                          // Cuando se abre la pantalla
  this.api.getRestaurantes().subscribe({
    next: (data) => this.restaurantes = data,   // Si OK, guarda lista
    error: () => this.error = 'No se pudieron cargar...'  // Si falla backend
  });
}
```

- `ngOnInit` = función que Angular ejecuta al entrar a la pantalla.
- `subscribe` = "cuando llegue la respuesta del servidor, haz esto".

---

## 5. Estructura del BACKEND (`backend/`)

El backend está en **JavaScript puro** (`.js`), no Angular.

```
backend/
├── package.json              ← Librerías: express, sqlite...
├── server.js                 ← Enciende el servidor en puerto 3000
├── routes/
│   └── api.js                ← Todas las URLs del API (/api/...)
├── patterns/                 ← Patrones de diseño (curso)
│   ├── singleton/
│   │   ├── databaseConnection.js   ← UNA sola conexión a la BD
│   │   └── authService.js          ← UNA sola gestión de login
│   ├── factory/
│   │   └── orderFactory.js         ← Crea tipos de pedido
│   ├── decorator/
│   │   └── orderDecorator.js       ← Extras al pedido (propina, etc.)
│   └── composite/
│       └── menuComposite.js        ← Menú en árbol categorías→productos
└── (config/, data/ = archivos viejos de modo demo, ya no se usan)
```

### `server.js`
- Crea la app Express.
- Conecta SQLite.
- Escucha en **puerto 3000**.
- Monta las rutas en `/api`.

### `routes/api.js` — Rutas del API (backend)

| Método | URL | Qué hace |
|--------|-----|----------|
| GET | `/api/health` | ¿Está vivo el servidor? ¿Cuántos restaurantes? |
| GET | `/api/restaurantes` | Devuelve lista desde la BD |
| POST | `/api/usuarios/registro` | Guarda usuario nuevo |
| POST | `/api/usuarios/login` | Valida email/password |
| GET | `/api/restaurantes/1/menu` | Productos del restaurante 1 |
| POST | `/api/pedidos` | Crea pedido (usa Factory + Decorator) |
| GET | `/api/pedidos/1/seguimiento` | Datos para el mapa |

**GET** = pedir información. **POST** = enviar datos nuevos (registro, pedido).

### Patrones de diseño (¿por qué esas carpetas?)

| Patrón | Archivo | Para qué en DeliGo |
|--------|---------|-------------------|
| **Singleton** | `databaseConnection.js` | Solo existe UNA conexión al archivo SQLite |
| **Singleton** | `authService.js` | Un solo lugar controla quién está logueado |
| **Factory** | `orderFactory.js` | Crea pedido estándar, express o programado |
| **Decorator** | `orderDecorator.js` | Añade propina, seguro, empaque sin cambiar el pedido base |
| **Composite** | `menuComposite.js` | Organiza menú: categoría → productos (árbol) |

**¿Van en frontend, backend o BD?**

- **Backend** → Sí, toda la lógica de patrones.
- **Frontend** → Solo muestra resultados; no implementa Factory/Composite.
- **Base de datos** → Solo tablas; los patrones son código JavaScript.

---

## 6. BASE DE DATOS (`database/`)

| Archivo | Qué es |
|---------|--------|
| `deligo.db` | Archivo SQLite con datos (se crea al hacer `npm start` en backend) |
| `schema.sql` | Versión antigua para MySQL (referencia; ya no es obligatorio) |
| `GUIA-DBEAVER.md` | Cómo abrir `deligo.db` en DBeaver |

### Tablas

| Tabla | Guarda |
|-------|--------|
| `usuarios` | Nombre, email, password, dirección, coordenadas |
| `restaurantes` | Nombre, dirección, latitud, longitud |
| `productos` | Comida de cada restaurante |
| `pedidos` | Pedidos hechos por usuarios |

**DBeaver** es solo un programa para **ver y editar** ese archivo como una tabla Excel.

---

## 7. Cómo se conectan los 3 (paso a paso)

**Ejemplo: ver lista de restaurantes**

```
1. Usuario abre http://localhost:4200/restaurantes
         ↓
2. Angular lee app.routes.ts → carga RestaurantesComponent
         ↓
3. restaurantes.component.ts → api.getRestaurantes()
         ↓
4. api.service.ts → GET http://localhost:3000/api/restaurantes
         ↓
5. backend/routes/api.js → consulta SQLite "SELECT * FROM restaurantes"
         ↓
6. database/deligo.db devuelve filas
         ↓
7. Backend responde JSON al frontend
         ↓
8. HTML muestra Pizza Express, Sushi House, Burger Zone
```

**Los dos servidores deben estar encendidos:**

```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm start
```

---

## 8. Puertos fijos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 4200 | http://localhost:4200 |
| Backend | 3000 | http://localhost:3000 |

Si el frontend dice que no carga restaurantes → casi siempre el backend no está en 3000.

---

## 9. Para trabajar en equipo (GitHub)

1. Una persona sube el proyecto a GitHub.
2. Los demás hacen `git clone`.
3. Cada uno:
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
4. **No subir** `node_modules/` ni `.env` con contraseñas.
5. Cada quien crea su `deligo.db` local al ejecutar `npm start` en backend.

---

## 10. Resumen en una frase por carpeta

| Carpeta | Una frase |
|---------|-----------|
| `frontend/` | La web DeliGo que ve el usuario |
| `frontend/src/app/*/` | Una pantalla por carpeta (componente) |
| `frontend/src/app/app.routes.ts` | Qué URL muestra qué pantalla |
| `frontend/src/app/services/api.service.ts` | Llama al backend por internet local |
| `backend/` | Servidor que obedece peticiones y usa patrones |
| `backend/routes/api.js` | Lista de "comandos" HTTP del API |
| `backend/patterns/` | Patrones Singleton, Factory, Decorator, Composite |
| `database/deligo.db` | Archivo donde viven los datos |
| DBeaver | Programa para ver `deligo.db` |

---

## 11. Preguntas que hará el profesor (respuestas cortas)

**¿Qué es el frontend?**  
La interfaz en el navegador hecha con Angular y componentes `.ts` + `.html`.

**¿Qué es el backend?**  
Node.js + Express que expone `/api/...` y aplica los patrones de diseño.

**¿Qué es la base de datos?**  
SQLite en `deligo.db`, gestionada desde DBeaver.

**¿Cómo se comunican frontend y backend?**  
HTTP: el `api.service.ts` pide datos a `http://localhost:3000/api/...`.

**¿Por qué componentes?**  
Para separar cada pantalla del caso de estudio y mantener el código ordenado.

---

*Documento para el equipo DeliGo — Caso de estudio 4*
