import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Venta, Producto, ProductoVendido, Usuario } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  path = 'carrito/';
  uid = '';
  usuario: Usuario;

  carritoSuscriber: Subscription;
  usuarioSuscriber: Subscription;

  venta$ = new Subject<Venta>();
  private venta: Venta;

  constructor(public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public router: Router) {

              this.initCarrito();
              this.firebaseauthService.stateAuth().subscribe(res => {
                // console.log(res);
                if (res !== null) {
                  this.uid = res.uid;
                  this.loadUsuario();
                }
              });
            }


  loadCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + 'carrito';
    if (this.carritoSuscriber) {
      this.carritoSuscriber.unsubscribe();
    }
    this.carritoSuscriber = this.firestoreService.getDoc<Venta>(path, this.uid).subscribe(res => {
      if (res) {
        this.venta = res;
        this.venta$.next(this.venta);
      } else {
        this.initCarrito();
      }
    });
  }


  initCarrito() {
    this.venta = {
      id: this.uid,
      usuario: this.usuario,
      cliente: null,
      productos: [],
      precioTotal: null,
      fecha: new Date(),
    };
    this.venta$.next(this.venta);
  }


  loadUsuario() {
    const pathUsuario = 'Usuarios';
    this.usuarioSuscriber = this.firestoreService.getDoc<Usuario>(pathUsuario, this.uid).subscribe(res => {
      this.usuario = res;
      this.loadCarrito();
      this.usuarioSuscriber.unsubscribe();
    });
  }


  getCarrito(): Observable<Venta> {
    setTimeout(() => {
        this.venta$.next(this.venta);
    }, 100);
    return this.venta$.asObservable();
  }


  addProducto(producto: Producto) {
    if (this.uid.length) {
       const item = this.venta.productos.find(productoVendido => (productoVendido.producto.id === producto.id));
       if (item !== undefined) {
           item.cantidad ++;
       } else {
          const add: ProductoVendido = {
             cantidad: 1,
             producto,
          };
          this.venta.productos.push(add);
       }
    } else {
         this.router.navigate(['/perfil']);
         return;
    }
    this.venta$.next(this.venta);
    console.log('Se agregó al carrito -> ', this.venta);
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.firestoreService.createDoc(this.venta, path, this.uid).then(() => {
         console.log('GUARDADO EN FIREBASE');
    });
  }


  removeProducto(producto: Producto) {
    if (this.uid.length) {
        let position = 0;
        const item = this.venta.productos.find((productoVendido, index) => {
            position = index;
            return (productoVendido.producto.id === producto.id);
        });
        if (item !== undefined) {
            item.cantidad --;
            if (item.cantidad === 0) {
                 this.venta.productos.splice(position, 1);
            }
            console.log('A remover -> ', this.venta);
            const path = 'Usuarios/' + this.uid + '/' + this.path;
            this.firestoreService.createDoc(this.venta, path, this.uid).then(() => {
                console.log('REMOVIDO DE FIREBASE');
            });
        }
    }
  }



  clearCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + 'carrito';
    this.firestoreService.deleteDoc(path, this.uid).then(() => {
        this.initCarrito();
    });
  }


}
