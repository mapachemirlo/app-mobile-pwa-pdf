import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Detalle, Presupuesto, Servicio, ServicioSolicitado } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mis-presupuestos',
  templateUrl: './mis-presupuestos.component.html',
  styleUrls: ['./mis-presupuestos.component.scss'],
})
export class MisPresupuestosComponent implements OnInit, OnDestroy {

  presupuestos: Presupuesto[] = [];
  servicios: Detalle[] = [];

  uid = '';
  presupuestosSuscriber: Subscription;


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) {

                this.firebaseauthService.stateAuth().subscribe(res => {
                  if (res !== null) {
                    this.uid = res.uid;
                    this.getPresupuestos();
                  }
                });
              }

  ngOnInit() {
  }



  ngOnDestroy() {
    if (this.presupuestosSuscriber) {
      this.presupuestosSuscriber.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  getPresupuestos() {
    const path = 'Usuarios/' + this.uid + '/presupuestos/';
    this.presupuestosSuscriber = this.firestoreService.getCollectionOrder<Presupuesto>(path).subscribe(res => {
      this.presupuestos = res;
      // this.getDetalleServicios();
    });
  }


}

  // ---- FUNCIONES PARA SACAR LOS SERVICIOS POR SEPARADO, A REVISAR ---- //

  // servicioSolicitado: ServicioSolicitado[] = [];
  // servicioUnidad: Servicio[] = [];

  // getDetalleServicios() {
  //   this.presupuestos.forEach(serv => {
  //     this.servicios = serv.servicios;
  //     console.log('Tengo solo los servicios: ', this.servicios);
  //     // this.getServicio();
  //   });
  // }

  // getServicio() {
  //   this.servicios.forEach(item => {
  //     // console.log('Unicamente servicios: ', item.servicios);
  //     this.servicioSolicitado = item.servicios;
  //     // console.log(this.servicioSolicitado);
  //     this.getUnidad();
  //   });
  // }

  // getUnidad() {
  //   this.servicioSolicitado.forEach(nombre => {
  //     console.log('Nombre: ', nombre.servicio);
  //   });
  // }
