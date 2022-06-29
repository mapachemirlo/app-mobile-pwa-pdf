import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Proveedor } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-proveedores',
  templateUrl: './set-proveedores.component.html',
  styleUrls: ['./set-proveedores.component.scss'],
})
export class SetProveedoresComponent implements OnInit, OnDestroy {

  proveedores: Proveedor[] = [];
  newProveedor: Proveedor;
  proveedoresSuscribe: Subscription;
  enableNewProveedor = false;
  loading: any;
  private path = 'Proveedores/';

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {
    this.getProveedores();
  }

  ngOnDestroy() {
    if (this.proveedoresSuscribe) {
      this.proveedoresSuscribe.unsubscribe();
    }
  }

  openMenu() {
    this.menucontroler.toggle('principal');
  }

  nuevo() {
    this.enableNewProveedor = true;
    this.newProveedor = {
      id: this.firestoreService.getId(),
      nombreEmpresa: '',
      nombreRepresentante: '',
      apellido: '',
      nombre: '',
      telefono1: null,
      telefono2: null,
      email: '',
      direccion: '',
      localidad: '',
      provincia: '',
      pais: '',
      notas: '',
      atencion: '',
      productos: '',
      fecha: new Date()
    };
  }


  guardarProveedor() {
    this.presentLoading();
    const path = 'Proveedores';
    const nameBusiness = this.newProveedor.nombreEmpresa;
    const nameManager = this.newProveedor.nombreRepresentante;
    const surname = this.newProveedor.apellido;
    const name = this.newProveedor.nombre;
    const phone1 = this.newProveedor.telefono1;
    const phone2 = this.newProveedor.telefono2;
    const email = this.newProveedor.email;
    const address = this.newProveedor.direccion;
    const city = this.newProveedor.localidad;
    const state = this.newProveedor.provincia;
    const country = this.newProveedor.pais;
    const notes = this.newProveedor.notas;
    const attention = this.newProveedor.atencion;
    const products = this.newProveedor.productos;
    this.firestoreService.createDoc(this.newProveedor, this.path, this.newProveedor.id).then(res => {
      this.loading.dismiss();
      this.presentToastSuccess('Guardado con éxito');
      this.enableNewProveedor = false;
      console.log('GUARDADO CON EXITO');
    }).catch(err => {
      this.presentToastError('Error al guardar');
      console.log(`ERROR AL GUARDAR -> ${err}`);
    });
  }


  getProveedores() {
    this.proveedoresSuscribe = this.firestoreService.getCollection<Proveedor>(this.path).subscribe(res => {
      this.proveedores = res;
    });
  }


  async deleteProveedor(proveedor: Proveedor) {
    const alert = await this.alertController.create({
      cssClass: 'advertencia',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong> este proveedor?',
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
            this.firestoreService.deleteDoc(this.path, proveedor.id).then(res => {
              this.presentToastSuccess('Eliminado con éxito');
              console.log('ELIMINADO CON EXITO');
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
