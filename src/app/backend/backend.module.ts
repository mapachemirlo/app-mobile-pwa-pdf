import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetServiciosComponent } from './set-servicios/set-servicios.component';
import { SetProveedoresComponent } from './set-proveedores/set-proveedores.component';
import { SetProductosComponent } from './set-productos/set-productos.component';
import { SetFichasTecComponent } from './set-fichas-tec/set-fichas-tec.component';
import { SetClientesComponent } from './set-clientes/set-clientes.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SetUsuariosComponent } from './set-usuarios/set-usuarios.component';



@NgModule({
  declarations: [
    SetServiciosComponent,
    SetProveedoresComponent,
    SetProductosComponent,
    SetFichasTecComponent,
    SetClientesComponent,
    SetUsuariosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class BackendModule { }
