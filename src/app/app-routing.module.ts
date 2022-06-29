import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetClientesComponent } from './backend/set-clientes/set-clientes.component';
import { SetFichasTecComponent } from './backend/set-fichas-tec/set-fichas-tec.component';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { SetProveedoresComponent } from './backend/set-proveedores/set-proveedores.component';
import { SetServiciosComponent } from './backend/set-servicios/set-servicios.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { HomeComponent } from './pages/home/home.component';
import { MisPresupuestosComponent } from './pages/mis-presupuestos/mis-presupuestos.component';
import { MisVentasComponent } from './pages/mis-ventas/mis-ventas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PresupuestoComponent } from './pages/presupuesto/presupuesto.component';
import { PresupuestosComponent } from './pages/presupuestos/presupuestos.component';
import { SetPresupuestoComponent } from './pages/set-presupuesto/set-presupuesto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { VentasComponent } from './pages/ventas/ventas.component';

import { map } from 'rxjs/operators';
import { canActivate } from '@angular/fire/auth-guard';
import { SetUsuariosComponent } from './backend/set-usuarios/set-usuarios.component';
import { ResetPassComponent } from './pages/reset-pass/reset-pass.component';

const isAdmin = (next: any) => map( (user: any) => !!user && 'k8VgmQu09zdoSMrEfy51nj18fJp1' === user.uid);

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'set-clientes', component: SetClientesComponent },
  { path: 'set-usuarios', component: SetUsuariosComponent, ...canActivate(isAdmin) },
  { path: 'set-fichas', component: SetFichasTecComponent },
  { path: 'set-productos', component: SetProductosComponent, ...canActivate(isAdmin) },
  { path: 'set-proveedores', component: SetProveedoresComponent, ...canActivate(isAdmin) },
  { path: 'set-servicios' , component: SetServiciosComponent, ...canActivate(isAdmin) },
  { path: 'perfil', component: PerfilComponent },
  { path: 'reset-pass', component: ResetPassComponent },
  { path: 'set-presupuesto', component: SetPresupuestoComponent },
  { path: 'presupuesto', component: PresupuestoComponent },
  { path: 'venta', component: VentaComponent},
  { path: 'carrito', component: CarritoComponent },
  { path: 'mis-ventas', component: MisVentasComponent },
  { path: 'mis-presupuestos', component: MisPresupuestosComponent },
  { path: 'ventas', component: VentasComponent, ...canActivate(isAdmin) },
  { path: 'presupuestos', component: PresupuestosComponent, ...canActivate(isAdmin) },
  { path: '', component: HomeComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
