import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Venta } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit, OnDestroy {

  uid = '';
  ventas: Venta[] = [];
  ventasAllSuscriber: Subscription;

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) {

                this.firebaseauthService.stateAuth().subscribe(res => {
                  if (res !== null) {
                    this.uid = res.uid;
                  }
                });
               }

  ngOnInit() {
    this.getVentasAll();
  }

  ngOnDestroy() {
    if (this.ventasAllSuscriber) {
      this.ventasAllSuscriber.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  getVentasAll() {
    const path = 'ventas';
    this.ventasAllSuscriber = this.firestoreService.getCollectionAllbyOrder<Venta>(path).subscribe(res => {
      this.ventas = res;
      console.log('Todas las ventas en orden: ', this.ventas);
    });

  }


}
