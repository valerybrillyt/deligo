import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  mensaje = '';
  esError = false;

  constructor(private api: ApiService, private router: Router) {}

  iniciarSesion() {
    this.api.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('deligo_token', res.token);
        localStorage.setItem('usuarioId', String(res.usuario.id));
        this.mensaje = `Bienvenido, ${res.usuario.nombre}`;
        this.esError = false;
        setTimeout(() => this.router.navigate(['/restaurantes']), 800);
      },
      error: () => {
        this.mensaje = 'Email o contraseña incorrectos.';
        this.esError = true;
      },
    });
  }
}
