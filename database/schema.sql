CREATE DATABASE IF NOT EXISTS delivery_db CHARACTER SET utf8mb4;
USE delivery_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) DEFAULT '',
  latitud DECIMAL(10, 7) DEFAULT 0,
  longitud DECIMAL(10, 7) DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  direccion VARCHAR(255),
  latitud DECIMAL(10, 7) NOT NULL,
  longitud DECIMAL(10, 7) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurante_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(80) DEFAULT 'General',
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  restaurante_id INT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'estandar',
  descripcion_extra VARCHAR(500),
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente','preparando','en_camino','entregado') DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);

-- Auditoría: qué hizo cada usuario (por si falla la app o hay que reconstruir el flujo)
CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  accion VARCHAR(80) NOT NULL,
  detalle TEXT,
  ruta VARCHAR(255) DEFAULT '',
  ip VARCHAR(45) DEFAULT '',
  exito TINYINT DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO restaurantes (nombre, direccion, latitud, longitud) VALUES
('Pizza Express', 'Av. Central 100', 19.4326000, -99.1332000),
('Sushi House', 'Calle Mar 45', 19.4350000, -99.1400000),
('Burger Zone', 'Plaza Norte 12', 19.4280000, -99.1250000);

INSERT INTO productos (restaurante_id, nombre, descripcion, precio, categoria) VALUES
(1, 'Pizza Margarita', 'Clásica', 8.99, 'Pizzas'),
(1, 'Pizza Pepperoni', 'Extra pepperoni', 10.99, 'Pizzas'),
(1, 'Refresco', '600ml', 1.50, 'Bebidas'),
(2, 'Roll California', '8 piezas', 7.50, 'Rolls'),
(2, 'Sashimi mix', '12 piezas', 12.00, 'Sashimi'),
(3, 'Hamburguesa clásica', '150g', 6.50, 'Hamburguesas'),
(3, 'Papas fritas', 'Mediana', 2.99, 'Acompañamientos');
