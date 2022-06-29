import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-clientes',
  templateUrl: './set-clientes.component.html',
  styleUrls: ['./set-clientes.component.scss'],
})
export class SetClientesComponent implements OnInit, OnDestroy {

  clientes: Cliente[] = [];
  newCliente: Cliente;
  enableNewCliente = false;
  loading: any;
  clientesSuscribe: Subscription;
  uid = '';
  private path = 'Clientes/';

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public firebaseauthService: FirebaseauthService) {

                this.firebaseauthService.stateAuth().subscribe(res => {
                  if (res !== null) {
                    this.uid = res.uid;
                  }
                });
              }

  ngOnInit() {
    this.getClientes();
  }

  ngOnDestroy() {
    if (this.clientesSuscribe) {
      this.clientesSuscribe.unsubscribe();
    }
  }

  openMenu() {
    this.menucontroler.toggle('principal');
  }

  nuevo() {
    this.enableNewCliente = true;
    this.newCliente = {
      id: this.firestoreService.getId(),
      apellido: '',
      nombre: '',
      email: '',
      telefono1: null,
      telefono2: null,
      empresa: '',
      direccion: '',
      localidad: '',
      provincia: '',
      pais: '',
      notas: '',
      fecha: new Date()
    };
  }


  guardarCliente() {
    this.presentLoading();
    const path = 'Cliente';
    const surname = this.newCliente.apellido;
    const name = this.newCliente.nombre;
    const email = this.newCliente.email;
    const phone1 = this.newCliente.telefono1;
    const phone2 = this.newCliente.telefono2;
    const business = this.newCliente.empresa;
    const address = this.newCliente.direccion;
    const city = this.newCliente.localidad;
    const state = this.newCliente.provincia;
    const country = this.newCliente.pais;
    const notes = this.newCliente.notas;
    if (email === '') {
      this.newCliente.email = 'restaurandohistoria1960@gmail.com';
    };
    this.firestoreService.createDoc(this.newCliente, this.path, this.newCliente.id).then(res => {
      this.loading.dismiss();
      this.presentToastSuccess('Guardado con éxito');
      this.enableNewCliente = false;
      console.log('GUARDADO CON EXITO');
    }).catch(err => {
      this.presentToastError('Error al guardar');
      console.log(`ERROR AL GUARDAR -> ${err}`);
    });
  }


  getClientes() {
    this.clientesSuscribe = this.firestoreService.getCollection<Cliente>(this.path).subscribe(res => {
      this.clientes = res;
    });
  }



  async deleteCliente(cliente: Cliente) {
    const alert = await this.alertController.create({
      cssClass: 'advertencia',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong> este cliente?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'cancelar',
          handler: (blah) => {
            console.log('Confirma Cancelar: blah');
          }
        }, {
          text: 'confirmar',
          cssClass: 'confirmar',
          handler: () => {
            console.log('Confirma Ok');
            this.firestoreService.deleteDoc(this.path, cliente.id).then(res => {
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
      // cssClass: 'guardando',
      message: 'Guardando...',
    });
    await this.loading.present();
  }


  async presentToastSuccess(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      // cssClass: 'success',
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
