import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Servicio } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-servicios',
  templateUrl: './set-servicios.component.html',
  styleUrls: ['./set-servicios.component.scss'],
})
export class SetServiciosComponent implements OnInit, OnDestroy {

  servicios: Servicio[] = [];
  newServicio: Servicio;
  serviciosSuscribe: Subscription;
  enableNewServicio = false;
  loading: any;
  private path = 'Servicios/';


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {
    this.getServicios();
  }

  ngOnDestroy() {
    if (this.serviciosSuscribe) {
      this.serviciosSuscribe.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  nuevo() {
    this.enableNewServicio = true;
    this.newServicio = {
      id: this.firestoreService.getId(),
      nombre: '',
      tipo: '',
      unidadMedida: '',
      precio: null,
      precioTotalServicio: null,
      fecha: new Date()
    };
  }


  guardarServicio() {
    this.presentLoading();
    const path = 'Servicios';
    const name = this.newServicio.nombre;
    const type = this.newServicio.tipo;
    const unitMeasure = this.newServicio.unidadMedida;
    const price = this.newServicio.precio;
    this.firestoreService.createDoc(this.newServicio, this.path, this.newServicio.id).then(res => {
      this.loading.dismiss();
      this.presentToastSuccess('Guardado con éxito');
      this.enableNewServicio = false;
      console.log('GUARDADO CON EXITO');
    }).catch(err => {
      this.presentToastError('Error al guardar');
      console.log(`ERROR AL GUARDAR -> ${err}`);
    });
  }


  getServicios() {
    this.serviciosSuscribe = this.firestoreService.getCollection<Servicio>(this.path).subscribe(res => {
      this.servicios = res;
    });
  }


  async deleteServicio(servicio: Servicio) {
    const alert = await this.alertController.create({
      cssClass: 'advertencia',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong> este servicio?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'cancelar',
          handler: (blah) => {
            console.log('Confirma Cancelar: blah');
          }
        }, {
          cssClass: 'confirmar',
          text: 'confirmar',
          handler: () => {
            console.log('Confirma Ok');
            this.firestoreService.deleteDoc(this.path, servicio.id).then(res => {
              this.presentToastSuccess('Eliminado con éxito');
              console.log('Eliminado con éxito');
            }).catch(err => {
              this.presentToastError('Error al eliminar');
              console.log('NO SE PUDO ELIMINAR');
            });
          }
        }
      ]
    });
    await alert.present();
  }


// ---------------------------------- EXPERIENCIA DEL USUARIO -------------------------------------- //

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'lala',
      message: 'Guardando...',
    });
    await this.loading.present();
  }


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
