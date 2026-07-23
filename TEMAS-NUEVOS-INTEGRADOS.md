# Temas nuevos integrados en DeliGo

Material de clase integrado: **State**, **Memento**, **Microservicios**, **Antipatrones**.

## Mapa rápido

| Tema | Archivo | Dónde se nota en la app |
|------|---------|-------------------------|
| **State** | `backend/patterns/state/orderState.js` | Cambiar estado / cancelar pedido |
| **Memento** | `backend/patterns/memento/orderMemento.js` | Guarda snapshot; `POST /api/pedidos/:id/deshacer` |
| **Microservicios** | `backend/patterns/microservicios/arquitectura.js` | Límites de dominio + `GET /api/microservicios` |
| **Antipatrones** | `backend/patterns/antipatrones/catalogo.js` | Cómo los evitamos + `GET /api/antipatrones` |

Pantalla: **http://localhost:4200/patrones**

---

## State (sesión 12)

Cada estado del pedido es una clase (`pendiente`, `preparando`, `en_camino`, `entregado`, `cancelado`).  
El contexto `PedidoContexto` valida transiciones (ej. no puedes pasar de `entregado` a `preparando`).

Evita el antipatrón **código espagueti** con muchos `if/else`.

## Memento (sesión 13)

Antes de cambiar o cancelar un pedido se guarda un **memento** (snapshot).  
`POST /api/pedidos/:id/deshacer` restaura el estado anterior (Originator + Caretaker).

Útil para explicar “deshacer” sin romper encapsulación.

## Microservicios (sesión 11)

DeliGo hoy es **monolito modular** (un Node + SQLite), pero ya está dividido por dominio:

- usuarios · catálogo · pedidos · pagos · geo · auditoría  

Comunicación pensada como en clase: **HTTP REST + JSON**.  
Así se puede explicar evolución a microservicios sin mentir: aún no son procesos separados.

## Antipatrones

Documentamos qué **no** hacemos:

| Antipatrón | Cómo lo evitamos |
|------------|------------------|
| Clase Dios | Varios servicios/patrones |
| Código espagueti | State |
| Código duplicado | Factory + Decorator |
| Martillo de oro | OSM/OSRM, SQLite según necesidad |
| Parche sobre parche | Memento + State + roles |
| Big Ball of Mud | Carpetas `patterns/`, `services/`, `middleware/` |

---

## Frases para la exposición

- **State:** “El pedido no usa un montón de if: cada estado sabe a cuáles puede pasar.”
- **Memento:** “Antes de cancelar o cambiar, guardamos un snapshot para poder deshacer.”
- **Microservicios:** “Hoy es un monolito limpio; los límites ya están listos para separar servicios.”
- **Antipatrones:** “No es solo aplicar patrones: también evitamos malas prácticas del curso.”
