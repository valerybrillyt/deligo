import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './restaurantes.component.html',
  styleUrl: './restaurantes.component.css',
})
export class RestaurantesComponent implements OnInit {
  restaurantes: Array<{ id: number; nombre: string; direccion: string }> = [];
  cargando = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getRestaurantes().subscribe({
      next: (data) => {
        this.restaurantes = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los restaurantes.';
        this.cargando = false;
      },
    });
  }
}
