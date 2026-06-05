import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, PedidoResumen, SeguimientoPedido } from '../services/api.service';
import { AuthService } from '../services/auth.service';

const ETIQUETAS: Record<string, string> = {
  pendiente: 'Pedido recibido',
  preparando: 'Preparando tu comida',
  en_camino: 'Repartidor en camino',
  entregado: 'Entregado',
};

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css',
})
export class SeguimientoComponent implements OnInit, OnDestroy {
  pedidoId = 0;
  seguimiento: SeguimientoPedido | null = null;
  misPedidos: PedidoResumen[] = [];
  error = '';
  private intervalo?: ReturnType<typeof setInterval>;
  private ticks = 0;

  constructor(private api: ApiService, public auth: AuthService) {}

  estadoLabel(estado: string) {
    return ETIQUETAS[estado] || estado;
  }

  ngOnInit() {
    const guardado = localStorage.getItem('ultimoPedidoId');
    if (guardado) this.pedidoId = Number(guardado);

    this.cargarLista();
    if (this.pedidoId) this.cargarSeguimiento();

    this.intervalo = setInterval(() => {
      if (!this.pedidoId || this.seguimiento?.estado === 'entregado') return;
      this.ticks++;
      if (this.ticks % 2 === 0) this.avanzarEstadoAutomatico();
      else this.cargarSeguimiento(true);
    }, 8000);
  }

  ngOnDestroy() {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  cargarLista() {
    const uid = localStorage.getItem('usuarioId');
    if (!uid) return;
    this.api.getPedidos(Number(uid)).subscribe({
      next: (p) => {
        this.misPedidos = p;
        if (p.length && !this.pedidoId) {
          this.pedidoId = p[0].id;
          this.cargarSeguimiento();
        }
      },
    });
  }

  cargarSeguimiento(silencioso = false) {
    if (!this.pedidoId) return;
    if (!silencioso) this.error = '';
    this.api.getSeguimiento(this.pedidoId).subscribe({
      next: (data) => (this.seguimiento = data),
      error: () => {
        if (!silencioso) this.error = 'No encontramos ese pedido';
        this.seguimiento = null;
      },
    });
  }

  seleccionarPedido(id: number) {
    this.pedidoId = id;
    this.ticks = 0;
    localStorage.setItem('ultimoPedidoId', String(id));
    this.cargarSeguimiento();
  }

  private avanzarEstadoAutomatico() {
    const orden = ['pendiente', 'preparando', 'en_camino', 'entregado'];
    const actual = this.seguimiento?.estado;
    const i = orden.indexOf(actual || 'pendiente');
    if (i < 0 || i >= 3) return;
    this.api.actualizarEstado(this.pedidoId, orden[i + 1]).subscribe({
      next: () => this.cargarSeguimiento(true),
    });
  }
}
