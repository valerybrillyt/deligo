import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, RolDetalle } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-roles-guia',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roles-guia.component.html',
  styleUrl: './roles-guia.component.css',
})
export class RolesGuiaComponent implements OnInit {
  roles: RolDetalle[] = [];
  error = '';
  cargando = true;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getRoles().subscribe({
      next: (res) => {
        this.roles = res.roles;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Inicia el backend (npm start en /backend)';
        this.cargando = false;
      },
    });
  }

  claseRol(codigo: string) {
    return `card-${codigo}`;
  }

  esRolActual(codigo: string) {
    return this.auth.estaLogueado() && this.auth.getRol() === codigo;
  }
}
