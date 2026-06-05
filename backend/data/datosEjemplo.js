/** Datos de ejemplo cuando MySQL no está disponible (modo demo) */
module.exports = {
  restaurantes: [
    { id: 1, nombre: 'Pizza Express', direccion: 'Av. Central 100', latitud: 19.4326, longitud: -99.1332 },
    { id: 2, nombre: 'Sushi House', direccion: 'Calle Mar 45', latitud: 19.435, longitud: -99.14 },
    { id: 3, nombre: 'Burger Zone', direccion: 'Plaza Norte 12', latitud: 19.428, longitud: -99.125 },
  ],
  productos: [
    { id: 1, restaurante_id: 1, nombre: 'Pizza Margarita', precio: 8.99, categoria: 'Pizzas' },
    { id: 2, restaurante_id: 1, nombre: 'Pizza Pepperoni', precio: 10.99, categoria: 'Pizzas' },
    { id: 3, restaurante_id: 1, nombre: 'Refresco', precio: 1.5, categoria: 'Bebidas' },
    { id: 4, restaurante_id: 2, nombre: 'Roll California', precio: 7.5, categoria: 'Rolls' },
    { id: 5, restaurante_id: 2, nombre: 'Sashimi mix', precio: 12, categoria: 'Sashimi' },
    { id: 6, restaurante_id: 3, nombre: 'Hamburguesa clásica', precio: 6.5, categoria: 'Hamburguesas' },
    { id: 7, restaurante_id: 3, nombre: 'Papas fritas', precio: 2.99, categoria: 'Acompañamientos' },
  ],
  usuarios: [],
  pedidos: [],
  nextUsuarioId: 1,
  nextPedidoId: 1,
};
