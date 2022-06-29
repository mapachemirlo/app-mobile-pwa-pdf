import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { VentaComponent } from './venta/venta.component';
import { SetPresupuestoComponent } from './set-presupuesto/set-presupuesto.component';
import { ComponentsModule } from '../components/components.module';
import { CarritoComponent } from './carrito/carrito.component';
import { MisVentasComponent } from './mis-ventas/mis-ventas.component';
import { MisPresupuestosComponent } from './mis-presupuestos/mis-presupuestos.component';
import { VentasComponent } from './ventas/ventas.component';
import { PresupuestosComponent } from './presupuestos/presupuestos.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    PresupuestoComponent,
    SetPresupuestoComponent,
    VentaComponent,
    CarritoComponent,
    MisVentasComponent,
    MisPresupuestosComponent,
    PresupuestosComponent,
    VentasComponent,
    ResetPassComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ComponentsModule
  ]
})
export class PagesModule { }
