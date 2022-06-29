import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Servicio } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-presupuesto',
  templateUrl: './set-presupuesto.component.html',
  styleUrls: ['./set-presupuesto.component.scss'],
})
export class SetPresupuestoComponent implements OnInit, OnDestroy {

  servicios: Servicio[] = [];
  serviciosSuscribe: Subscription;
  private path = 'Servicios/';

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService) {

                this.loadServicios();
              }

  ngOnInit() {}


  ngOnDestroy() {
    if (this.serviciosSuscribe) {
      this.serviciosSuscribe.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  loadServicios(){
    this.serviciosSuscribe = this.firestoreService.getCollection<Servicio>(this.path).subscribe(res => {
      this.servicios = res;
    });
  }


}
