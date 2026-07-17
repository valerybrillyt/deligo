import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantesComponent } from './restaurantes/restaurantes.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { PatronesComponent } from './patrones/patrones.component';
import { AdminLogsComponent } from './admin-logs/admin-logs.component';
import { RepartidorComponent } from './repartidor/repartidor.component';
import { RestaurantePanelComponent } from './restaurante-panel/restaurante-panel.component';
import { RolesGuiaComponent } from './roles-guia/roles-guia.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { clienteGuard, roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patrones', component: PatronesComponent },
  { path: 'roles', component: RolesGuiaComponent },
  { path: 'restaurantes', component: RestaurantesComponent, canActivate: [authGuard, clienteGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'menu/:id', component: MenuComponent, canActivate: [authGuard, clienteGuard] },
  { path: 'seguimiento', component: SeguimientoComponent, canActivate: [authGuard, clienteGuard] },
  { path: 'admin/logs', component: AdminLogsComponent, canActivate: [authGuard, roleGuard('admin')] },
  { path: 'repartidor', component: RepartidorComponent, canActivate: [authGuard, roleGuard('repartidor')] },
  { path: 'restaurante', component: RestaurantePanelComponent, canActivate: [authGuard, roleGuard('restaurante')] },
  { path: '**', redirectTo: '' },
];
