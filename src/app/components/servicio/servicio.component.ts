import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Servicio } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit {

  @Input() servicio: Servicio;

  uid = '';
  medidaA = null;
  medidaB = null;
  medidaTotal = null;
  precioTotal = null;

  constructor(public presupuestoService: PresupuestoService,
              public toastController: ToastController,
              public firebaseauthService: FirebaseauthService) {

                this.getUid();
              }

  ngOnInit() {}

  getUid() {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
      }
    });
  }


  initMedidas() {
    this.medidaA = null;
    this.medidaB = null;
  }

  initResultados() {
    this.medidaTotal = null;
    this.precioTotal = null;
  }


  calcularPrecioM2() {
    if (this.medidaA === null || this.medidaB === null) {
      console.log('NO CAMPOS VACIOS');
      this.presentToastError('Complete los campos vacíos');
      this.initMedidas();
      this.initResultados();
      return;
    } else {
      if (this.medidaA === 0 || this.medidaB === 0) {
        console.log('POSTA MULTIPLICAS POR CERO? BRAVO!');
        this.presentToastError('Son m2, no se puede multiplicar por cero');
        this.initMedidas();
        this.initResultados();
        return;
      } else {
        this.medidaTotal = this.medidaA * this.medidaB;
        this.precioTotal = this.medidaTotal * this.servicio.precio;
        this.servicio.precioTotalServicio = this.precioTotal;
        this.initMedidas();
      }
    }
  }


  calcularPrecioML() {
    if (this.medidaA === null || this.medidaB === null) {
      console.log('NO CAMPOS VACIOS');
      this.presentToastError('Complete los campos vacíos');
      this.initMedidas();
      this.initResultados();
      return;
    } else {
      this.medidaTotal = this.medidaA + this.medidaB;
      this.precioTotal = this.medidaTotal * this.servicio.precio;
      this.servicio.precioTotalServicio = this.precioTotal;
      this.initMedidas();
    }
  }

  agregar(){
    if (this.medidaTotal === null || this.precioTotal === null || this.medidaTotal === 0 || this.precioTotal === 0) {
      this.presentToastError('Error, debe calcular primero');
    } else {
      this.addPresupuesto();
    }

  }

  addPresupuesto() {
    // console.log('Se agregaría el siguiente servicio:', this.servicio);
    this.presupuestoService.addServicio(this.servicio);
    this.presentToastSuccess('Agregado al presupuesto');
    this.initResultados();
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



  // mostrar(){
  //   console.log(this.medidaA, this.medidaB);
  //   this.verPrecio();
  // }

  // verPrecio(){
  //   console.log(this.servicio.precio);
  // }

}
