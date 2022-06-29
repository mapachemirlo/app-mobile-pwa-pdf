/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente, EstadoPresupuesto, FichaTecnica, Presupuesto } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss'],
})
export class PresupuestosComponent implements OnInit, OnDestroy {


  abiertosSuscriber: Subscription;
  cerradosSuscriber: Subscription;
  pdfsSuscribe: Subscription;

  presupuestosAbiertos: Presupuesto[] = [];
  presupuestosCerrados: Presupuesto[] = [];
  documentosPDF = [];
  pdfLista = [];

  enableViewPDF = false;
  enableViewALL = true;
  mostrar = true;

  estados: EstadoPresupuesto[] = ['abierto', 'cerrado'];


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService,
              public toastController: ToastController,
              public nodeService: NodeService) { }

  ngOnInit() {
    this.getPresupuestosAbiertos();
  }

  ngOnDestroy() {
    if (this.abiertosSuscriber) {
      this.abiertosSuscriber.unsubscribe();
    }
    if (this.cerradosSuscriber) {
      this.cerradosSuscriber.unsubscribe();
    }
    if (this.pdfsSuscribe) {
      this.pdfsSuscribe.unsubscribe();
    }
  }



  openMenu() {
    this.menucontroler.toggle('principal');
  }



  changeSegment(ev: any) {
    const opc = ev.detail.value;
    if (opc === 'cerrados') {
      this.mostrar = false;
      this.getPresupuestosCerrados();
    }
    if (opc === 'abiertos') {
      this.mostrar = true;
      this.getPresupuestosAbiertos();
    }
  }



  getPresupuestosAbiertos() {
    const path = 'presupuestos';
    let startAt = null;
    if (this.presupuestosAbiertos.length) {
      startAt = this.presupuestosAbiertos[this.presupuestosAbiertos.length - 1].fecha;
    }
    this.abiertosSuscriber = this.firestoreService.getCollectionAll<Presupuesto>(path, 'estado', '==', 'abierto', startAt).subscribe(res => {
      if (res.length) {
        this.presupuestosAbiertos = res;
        res.forEach(abierto => {
          const item = this.presupuestosAbiertos.find( pre => (pre.id === abierto.id));
          if (item === undefined){
            this.presupuestosAbiertos.push(abierto);
          } else {
          }
        });
      //   res.forEach(abierto => {
      //     console.log(abierto);
      //     // this.presupuestosAbiertos.push(abierto);
      //   });
      //   // console.log('Presupuestos ABIERTOS (mostrará de a 3): ', this.presupuestosAbiertos);
      }
    });
  }


  getPresupuestosCerrados() {
    const path = 'presupuestos';
    let startAt = null;
    if (this.presupuestosCerrados.length) {
      startAt = this.presupuestosCerrados[this.presupuestosCerrados.length - 1].fecha;
    }
    this.cerradosSuscriber = this.firestoreService.getCollectionAll<Presupuesto>(path, 'estado', '==', 'cerrado', startAt).subscribe(res => {
      if (res.length) {
        this.presupuestosCerrados = res;
        res.forEach(cerrado => {
          const item = this.presupuestosCerrados.find( pre => (pre.id === cerrado.id));
          if (item === undefined){
            this.presupuestosCerrados.push(cerrado);
          } else {
          }
        });
        // res.forEach(cerrado => {
        //   this.presupuestosCerrados.push(cerrado);
        // });
        // console.log('Presupuestos CERRADOS (mostrará de a 3): ', this.presupuestosCerrados);
      }
    });
  }


  cambiarEstado(presupuesto: Presupuesto, event: any) {
    const estado = event.detail.value as EstadoPresupuesto;
    const path = 'Usuarios/' + presupuesto.usuario.uid + '/presupuestos/';
    const updateDoc = {
      estado,
    };
    const id = presupuesto.id;
    console.log('Estado a guardar -> ', updateDoc);
    this.firestoreService.updateDoc(updateDoc, path, id).then(() => {
      console.log('ESTADO ACTUALIZADO');
      this.presentToastSuccess('Estado actulizado');
    });
  }

  getDocsPDF() {
    this.pdfsSuscribe = this.nodeService.getPresupuestosPDF().subscribe(res => {
      this.documentosPDF = res.message.files;
      console.log('Docs PDF: ', this.documentosPDF);
      this.documentosPDF.forEach(e => {
        this.pdfLista.push(e);
      });
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


}
