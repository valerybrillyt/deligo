import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantesComponent } from './restaurantes/restaurantes.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { PatronesComponent } from './patrones/patrones.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patrones', component: PatronesComponent },
  { path: 'restaurantes', component: RestaurantesComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu/:id', component: MenuComponent },
  { path: 'seguimiento', component: SeguimientoComponent },
  { path: '**', redirectTo: '' },
];
