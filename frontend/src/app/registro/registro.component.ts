import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: '../login/auth.styles.css',
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  direccion = '';
  error = '';
  exito = false;
  cargando = false;

  constructor(private api: ApiService, private router: Router) {}

  registrar() {
    this.cargando = true;
    this.error = '';
    this.api
      .registrarUsuario({
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        direccion: this.direccion,
      })
      .subscribe({
        next: () => {
          this.exito = true;
          this.cargando = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = err.error?.error || 'No se pudo crear la cuenta. ¿El email ya existe?';
          this.cargando = false;
        },
      });
  }
}
