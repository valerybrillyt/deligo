import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

const EMAIL_RECORDADO = 'deligo_email_recordado';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './auth.styles.css',
})
export class LoginComponent {
  email = '';
  password = '';
  showPass = false;
  recordar = false;
  error = '';
  cargando = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const guardado = localStorage.getItem(EMAIL_RECORDADO);
    if (guardado) {
      this.email = guardado;
      this.recordar = true;
    }
  }

  usarDemo() {
    this.email = 'demo@deligo.com';
    this.password = 'demo123';
    this.error = '';
  }

  iniciarSesion() {
    this.cargando = true;
    this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: (res) => {
        if (this.recordar) {
          localStorage.setItem(EMAIL_RECORDADO, this.email);
        } else {
          localStorage.removeItem(EMAIL_RECORDADO);
        }
        this.auth.setSesion(res.usuario.id, res.usuario.nombre, res.token);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/restaurantes';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.error = 'Correo o contraseña incorrectos';
        this.cargando = false;
      },
    });
  }
}
