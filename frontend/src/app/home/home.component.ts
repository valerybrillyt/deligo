import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Restaurante } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  destacados: Restaurante[] = [];

  constructor(
    public auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit() {
    if (!this.auth.estaLogueado()) return;
    this.api.getRestaurantes().subscribe({
      next: (data) => (this.destacados = data.slice(0, 6)),
    });
  }

  icono(nombre: string) {
    const n = nombre.toLowerCase();
    if (n.includes('pizza')) return '🍕';
    if (n.includes('sushi')) return '🍣';
    if (n.includes('burger') || n.includes('hambur')) return '🍔';
    if (n.includes('taco')) return '🌮';
    if (n.includes('café') || n.includes('cafe')) return '☕';
    if (n.includes('pasta')) return '🍝';
    if (n.includes('pollo')) return '🍗';
    if (n.includes('vegan')) return '🥗';
    return '🍽️';
  }
}
