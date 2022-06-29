import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
})
export class VentaComponent implements OnInit, OnDestroy {


  productos: Producto[] = [];
  productosSuscribe: Subscription;
  usuarioSuscribe: Subscription;
  uid = '';
  private path = 'Productos/';


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) {

                this.loadProductos();
                this.getUid();
              }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.productosSuscribe) {
      this.productosSuscribe.unsubscribe();
    }
    if (this.usuarioSuscribe) {
      this.usuarioSuscribe.unsubscribe();
    }
  }

  openMenu() {
    this.menucontroler.toggle('principal');
  }


  loadProductos() {
    this.productosSuscribe = this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
          console.log('Productos en stock: ', res);
          this.productos = res;
    });
  }

  getUid() {
    this.usuarioSuscribe = this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
      }
    });
  }


}
