/**
 * Datos completos para demo / presentación.
 * Si cambias el catálogo, sube SEED_VERSION en databaseConnection.js
 */
const SEED_VERSION = 4;

const RESTAURANTES = [
  { nombre: 'Pizza Express', direccion: 'Av. Arequipa 2850, Miraflores, Lima', lat: -12.1196, lng: -77.0365 },
  { nombre: 'Sushi House', direccion: 'Calle Berlin 198, Miraflores, Lima', lat: -12.1235, lng: -77.0282 },
  { nombre: 'Burger Zone', direccion: 'Av. La Marina 2000, San Miguel, Lima', lat: -12.0775, lng: -77.095 },
  { nombre: 'Tacos El Güero', direccion: 'Av. Benavides 1230, Santiago de Surco, Lima', lat: -12.135, lng: -77.008 },
  { nombre: 'Café DeliGo', direccion: 'Jr. de la Unión 500, Cercado de Lima', lat: -12.0464, lng: -77.0308 },
  { nombre: 'Pasta Italiana', direccion: 'Calle San Martín 320, Barranco, Lima', lat: -12.1467, lng: -77.0211 },
  { nombre: 'Pollo Rico', direccion: 'Av. Brasil 1200, Jesús María, Lima', lat: -12.069, lng: -77.051 },
  { nombre: 'Vegan Garden', direccion: 'Av. Javier Prado Este 4200, Surco, Lima', lat: -12.098, lng: -76.978 },
];

const PRODUCTOS_POR_REST = [
  [
    ['Pizza Margarita', 'Salsa de tomate, mozzarella y albahaca fresca', 32, 'Pizzas'],
    ['Pizza Pepperoni', 'Pepperoni premium y queso fundido', 38, 'Pizzas'],
    ['Pizza Cuatro Quesos', 'Gorgonzola, parmesano, mozzarella y provolone', 42, 'Pizzas'],
    ['Pizza Hawaiana', 'Jamón, piña y extra queso', 36, 'Pizzas'],
    ['Pizza Vegetariana', 'Champiñones, pimiento y aceitunas', 37, 'Pizzas'],
    ['Pizza Limeña', 'Jamón del país, aceituna y ají amarillo', 39, 'Pizzas'],
    ['Garlic Bread', 'Pan con mantequilla de ajo', 12, 'Entradas'],
    ['Nachos con queso', 'Totopos, queso fundido y guacamole', 15, 'Entradas'],
    ['Alitas BBQ (6)', 'Bañadas en salsa barbecue', 18, 'Entradas'],
    ['Ensalada César', 'Lechuga romana, crutones y aderezo', 16, 'Ensaladas'],
    ['Refresco 600ml', 'Inca Kola, Coca-Cola o Sprite', 5, 'Bebidas'],
    ['Agua mineral', '500 ml', 3, 'Bebidas'],
    ['Cerveza artesanal', 'Lager o IPA 355 ml', 12, 'Bebidas'],
    ['Brownie con helado', 'Postre casero', 14, 'Postres'],
    ['Cheesecake', 'De frutos rojos', 15, 'Postres'],
    ['Combo familiar', '2 pizzas medianas + 2 refrescos', 75, 'Combos'],
  ],
  [
    ['Roll California', '8 piezas, cangrejo y palta', 22, 'Rolls'],
    ['Roll Spicy Tuna', 'Atún picante y pepino', 26, 'Rolls'],
    ['Roll Philadelphia', 'Salmón, queso crema y pepino', 28, 'Rolls'],
    ['Roll Dragon', 'Anguila, palta y salsa unagi', 32, 'Rolls'],
    ['Sashimi mix', '12 piezas del día', 38, 'Sashimi'],
    ['Sashimi salmón', '8 piezas de salmón fresco', 32, 'Sashimi'],
    ['Poke bowl salmón', 'Arroz, salmón, edamame y salsa', 28, 'Bowls'],
    ['Poke bowl atún', 'Atún, mango y salsa ponzu', 30, 'Bowls'],
    ['Ramen tonkotsu', 'Caldo cremoso y chashu', 28, 'Platos calientes'],
    ['Yakisoba', 'Fideos salteados con verduras', 24, 'Platos calientes'],
    ['Edamame', 'Vaporizado con sal marina', 10, 'Entradas'],
    ['Gyozas (6)', 'Empanadillas de cerdo', 14, 'Entradas'],
    ['Té verde', '500 ml', 6, 'Bebidas'],
    ['Sake copa', 'Caliente o frío', 14, 'Bebidas'],
    ['Mochi (3 pzas)', 'Fresa, matcha o vainilla', 12, 'Postres'],
    ['Combo sushi', 'Roll + sashimi + edamame', 58, 'Combos'],
  ],
  [
    ['Hamburguesa clásica', '150 g res, lechuga, tomate y salsa', 22, 'Hamburguesas'],
    ['Hamburguesa BBQ', 'Cebolla caramelizada y tocino', 26, 'Hamburguesas'],
    ['Hamburguesa vegana', 'Proteína vegetal y palta', 24, 'Hamburguesas'],
    ['Papas fritas', 'Porción mediana', 10, 'Acompañamientos'],
    ['Aros de cebolla', '8 piezas crujientes', 12, 'Acompañamientos'],
    ['Malteada vainilla', '350 ml', 12, 'Bebidas'],
    ['Refresco', '355 ml', 5, 'Bebidas'],
    ['Combo clásico', 'Hamburguesa + papas + refresco', 32, 'Combos'],
  ],
  [
    ['Orden tacos pastor (3)', 'Piña, culantro y cebolla', 14, 'Tacos'],
    ['Orden tacos bistec (3)', 'Con salsa criolla', 15, 'Tacos'],
    ['Quesadilla flor de calabaza', 'Grande con queso', 12, 'Antojitos'],
    ['Gringa al pastor', 'Tortilla de harina rellena', 13, 'Antojitos'],
    ['Guacamole', 'Con totopos artesanales', 12, 'Entradas'],
    ['Chicha morada', '500 ml', 5, 'Bebidas'],
    ['Limonada frozen', '500 ml', 6, 'Bebidas'],
    ['Arroz con leche', 'Casero', 8, 'Postres'],
  ],
  [
    ['Latte', 'Leche entera o vegetal', 12, 'Café'],
    ['Cappuccino', 'Espresso doble', 13, 'Café'],
    ['Cold brew', 'Hielo y jarabe opcional', 14, 'Café'],
    ['Croissant mantequilla', 'Horneado del día', 8, 'Panadería'],
    ['Bagel salmón', 'Queso crema y eneldo', 22, 'Desayunos'],
    ['Sandwich club', 'Pavo, tocino y palta', 20, 'Desayunos'],
    ['Cheesecake frutos rojos', 'Porción', 14, 'Postres'],
    ['Jugo naranja', 'Recién exprimido', 10, 'Bebidas'],
  ],
  [
    ['Spaghetti bolognesa', 'Salsa de carne casera', 26, 'Pastas'],
    ['Fettuccine Alfredo', 'Crema, parmesano y pimienta', 24, 'Pastas'],
    ['Lasagna de la casa', 'Capas de carne y bechamel', 28, 'Pastas'],
    ['Risotto de hongos', 'Arborio y parmesano', 30, 'Platos fuertes'],
    ['Ensalada caprese', 'Tomate, mozzarella y albahaca', 18, 'Ensaladas'],
    ['Pan focaccia', 'Aceite de olivo y romero', 8, 'Entradas'],
    ['Tiramisú', 'Clásico italiano', 14, 'Postres'],
    ['Vino tinto copa', 'Casa', 16, 'Bebidas'],
  ],
  [
    ['Pollo a la brasa 1/4', 'Con papas y ensalada', 22, 'Pollos'],
    ['Pollo a la brasa 1/2', 'Con papas y ensalada', 38, 'Pollos'],
    ['Pechuga empanizada', 'Con puré', 24, 'Platos fuertes'],
    ['Alitas BBQ (8)', 'Bañadas en salsa', 22, 'Alitas'],
    ['Papas a la francesa', 'Grande', 10, 'Acompañamientos'],
    ['Ensalada coleslaw', 'Cremosa', 8, 'Acompañamientos'],
    ['Limonada', '1 litro', 8, 'Bebidas'],
    ['Mazamorra morada', 'Porción', 7, 'Postres'],
  ],
  [
    ['Bowl buddha', 'Quinoa, tofu y verduras', 26, 'Bowls'],
    ['Hamburguesa de garbanzo', 'Pan integral', 22, 'Platos fuertes'],
    ['Wrap falafel', 'Hummus y pepino', 20, 'Wraps'],
    ['Ensalada mediterránea', 'Aceitunas y vinagreta', 18, 'Ensaladas'],
    ['Smoothie verde', 'Espinaca, plátano y mango', 14, 'Bebidas'],
    ['Avena overnight', 'Chía y frutos rojos', 12, 'Desayunos'],
    ['Brownie vegano', 'Sin lácteos', 10, 'Postres'],
    ['Agua de coco', '330 ml', 8, 'Bebidas'],
  ],
];

const USUARIOS_DEMO = [
  {
    nombre: 'María Demo',
    email: 'demo@deligo.com',
    password: 'demo123',
    direccion: 'Av. Arequipa 456, Miraflores, Lima',
    lat: -12.121,
    lng: -77.034,
    rol: 'cliente',
    restaurante: null,
  },
  {
    nombre: 'Juan Pérez',
    email: 'estudiante@deligo.com',
    password: 'deligo2026',
    direccion: 'Calle Las Flores 220, San Isidro, Lima',
    lat: -12.098,
    lng: -77.036,
    rol: 'cliente',
    restaurante: null,
  },
  {
    nombre: 'Admin DeliGo',
    email: 'admin@deligo.com',
    password: 'admin123',
    direccion: 'Oficina central DeliGo, Lima',
    lat: -12.0464,
    lng: -77.0428,
    rol: 'admin',
    restaurante: null,
  },
  {
    nombre: 'Carlos Repartidor',
    email: 'repartidor@deligo.com',
    password: 'repart123',
    direccion: 'Base repartos DeliGo, Lima',
    lat: -12.08,
    lng: -77.05,
    rol: 'repartidor',
    restaurante: null,
  },
  {
    nombre: 'Dueño Pizza Express',
    email: 'pizza@deligo.com',
    password: 'rest123',
    direccion: 'Av. Arequipa 2850, Miraflores, Lima',
    lat: -12.1196,
    lng: -77.0365,
    rol: 'restaurante',
    restaurante: 'Pizza Express',
  },
];

function aplicarSeed(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const row = db.prepare("SELECT value FROM meta WHERE key = 'seed_version'").get();
  if (row && Number(row.value) >= SEED_VERSION) {
    asegurarUsuariosDemo(db);
    return;
  }

  const tx = db.transaction(() => {
    db.exec('DELETE FROM pedidos');
    db.exec('DELETE FROM productos');
    db.exec('DELETE FROM restaurantes');

    const insRest = db.prepare(
      'INSERT INTO restaurantes (nombre, direccion, latitud, longitud) VALUES (?,?,?,?)'
    );
    const restIds = RESTAURANTES.map((r) => {
      const info = insRest.run(r.nombre, r.direccion, r.lat, r.lng);
      return Number(info.lastInsertRowid);
    });

    const insProd = db.prepare(
      'INSERT INTO productos (restaurante_id, nombre, descripcion, precio, categoria) VALUES (?,?,?,?,?)'
    );
    PRODUCTOS_POR_REST.forEach((items, idx) => {
      const restId = restIds[idx];
      items.forEach(([nombre, desc, precio, cat]) => {
        insProd.run(restId, nombre, desc, precio, cat);
      });
    });

    db.prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('seed_version', ?)"
    ).run(String(SEED_VERSION));
  });

  tx();
  asegurarUsuariosDemo(db);
  asegurarPedidosDemo(db);
  asegurarLogsDemo(db);
  console.log('   📦 Base de datos cargada:', RESTAURANTES.length, 'restaurantes,',
    RESTAURANTES.length * 8, 'productos aprox.');
}

/** Si la tabla logs está vacía, inserta ejemplos para DBeaver / exposición */
function asegurarLogsDemo(db) {
  const n = db.prepare('SELECT COUNT(*) AS c FROM logs').get();
  if (n.c > 0) return;

  const demo = db
    .prepare('SELECT id FROM usuarios WHERE email = ?')
    .get('demo@deligo.com');
  const uid = demo?.id ?? null;

  const ins = db.prepare(
    'INSERT INTO logs (usuario_id, accion, detalle, ruta, ip, exito) VALUES (?,?,?,?,?,?)'
  );
  const filas = [
    [uid, 'LOGIN_OK', 'email=demo@deligo.com', '/api/usuarios/login', '127.0.0.1', 1],
    [uid, 'VER_RESTAURANTES', '', '/api/restaurantes', '127.0.0.1', 1],
    [uid, 'VER_MENU', 'restaurante_id=1', '/api/restaurantes/1/menu', '127.0.0.1', 1],
    [uid, 'CREAR_PEDIDO', 'pedido_id=1 total=40.00 pago=efectivo', '/api/pedidos', '127.0.0.1', 1],
    [uid, 'VER_SEGUIMIENTO', 'pedido_id=1', '/api/pedidos/1/seguimiento', '127.0.0.1', 1],
    [null, 'LOGIN_ERROR', 'email=incorrecto@test.com', '/api/usuarios/login', '127.0.0.1', 0],
    [uid, 'ACCESO_PAGINA', '/restaurantes', '', '127.0.0.1', 1],
  ];
  filas.forEach((f) => ins.run(...f));
  console.log('   📋 Logs de ejemplo insertados (7 filas) para la tabla logs');
}

function asegurarUsuariosDemo(db) {
  const upsert = db.prepare(`
    INSERT INTO usuarios (nombre, email, password, direccion, latitud, longitud, rol, restaurante_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      rol = excluded.rol,
      restaurante_id = excluded.restaurante_id,
      nombre = excluded.nombre
  `);
  const restId = (nombre) =>
    nombre
      ? db.prepare('SELECT id FROM restaurantes WHERE nombre = ?').get(nombre)?.id ?? null
      : null;

  USUARIOS_DEMO.forEach((u) => {
    upsert.run(
      u.nombre,
      u.email,
      u.password,
      u.direccion,
      u.lat,
      u.lng,
      u.rol,
      restId(u.restaurante)
    );
  });
}

function asegurarPedidosDemo(db) {
  const demo = db
    .prepare('SELECT id FROM usuarios WHERE email = ?')
    .get('demo@deligo.com');
  if (!demo) return;

  const ya = db
    .prepare('SELECT COUNT(*) AS c FROM pedidos WHERE usuario_id = ?')
    .get(demo.id);
  if (ya.c > 0) return;

  const ins = db.prepare(
    'INSERT INTO pedidos (usuario_id, restaurante_id, tipo, descripcion_extra, total, estado) VALUES (?,?,?,?,?,?)'
  );
  const rest = (nombre) =>
    db.prepare('SELECT id FROM restaurantes WHERE nombre = ?').get(nombre)?.id;
  const pizza = rest('Pizza Express');
  const sushi = rest('Sushi House');
  const tacos = rest('Tacos El Güero');
  if (pizza) ins.run(demo.id, pizza, 'estandar', 'Propina incluida', 40, 'entregado');
  if (sushi) ins.run(demo.id, sushi, 'express', 'Seguro de envío', 58, 'en_camino');
  if (tacos) ins.run(demo.id, tacos, 'estandar', '', 34, 'preparando');
}

module.exports = { SEED_VERSION, aplicarSeed, asegurarLogsDemo, USUARIOS_DEMO };
