import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  direccion = '';
  mensaje = '';
  esError = false;

  constructor(private api: ApiService) {}

  registrar() {
    this.api
      .registrarUsuario({
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        direccion: this.direccion,
        latitud: 19.4326,
        longitud: -99.1332,
      })
      .subscribe({
        next: () => {
          this.mensaje = '¡Cuenta DeliGo creada! Ya puedes iniciar sesión.';
          this.esError = false;
        },
        error: (err) => {
          this.mensaje = err.error?.error || 'Error al registrar.';
          this.esError = true;
        },
      });
  }
}
