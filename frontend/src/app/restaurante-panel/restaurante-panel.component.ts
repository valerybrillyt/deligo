import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, PedidoResumen } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-restaurante-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './restaurante-panel.component.html',
  styleUrl: './restaurante-panel.component.css',
})
export class RestaurantePanelComponent implements OnInit {
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
        this.error = err.error?.error || 'Error al cargar pedidos';
        this.cargando = false;
      },
    });
  }

  preparar(pedidoId: number) {
    this.actualizando = pedidoId;
    this.api.actualizarEstado(pedidoId, 'preparando').subscribe({
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
}
