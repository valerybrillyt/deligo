# Dónde y cómo se aplican los patrones — DeliGo

## Mapa rápido

| Patrón | Archivo backend | Pantalla web que lo usa |
|--------|-----------------|-------------------------|
| **Singleton** | `patterns/singleton/databaseConnection.js` | Todo el API (una conexión a `deligo.db`) |
| **Singleton** | `patterns/singleton/authService.js` | **Login** |
| **Factory** | `patterns/factory/orderFactory.js` | **Menú** → tipo de pedido |
| **Decorator** | `patterns/decorator/orderDecorator.js` | **Menú** → extras (propina, seguro, eco) |
| **Composite** | `patterns/composite/menuComposite.js` | **Menú** → categorías y productos |

**Frontend:** no implementa los patrones; llama al API y **muestra** el resultado.

**Base de datos:** solo guarda datos; los patrones son código en `backend/`.

---

## Flujo con patrones al hacer un pedido

```
1. Usuario elige productos (Composite ya armó el menú por categorías)
2. Usuario elige "Express" → Factory crea PedidoExpress
3. Usuario marca "Propina" → Decorator envuelve el pedido
4. Backend calcula total y guarda en SQLite (Singleton conecta)
5. Frontend muestra tarjeta "Patrones aplicados" con Factory + Decorator
```

---

## API útil para la exposición

- `GET /api/patrones` — documentación JSON de todos los patrones
- `GET /api/pedidos/tipos` — tipos Factory
- `GET /api/pedidos/extras` — extras Decorator
- Pantalla web: **http://localhost:4200/patrones**

---

Ver también: `EXPLICACION-PARA-EQUIPO.md`
