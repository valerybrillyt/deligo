/**
 * Datos completos para demo / presentación.
 * Si cambias el catálogo, sube SEED_VERSION en databaseConnection.js
 */
const SEED_VERSION = 2;

const RESTAURANTES = [
  { nombre: 'Pizza Express', direccion: 'Av. Insurgentes 120, CDMX', lat: 19.4326, lng: -99.1332 },
  { nombre: 'Sushi House', direccion: 'Calle Mar 45, Polanco', lat: 19.435, lng: -99.14 },
  { nombre: 'Burger Zone', direccion: 'Plaza Norte 12, Satélite', lat: 19.428, lng: -99.125 },
  { nombre: 'Tacos El Güero', direccion: 'Eje Central 890', lat: 19.426, lng: -99.128 },
  { nombre: 'Café DeliGo', direccion: 'Roma Norte, Oaxaca 22', lat: 19.418, lng: -99.162 },
  { nombre: 'Pasta Italiana', direccion: 'Condesa, Amsterdam 55', lat: 19.411, lng: -99.175 },
  { nombre: 'Pollo Rico', direccion: 'Coyoacán Centro 8', lat: 19.35, lng: -99.162 },
  { nombre: 'Vegan Garden', direccion: 'Santa Fe, Paseo 300', lat: 19.36, lng: -99.26 },
];

const PRODUCTOS_POR_REST = [
  [
    ['Pizza Margarita', 'Salsa de tomate, mozzarella y albahaca fresca', 129, 'Pizzas'],
    ['Pizza Pepperoni', 'Pepperoni premium y queso fundido', 159, 'Pizzas'],
    ['Pizza Cuatro Quesos', 'Gorgonzola, parmesano, mozzarella y provolone', 169, 'Pizzas'],
    ['Pizza Hawaiana', 'Jamón, piña y extra queso', 149, 'Pizzas'],
    ['Garlic Bread', 'Pan con mantequilla de ajo', 59, 'Entradas'],
    ['Refresco 600ml', 'Coca-Cola, Sprite o Fanta', 35, 'Bebidas'],
    ['Agua mineral', '500 ml', 25, 'Bebidas'],
    ['Brownie con helado', 'Postre casero', 79, 'Postres'],
  ],
  [
    ['Roll California', '8 piezas, cangrejo y aguacate', 145, 'Rolls'],
    ['Roll Spicy Tuna', 'Atún picante y pepino', 165, 'Rolls'],
    ['Sashimi mix', '12 piezas del día', 220, 'Sashimi'],
    ['Poke bowl salmón', 'Arroz, salmón, edamame y salsa', 185, 'Bowls'],
    ['Ramen tonkotsu', 'Caldo cremoso y chashu', 175, 'Platos calientes'],
    ['Edamame', 'Vaporizado con sal marina', 65, 'Entradas'],
    ['Té verde', '500 ml', 40, 'Bebidas'],
    ['Mochi (3 pzas)', 'Fresa, matcha o vainilla', 85, 'Postres'],
  ],
  [
    ['Hamburguesa clásica', '150 g res, lechuga, tomate y salsa', 125, 'Hamburguesas'],
    ['Hamburguesa BBQ', 'Cebolla caramelizada y bacon', 155, 'Hamburguesas'],
    ['Hamburguesa vegana', 'Beyond patty y aguacate', 145, 'Hamburguesas'],
    ['Papas fritas', 'Porción mediana', 55, 'Acompañamientos'],
    ['Aros de cebolla', '8 piezas crujientes', 65, 'Acompañamientos'],
    ['Malteada vainilla', '350 ml', 75, 'Bebidas'],
    ['Refresco', '355 ml', 35, 'Bebidas'],
    ['Combo clásico', 'Hamburguesa + papas + refresco', 175, 'Combos'],
  ],
  [
    ['Orden tacos pastor (3)', 'Piña, cilantro y cebolla', 75, 'Tacos'],
    ['Orden tacos bistec (3)', 'Con salsa roja', 78, 'Tacos'],
    ['Quesadilla flor de calabaza', 'Grande con queso', 65, 'Antojitos'],
    ['Gringa al pastor', 'Tortilla de harina rellena', 72, 'Antojitos'],
    ['Guacamole', 'Con totopos artesanales', 68, 'Entradas'],
    ['Agua de horchata', '500 ml', 35, 'Bebidas'],
    ['Agua de jamaica', '500 ml', 35, 'Bebidas'],
    ['Flan napolitano', 'Casero', 45, 'Postres'],
  ],
  [
    ['Latte', 'Leche entera o vegetal', 65, 'Café'],
    ['Cappuccino', 'Espresso doble', 70, 'Café'],
    ['Cold brew', 'Hielo y jarabe opcional', 75, 'Café'],
    ['Croissant mantequilla', 'Horneado del día', 55, 'Panadería'],
    ['Bagel salmón', 'Queso crema y eneldo', 125, 'Desayunos'],
    ['Sandwich club', 'Pavo, tocino y aguacate', 115, 'Desayunos'],
    ['Cheesecake frutos rojos', 'Porción', 85, 'Postres'],
    ['Jugo naranja', 'Recién exprimido', 55, 'Bebidas'],
  ],
  [
    ['Spaghetti bolognesa', 'Salsa de carne 8 h', 145, 'Pastas'],
    ['Fettuccine Alfredo', 'Crema, parmesano y pimienta', 135, 'Pastas'],
    ['Lasagna de la casa', 'Capas de carne y bechamel', 155, 'Pastas'],
    ['Risotto de hongos', 'Arborio y parmesano', 165, 'Platos fuertes'],
    ['Ensalada caprese', 'Tomate, mozzarella y albahaca', 95, 'Ensaladas'],
    ['Pan focaccia', 'Aceite de olivo y romero', 55, 'Entradas'],
    ['Tiramisú', 'Clásico italiano', 89, 'Postres'],
    ['Vino tinto copa', 'Casa', 95, 'Bebidas'],
  ],
  [
    ['Pollo rostizado entero', 'Con papas y ensalada', 285, 'Pollos'],
    ['Medio pollo', 'Con tortillas', 165, 'Pollos'],
    ['Pechuga empanizada', 'Con puré', 125, 'Platos fuertes'],
    ['Alitas BBQ (8)', 'Bañadas en salsa', 115, 'Alitas'],
    ['Papas a la francesa', 'Grande', 55, 'Acompañamientos'],
    ['Ensalada coleslaw', 'Cremosa', 45, 'Acompañamientos'],
    ['Limonada', '1 litro', 45, 'Bebidas'],
    ['Flan', 'De la casa', 40, 'Postres'],
  ],
  [
    ['Bowl buddha', 'Quinoa, tofu y verduras', 145, 'Bowls'],
    ['Hamburguesa de garbanzo', 'Pan integral', 125, 'Platos fuertes'],
    ['Wrap falafel', 'Hummus y pepino', 115, 'Wraps'],
    ['Ensalada mediterránea', 'Aceitunas y vinagreta', 105, 'Ensaladas'],
    ['Smoothie verde', 'Espinaca, plátano y mango', 85, 'Bebidas'],
    ['Avena overnight', 'Chía y frutos rojos', 75, 'Desayunos'],
    ['Brownie vegano', 'Sin lácteos', 65, 'Postres'],
    ['Agua de coco', '330 ml', 45, 'Bebidas'],
  ],
];

const USUARIOS_DEMO = [
  {
    nombre: 'María Demo',
    email: 'demo@deligo.com',
    password: 'demo123',
    direccion: 'Av. Reforma 222, Col. Juárez, CDMX',
    lat: 19.4284,
    lng: -99.1677,
  },
  {
    nombre: 'Juan Pérez',
    email: 'estudiante@deligo.com',
    password: 'deligo2026',
    direccion: 'Calle Insurgentes Sur 1458, Del Valle',
    lat: 19.381,
    lng: -99.163,
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
    RESTAURANTES.forEach((r) => insRest.run(r.nombre, r.direccion, r.lat, r.lng));

    const insProd = db.prepare(
      'INSERT INTO productos (restaurante_id, nombre, descripcion, precio, categoria) VALUES (?,?,?,?,?)'
    );
    PRODUCTOS_POR_REST.forEach((items, idx) => {
      const restId = idx + 1;
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
  console.log('   📦 Base de datos cargada:', RESTAURANTES.length, 'restaurantes,',
    RESTAURANTES.length * 8, 'productos aprox.');
}

function asegurarUsuariosDemo(db) {
  const ins = db.prepare(
    'INSERT OR IGNORE INTO usuarios (nombre, email, password, direccion, latitud, longitud) VALUES (?,?,?,?,?,?)'
  );
  USUARIOS_DEMO.forEach((u) => {
    ins.run(u.nombre, u.email, u.password, u.direccion, u.lat, u.lng);
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
  ins.run(demo.id, 1, 'estandar', 'Propina incluida', 189.5, 'entregado');
  ins.run(demo.id, 2, 'express', 'Seguro de envío', 245, 'en_camino');
  ins.run(demo.id, 4, 'estandar', '', 156, 'preparando');
}

module.exports = { SEED_VERSION, aplicarSeed, USUARIOS_DEMO };
