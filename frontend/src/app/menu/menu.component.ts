import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, ExtraPedido, MenuCategoria, TipoPedido } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  restauranteId = 0;
  restauranteNombre = '';
  menuArbol: MenuCategoria[] = [];
  tiposEntrega: TipoPedido[] = [];
  extrasDisponibles: ExtraPedido[] = [];
  carrito: Array<{ id: number; nombre: string; precio: number; cantidad: number }> = [];
  tipoPedido = 'estandar';
  extrasSeleccionados: string[] = [];
  pedidoExitoso: {
    pedidoId: number;
    total: number;
    tiempoEstimadoMin?: number;
  } | null = null;
  error = '';
  enviando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {}

  get subtotal() {
    return this.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  }

  get tipoActual() {
    return this.tiposEntrega.find((t) => t.tipo === this.tipoPedido);
  }

  get costoEnvio() {
    return this.tipoActual?.envio ?? 3.5;
  }

  get costoExtras() {
    return this.extrasSeleccionados.reduce((s, cod) => {
      const e = this.extrasDisponibles.find((x) => x.codigo === cod);
      return s + (e?.costo ?? 0);
    }, 0);
  }

  get totalEstimado() {
    return this.subtotal + this.costoEnvio + this.costoExtras;
  }

  ngOnInit() {
    this.restauranteId = Number(this.route.snapshot.paramMap.get('id')) || 1;

    this.api.getRestaurantes().subscribe({
      next: (lista) => {
        const r = lista.find((x) => x.id === this.restauranteId);
        if (r) this.restauranteNombre = r.nombre;
      },
    });

    this.api.getMenu(this.restauranteId).subscribe({
      next: (data) => (this.menuArbol = data.menuArbol || []),
      error: () => (this.error = 'No se pudo cargar el menú'),
    });
    this.api.getTiposPedido().subscribe({
      next: (d) => (this.tiposEntrega = d.tipos),
    });
    this.api.getExtras().subscribe({
      next: (d) => (this.extrasDisponibles = d.extras),
    });
  }

  agregar(item: { id: number; nombre: string; precio: number }) {
    const e = this.carrito.find((c) => c.id === item.id);
    if (e) e.cantidad++;
    else this.carrito.push({ ...item, cantidad: 1 });
  }

  mas(id: number) {
    const e = this.carrito.find((c) => c.id === id);
    if (e) e.cantidad++;
  }

  menos(id: number) {
    const e = this.carrito.find((c) => c.id === id);
    if (!e) return;
    if (e.cantidad > 1) e.cantidad--;
    else this.carrito = this.carrito.filter((c) => c.id !== id);
  }

  toggleExtra(codigo: string) {
    const i = this.extrasSeleccionados.indexOf(codigo);
    if (i >= 0) this.extrasSeleccionados.splice(i, 1);
    else this.extrasSeleccionados.push(codigo);
  }

  tieneExtra(codigo: string) {
    return this.extrasSeleccionados.includes(codigo);
  }

  confirmarPedido() {
    if (!this.auth.estaLogueado()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/menu/${this.restauranteId}` } });
      return;
    }
    if (!this.carrito.length) return;

    this.enviando = true;
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.api
      .crearPedido({
        usuarioId,
        restauranteId: this.restauranteId,
        items: this.carrito,
        tipoPedido: this.tipoPedido,
        extras: this.extrasSeleccionados,
        subtotal: this.subtotal,
      })
      .subscribe({
        next: (res) => {
          this.pedidoExitoso = {
            pedidoId: res.pedidoId,
            total: res.total,
            tiempoEstimadoMin: res.tiempoEstimadoMin ?? this.tipoActual?.tiempo,
          };
          localStorage.setItem('ultimoPedidoId', String(res.pedidoId));
          this.carrito = [];
          this.enviando = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al procesar el pedido';
          this.enviando = false;
        },
      });
  }
}
