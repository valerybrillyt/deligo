# Cómo se aplicaron los patrones de diseño — DeliGo

**Proyecto:** Sistema de delivery online (Caso de estudio 4)  
**Stack:** Frontend Angular · Backend Node.js · Base de datos SQLite  
**Repositorio:** https://github.com/valerybrillyt/deligo

---

## 1. Introducción

En DeliGo se implementaron **cuatro patrones de diseño** solicitados en el curso de Diseño de Patrones. Todos están en el **backend** (carpeta `backend/patterns/`). El frontend **no implementa** los patrones directamente: consume el API y muestra el resultado al usuario (menú, tipos de entrega, extras, login, etc.).

La base de datos solo almacena información; los patrones son **lógica de software** en JavaScript.

---

## 2. Resumen rápido

| Patrón | Archivo en el backend | Dónde se usa en la aplicación web |
|--------|----------------------|-----------------------------------|
| **Singleton** | `patterns/singleton/databaseConnection.js` | Todo el API (una sola conexión a `deligo.db`) |
| **Singleton** | `patterns/singleton/authService.js` | Pantalla de **Login** |
| **Factory** | `patterns/factory/orderFactory.js` | Pantalla **Menú** → tipo de pedido |
| **Decorator** | `patterns/decorator/orderDecorator.js` | Pantalla **Menú** → extras (propina, seguro, eco) |
| **Composite** | `patterns/composite/menuComposite.js` | Pantalla **Menú** → categorías y productos |

---

## 3. Singleton

### 3.1 Conexión a la base de datos

**Archivo:** `backend/patterns/singleton/databaseConnection.js`

**Qué hace:** Garantiza que exista **una sola instancia** de conexión a la base de datos SQLite (`database/deligo.db`). Si varias partes del servidor piden la base de datos, siempre reciben la misma conexión.

**Por qué es Singleton:** El constructor comprueba si ya existe una instancia (`DatabaseConnection.instance`). Si existe, devuelve la misma; si no, crea una nueva.

**Uso en el proyecto:** Todas las rutas del API (restaurantes, usuarios, menú, pedidos, seguimiento) usan `db.getPool().query(...)` a través de esta única conexión.

### 3.2 Servicio de autenticación

**Archivo:** `backend/patterns/singleton/authService.js`

**Qué hace:** Mantiene **una sola instancia** del servicio de sesiones. Al hacer login, genera un token y lo guarda en un `Map` en memoria.

**Uso en el proyecto:** Cuando el usuario inicia sesión en la pantalla **Login**, el backend llama a `authService.login(userId, email)` y devuelve el token al frontend.

---

## 4. Factory (Fábrica)

**Archivo:** `backend/patterns/factory/orderFactory.js`

**Qué hace:** Crea el **tipo correcto de pedido** según la opción que elige el usuario, sin que el resto del código tenga que conocer cada clase.

**Clases creadas:**

| Tipo | Clase | Tiempo estimado | Costo de envío |
|------|--------|-----------------|----------------|
| estándar | `PedidoEstandar` | 45 minutos | $3.50 |
| express | `PedidoExpress` | 20 minutos | $6.00 |
| programado | `PedidoProgramado` | 60 minutos | $2.00 |

**Función principal:** `crearPedido(tipo, datos)` — usa un `switch` para instanciar la clase adecuada.

**Uso en el proyecto:** En la pantalla **Menú**, el usuario elige el tipo de entrega (normal, rápida o programada). Al confirmar el pedido, el backend ejecuta `crearPedido(tipoPedido, {...})` y calcula el total con las reglas de esa clase.

---

## 5. Decorator (Decorador)

**Archivo:** `backend/patterns/decorator/orderDecorator.js`

**Qué hace:** Añade **servicios opcionales** al pedido (propina, seguro, empaque ecológico) **sin modificar** las clases creadas por la Factory. Cada extra “envuelve” al pedido anterior.

**Decoradores implementados:**

| Código | Nombre | Costo extra |
|--------|--------|-------------|
| propina | Propina para el repartidor | $2.00 |
| seguro | Protección del pedido | $1.50 |
| eco | Empaque sustentable | $0.75 |

**Función principal:** `aplicarDecoradores(pedido, extras)` — va encadenando decoradores sobre un `PedidoBase`.

**Uso en el proyecto:** En la pantalla **Menú**, el usuario marca los extras que desea. Al confirmar, el backend suma esos costos al total final del pedido.

---

## 6. Composite (Compuesto)

**Archivo:** `backend/patterns/composite/menuComposite.js`

**Qué hace:** Organiza el menú de cada restaurante como un **árbol**:

- **Categoría** (`CategoriaComposite`): nodo que contiene hijos (ej. “Pizzas”, “Bebidas”).
- **Producto** (`ProductoHoja`): hoja del árbol (ej. “Pizza Margarita”).

**Estructura ejemplo:**

```
Menú DeliGo (raíz)
 └── Pizzas
      ├── Pizza Margarita
      └── Pizza Pepperoni
 └── Bebidas
      └── Refresco 600ml
```

**Función principal:** `construirMenuDesdeProductos(productos)` — agrupa los productos de la base de datos por categoría.

**Uso en el proyecto:** Al abrir el menú de un restaurante, el API devuelve `menuArbol` y el frontend muestra los platillos agrupados por categoría.

---

## 7. Flujo completo al hacer un pedido

1. El usuario abre el **Menú** → el **Composite** arma categorías y productos.
2. Agrega platillos al carrito.
3. Elige tipo de entrega → la **Factory** crea `PedidoEstandar`, `PedidoExpress` o `PedidoProgramado`.
4. Marca extras → el **Decorator** envuelve el pedido y suma costos.
5. Confirma → el **Singleton** de base de datos guarda el pedido en SQLite.
6. El usuario puede ver el pedido en **Seguimiento**.

Este flujo está en `backend/routes/api.js`, ruta `POST /api/pedidos`.

---

## 8. Endpoints del API relacionados con patrones

| Método y ruta | Descripción |
|---------------|-------------|
| `GET /api/patrones` | Documentación JSON de los cuatro patrones (para exposición) |
| `GET /api/pedidos/tipos` | Lista los tipos de pedido de la Factory |
| `GET /api/pedidos/extras` | Lista los extras del Decorator |
| `GET /api/restaurantes/:id/menu` | Menú con árbol Composite (`menuArbol`) |
| `POST /api/usuarios/login` | Login usando Singleton de `authService` |
| `POST /api/pedidos` | Crea pedido usando Factory + Decorator + Singleton BD |

**Pantalla académica en el frontend:** `http://localhost:4200/patrones` — muestra la explicación leyendo `GET /api/patrones`.

---

## 9. Frases para la exposición oral

- **Singleton:** “Usamos una sola conexión a la base de datos y un solo servicio de sesiones para todo el servidor.”
- **Factory:** “Según el tipo de entrega que elige el cliente, la fábrica crea el pedido con tiempo y costo de envío distintos.”
- **Decorator:** “Los extras como propina o seguro se agregan envolviendo el pedido, sin cambiar las clases de la fábrica.”
- **Composite:** “El menú se muestra por categorías porque cada categoría es un compuesto y cada platillo es una hoja del árbol.”

---

## 10. Archivos de apoyo en el repositorio

- `PATRONES-EN-EL-PROYECTO.md` — mapa patrón → archivo → pantalla
- `EXPLICACION-PARA-EQUIPO.md` — guía general del proyecto
- `backend/patterns/` — código fuente de los cuatro patrones

---

*Documento generado para el equipo DeliGo — Proyecto de Diseño de Patrones.*
