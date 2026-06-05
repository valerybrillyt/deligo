class ProductoHoja {
  constructor(p) { this.producto = p; }
  mostrar() {
    return [{ tipo: 'producto', id: this.producto.id, nombre: this.producto.nombre, precio: this.producto.precio }];
  }
}

class CategoriaComposite {
  constructor(nombre) {
    this.nombre = nombre;
    this.tipo = 'categoria';
    this.hijos = [];
  }
  agregar(c) { this.hijos.push(c); }
  mostrar() {
    return [{ tipo: 'categoria', nombre: this.nombre, items: this.hijos.flatMap((h) => h.mostrar()) }];
  }
}

function construirMenuDesdeProductos(productos) {
  const raiz = new CategoriaComposite('Menú DeliGo');
  const cats = {};
  for (const p of productos) {
    const c = p.categoria || 'General';
    if (!cats[c]) { cats[c] = new CategoriaComposite(c); raiz.agregar(cats[c]); }
    cats[c].agregar(new ProductoHoja(p));
  }
  return raiz.mostrar();
}

module.exports = { construirMenuDesdeProductos };
