import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente, Venta } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit, OnDestroy {

  venta: Venta;
  carritoSuscribe: Subscription;
  clientesSuscribe: Subscription;
  usuarioSuscribe: Subscription;
  total: number;
  cantidad: number;

  clientes: Cliente[] = [];
  newCliente: Cliente[] = [];
  cliente = '';
  uid = '';
  private pathCliente = 'Clientes/';


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public carritoService: CarritoService,
              public firebaseauthService: FirebaseauthService,
              public toastController: ToastController,
              public router: Router) {

                this.initCarrito();
                this.loadVenta();
                this.getUid();
              }

  ngOnInit() {
    this.getClientes();
  }


  ngOnDestroy() {
    console.log('ngOnDestroy() - carrito componente');
    if (this.carritoSuscribe) {
       this.carritoSuscribe.unsubscribe();
    }
    if (this.clientesSuscribe) {
      this.clientesSuscribe.unsubscribe();
    }
    if (this.usuarioSuscribe) {
      this.usuarioSuscribe.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  getClientes() {
    this.clientesSuscribe = this.firestoreService.getCollection<Cliente>(this.pathCliente).subscribe(res => {
      this.clientes = res;
    });
  }



  selectCliente(event: any) {
    const cliente = event.detail.value as Cliente;
    if (this.newCliente.length) {
      this.newCliente.pop();
      this.newCliente.push(cliente);
      this.venta.cliente = this.newCliente;
    } else {
      this.newCliente.push(cliente);
      this.venta.cliente = this.newCliente;
    }
  }



  loadVenta() {
    this.carritoSuscribe = this.carritoService.getCarrito().subscribe(res => {
      // console.log('Productos a vender: ', res);
      this.venta = res;
      this.getTotal();
      this.getCantidad();
    });
  }


  initCarrito() {
    this.venta = {
      id: '',
      usuario: null,
      cliente: null,
      productos: [],
      precioTotal: null,
      fecha: new Date(),
    };
  }


  getTotal() {
    this.total = 0;
    this.venta.productos.forEach(producto => {
      this.total = (producto.producto.precio) * producto.cantidad + this.total;
    });
  }


  getCantidad() {
    this.cantidad = 0;
    this.venta.productos.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });
  }


  async vender() {
    if (!this.venta.productos.length) {
      console.log('AÑADE PRODUCTOS AL CARRITO');
      this.presentToastError('Error, agregue productos para vender');
      return;
    }
    this.venta.fecha = new Date();
    this.venta.precioTotal = this.total;
    this.venta.id = this.firestoreService.getId();
    const uid = await this.firebaseauthService.getUid();
    const path = 'Usuarios/' + uid + '/ventas';
    console.log('Venta a realizar: ', this.venta);
    this.firestoreService.createDoc(this.venta, path, this.venta.id).then(() => {
      console.log('VENTA GUARDADA EN FIREBASE!');
      this.presentToastSuccess('Venta exitosa');
      this.carritoService.clearCarrito();
      this.initCarrito();
      this.router.navigate(['/venta']);
    });
  }


  getUid() {
    this.usuarioSuscribe = this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
      }
    });
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

  async presentToastError(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      // cssClass: 'lala',
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }



}