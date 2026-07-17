import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, LogEntrada } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-logs.component.html',
  styleUrl: './admin-logs.component.css',
})
export class AdminLogsComponent implements OnInit {
  logs: LogEntrada[] = [];
  error = '';
  cargando = true;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getLogs().subscribe({
      next: (rows) => {
        this.logs = rows;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudieron cargar los logs';
        this.cargando = false;
      },
    });
  }

  exitoLabel(exito: number) {
    return exito ? 'OK' : 'Error';
  }
}
