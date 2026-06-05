import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, MenuCategoria } from '../services/api.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  restauranteId = 0;
  menuArbol: MenuCategoria[] = [];
  carrito: Array<{ id: number; nombre: string; precio: number; cantidad: number }> = [];
  tipoPedido = 'estandar';
  extraPropina = false;
  extraSeguro = false;
  extraEco = false;
  mensaje = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  get subtotal() {
    return this.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  }

  ngOnInit() {
    this.restauranteId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getMenu(this.restauranteId).subscribe({
      next: (data) => (this.menuArbol = data.menuArbol || []),
      error: () => (this.mensaje = 'No se pudo cargar el menú. ¿Backend encendido?'),
    });
  }

  agregar(item: { id: number; nombre: string; precio: number }) {
    const existente = this.carrito.find((c) => c.id === item.id);
    if (existente) existente.cantidad++;
    else this.carrito.push({ ...item, cantidad: 1 });
  }

  confirmarPedido() {
    const extras: string[] = [];
    if (this.extraPropina) extras.push('propina');
    if (this.extraSeguro) extras.push('seguro');
    if (this.extraEco) extras.push('eco');

    const usuarioId = Number(localStorage.getItem('usuarioId') || 1);

    this.api
      .crearPedido({
        usuarioId,
        restauranteId: this.restauranteId,
        items: this.carrito,
        tipoPedido: this.tipoPedido,
        extras,
        subtotal: this.subtotal,
      })
      .subscribe({
        next: (res) => {
          this.mensaje = `Pedido DeliGo #${res.pedidoId} — Total: $${res.total}`;
          localStorage.setItem('ultimoPedidoId', String(res.pedidoId));
        },
        error: (err) => (this.mensaje = err.error?.error || 'Error al crear pedido'),
      });
  }
}
