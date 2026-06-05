import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantesComponent } from './restaurantes/restaurantes.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { PatronesComponent } from './patrones/patrones.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patrones', component: PatronesComponent },
  { path: 'restaurantes', component: RestaurantesComponent, canActivate: [authGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'menu/:id', component: MenuComponent, canActivate: [authGuard] },
  { path: 'seguimiento', component: SeguimientoComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
