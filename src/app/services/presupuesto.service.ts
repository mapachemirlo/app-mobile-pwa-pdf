import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Servicio, Detalle, ServicioSolicitado, Usuario } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  path = 'detallePresupuesto/';
  uid = '';
  usuario: Usuario;

  servicioSuscriber: Subscription;
  usuarioSuscriber: Subscription;

  detalle$ = new Subject<Detalle>();
  private detalle: Detalle;


  constructor(public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public router: Router) {

                this.initServiciosDetalle();
                this.firebaseauthService.stateAuth().subscribe(res => {
                  // console.log(res);
                  if (res !== null) {
                    this.uid = res.uid;
                    this.loadUsuario();
                    this.loadDetalleServicio();
                    this.getDetalleServicio();
                  }
                });
              }

  loadDetalleServicio() {
    const path = 'Usuarios/' + this.uid + '/' + 'detallePresupuesto';
    if (this.servicioSuscriber) {
      this.servicioSuscriber.unsubscribe();
    }
    this.servicioSuscriber = this.firestoreService.getDoc<Detalle>(path, this.uid).subscribe(res => {
      console.log('loadDetalleServicio ->',res);
      if (res) {
        this.detalle = res;
        this.detalle$.next(this.detalle);
      } else {
        this.initServiciosDetalle();
      }
    });
  }

  initServiciosDetalle() {
    this.detalle = {
      id: this.uid,
      usuario: this.uid,
      servicios: []
    };
    this.detalle$.next(this.detalle);
  }


  loadUsuario() {
    const pathUsuario = 'Usuarios';
    this.usuarioSuscriber = this.firestoreService.getDoc<Usuario>(pathUsuario, this.uid).subscribe(res => {
      this.usuario = res;
      //console.log('El usuario es: ', this.usuario);
    });
  }


  getDetalleServicio(): Observable<Detalle> {
    setTimeout(() => {
      this.detalle$.next(this.detalle);
    }, 100);
    return this.detalle$.asObservable();
  }


  addServicio(servicioAdd: Servicio) {
    if (this.uid.length) {
      const item = this.detalle.servicios.find(servicioSolicitado => (servicioSolicitado.servicio.id === servicioAdd.id));
      if (item !== undefined) {
        item.cantidad ++;
      } else {
        const add: ServicioSolicitado = {
          cantidad: 1,
          servicio: servicioAdd,
        };
        this.detalle.servicios.push(add);
      }
    } else {
      this.router.navigate(['/perfil']);
      return;
    }
    this.detalle$.next(this.detalle);
    console.log('Se agregó al presupuesto ->', this.detalle);
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.firestoreService.createDoc(this.detalle, path, this.uid).then(() => {
      console.log('GUARDADO EN FIREBASE!');
    });
  }


  removeServicio(servicioDel: Servicio) {
    if (this.uid.length) {
      let position = 0;
      const item = this.detalle.servicios.find((servicioSolicitado, index) => {
        position = index;
        return (servicioSolicitado.servicio.id === servicioDel.id);
      });
      if (item !== undefined) {
        item.cantidad --;
        if (item.cantidad === 0) {
          this.detalle.servicios.splice(position, 1);
        }
        console.log('A remover -> ', this.detalle);
        const path = 'Usuarios/' + this.uid + '/' + this.path;
        this.firestoreService.createDoc(this.detalle, path, this.uid).then(() => {
          console.log('REMOVIDO DE FIREBASE');
        });
      }
    }
  }

  clearDetalles() {
    const path = 'Usuarios/' + this.uid + '/' + 'detallePresupuesto';
    this.firestoreService.deleteDoc(path, this.uid).then(() => {
      this.initServiciosDetalle();
    });
  }


}
