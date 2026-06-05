import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, SeguimientoPedido } from '../services/api.service';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css',
})
export class SeguimientoComponent implements OnInit {
  pedidoId = 1;
  seguimiento: SeguimientoPedido | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    const guardado = localStorage.getItem('ultimoPedidoId');
    if (guardado) this.pedidoId = Number(guardado);
    this.cargarSeguimiento();
  }

  cargarSeguimiento() {
    this.error = '';
    this.api.getSeguimiento(this.pedidoId).subscribe({
      next: (data) => (this.seguimiento = data),
      error: () => {
        this.seguimiento = null;
        this.error = 'No se encontró el pedido o el backend no responde.';
      },
    });
  }
}
