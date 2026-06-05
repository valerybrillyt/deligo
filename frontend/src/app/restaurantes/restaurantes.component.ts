import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Restaurante } from '../services/api.service';

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './restaurantes.component.html',
  styleUrl: './restaurantes.component.css',
})
export class RestaurantesComponent implements OnInit {
  restaurantes: Restaurante[] = [];
  cargando = true;
  error = '';

  constructor(private api: ApiService) {}

  icono(nombre: string) {
    const n = nombre.toLowerCase();
    if (n.includes('pizza')) return '🍕';
    if (n.includes('sushi')) return '🍣';
    if (n.includes('burger') || n.includes('hambur')) return '🍔';
    if (n.includes('taco')) return '🌮';
    if (n.includes('café') || n.includes('cafe')) return '☕';
    if (n.includes('pasta') || n.includes('italian')) return '🍝';
    if (n.includes('pollo')) return '🍗';
    if (n.includes('vegan')) return '🥗';
    return '🍽️';
  }

  tiempo(id: number) {
    return 25 + (id % 3) * 8;
  }

  ngOnInit() {
    this.api.getRestaurantes().subscribe({
      next: (data) => {
        this.restaurantes = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No pudimos cargar los restaurantes. Verifica que el servidor esté activo.';
        this.cargando = false;
      },
    });
  }
}
