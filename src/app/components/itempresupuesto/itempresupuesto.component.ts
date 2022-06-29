import { Component, Input, OnInit } from '@angular/core';
import { Detalle, Presupuesto, Servicio, ServicioSolicitado } from 'src/app/models';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
  selector: 'app-itempresupuesto',
  templateUrl: './itempresupuesto.component.html',
  styleUrls: ['./itempresupuesto.component.scss'],
})
export class ItempresupuestoComponent implements OnInit {

  @Input() servicioSolicitado: ServicioSolicitado; // de acá necesito sacar la propiedad 'servicio'
  @Input() botones = true;

  constructor(public presupuestoService: PresupuestoService) { }

  ngOnInit() {}

  removeServicio() {
    this.presupuestoService.removeServicio(this.servicioSolicitado.servicio);
  }

}
