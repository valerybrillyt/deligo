import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, PatronesDoc } from '../services/api.service';

@Component({
  selector: 'app-patrones',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patrones.component.html',
  styleUrl: './patrones.component.css',
})
export class PatronesComponent implements OnInit {
  doc: PatronesDoc | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPatrones().subscribe({
      next: (d) => (this.doc = d),
      error: () => (this.error = 'Inicia el backend (npm start en /backend)'),
    });
  }
}
