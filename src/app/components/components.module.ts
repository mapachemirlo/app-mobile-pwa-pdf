import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioComponent } from './servicio/servicio.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItempresupuestoComponent } from './itempresupuesto/itempresupuesto.component';
import { ProductoComponent } from './producto/producto.component';
import { ItemcarritoComponent } from './itemcarrito/itemcarrito.component';



@NgModule({
  declarations: [
    ServicioComponent,
    ItempresupuestoComponent,
    ProductoComponent,
    ItemcarritoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ], exports: [
    ServicioComponent,
    ItempresupuestoComponent,
    ProductoComponent,
    ItemcarritoComponent,
  ]
})
export class ComponentsModule { }
