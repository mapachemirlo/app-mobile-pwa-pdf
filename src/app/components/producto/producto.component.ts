import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit, OnDestroy {

  @Input() producto: Producto;

  uid = '';
  uidSuscribe: Subscription;

  constructor(public carritoService: CarritoService,
              public toastController: ToastController,
              public firebaseauthService: FirebaseauthService) {

                this.getUid();

              }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.uidSuscribe) {
      this.uidSuscribe.unsubscribe();
    }
  }


  getUid() {
    this.uidSuscribe = this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
      }
    });
  }



  addCarrito() {
    this.carritoService.addProducto(this.producto);
    this.presentToastSuccess('Agregado al listado de venta');
  }


  // ---------------------------------- EXPERIENCIA DEL USUARIO -------------------------------------- //

  async presentToastSuccess(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      // cssClass: 'lala',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }


}
