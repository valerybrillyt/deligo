# Dónde y cómo se aplican los patrones — DeliGo

## Mapa rápido

| Patrón | Archivo backend | Pantalla web que lo usa |
|--------|-----------------|-------------------------|
| **Singleton** | `patterns/singleton/databaseConnection.js` | Todo el API (una conexión a `deligo.db`) |
| **Singleton** | `patterns/singleton/authService.js` | **Login** |
| **Factory** | `patterns/factory/orderFactory.js` | **Menú** → tipo de pedido |
| **Decorator** | `patterns/decorator/orderDecorator.js` | **Menú** → extras (propina, seguro, eco) |
| **Composite** | `patterns/composite/menuComposite.js` | **Menú** → categorías y productos |
| **State** | `patterns/state/orderState.js` | Cambio de estado / cancelar pedido |
| **Memento** | `patterns/memento/orderMemento.js` | Deshacer último cambio de estado |
| **Microservicios** | `patterns/microservicios/arquitectura.js` | Límites de dominio (evolución) |
| **Antipatrones** | `patterns/antipatrones/catalogo.js` | Cómo evitamos malas prácticas |

**Frontend:** no implementa los patrones; llama al API y **muestra** el resultado.

**Base de datos:** solo guarda datos; los patrones son código en `backend/`.

---

## Flujo con patrones al hacer un pedido

```
1. Usuario elige productos (Composite ya armó el menú por categorías)
2. Usuario elige "Express" → Factory crea PedidoExpress
3. Usuario marca "Propina" → Decorator envuelve el pedido
4. Backend calcula total y guarda en SQLite (Singleton conecta)
5. Restaurante/repartidor cambia estado → State valida + Memento guarda snapshot
```

---

## API útil para la exposición

- `GET /api/patrones` — documentación JSON de todos los patrones
- `GET /api/pedidos/tipos` — tipos Factory
- `GET /api/pedidos/extras` — extras Decorator
- `GET /api/pedidos/estados` — estados State
- `POST /api/pedidos/:id/deshacer` — Memento
- `GET /api/microservicios` — límites tipo microservicio
- `GET /api/antipatrones` — antipatrones evitados
- Pantalla web: **http://localhost:4200/patrones**

---

Ver también: `TEMAS-NUEVOS-INTEGRADOS.md`, `EXPLICACION-PARA-EQUIPO.md`
