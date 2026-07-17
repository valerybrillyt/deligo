import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, PedidoResumen } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-repartidor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './repartidor.component.html',
  styleUrl: './repartidor.component.css',
})
export class RepartidorComponent implements OnInit {
  pedidos: PedidoResumen[] = [];
  error = '';
  cargando = true;
  actualizando = 0;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.api.getPedidos().subscribe({
      next: (rows) => {
        this.pedidos = rows;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al cargar entregas';
        this.cargando = false;
      },
    });
  }

  marcarEstado(pedidoId: number, estado: string) {
    this.actualizando = pedidoId;
    this.api.actualizarEstado(pedidoId, estado).subscribe({
      next: () => {
        this.actualizando = 0;
        this.cargar();
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudo actualizar';
        this.actualizando = 0;
      },
    });
  }

  estadoLabel(estado: string) {
    const map: Record<string, string> = {
      pendiente: 'Pendiente',
      preparando: 'Listo en local',
      en_camino: 'En camino',
      entregado: 'Entregado',
    };
    return map[estado] || estado;
  }
}
