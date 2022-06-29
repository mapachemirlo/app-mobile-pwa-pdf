import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Venta } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mis-ventas',
  templateUrl: './mis-ventas.component.html',
  styleUrls: ['./mis-ventas.component.scss'],
})
export class MisVentasComponent implements OnInit, OnDestroy {

  ventas: Venta[] = [];
  uid = '';
  ventasSuscriber: Subscription;


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) {

                this.firebaseauthService.stateAuth().subscribe(res => {
                  if (res !== null) {
                    this.uid = res.uid;
                    this.getVentas();
                  }
                });
               }


  ngOnInit() {}


  ngOnDestroy() {
    if (this.ventasSuscriber) {
      this.ventasSuscriber.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  getVentas() {
    const path = 'Usuarios/' + this.uid + '/ventas/';
    this.ventasSuscriber = this.firestoreService.getCollectionOrder<Venta>(path).subscribe(res => {
      this.ventas = res;
      console.log(this.ventas);
    });
  }

}
