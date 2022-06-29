import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-usuarios',
  templateUrl: './set-usuarios.component.html',
  styleUrls: ['./set-usuarios.component.scss'],
})
export class SetUsuariosComponent implements OnInit, OnDestroy {

  newUsuario: Usuario = {
    uid: '',
    email: '',
    password: '',
    apellido: '',
    nombre: '',
    telefono1: null,
    telefono2: null,
    direccion: '',
    localidad: '',
    provincia: '',
    pais: '',
    image: ''
  };

  usuarios: Usuario[] = [];
  usuariosSuscriber: Subscription;
  enableEditUsuario = false;
  newFile: any;
  loading: any;

  private path = 'Usuarios/';


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService,
              public toastController: ToastController,
              public loadingController: LoadingController,
              public alertController: AlertController) { }

  ngOnInit() {
    this.getUsuarios();
  }

  ngOnDestroy() {
    if (this.usuariosSuscriber) {
      this.usuariosSuscriber.unsubscribe();
    }
  }

  openMenu() {
    this.menucontroler.toggle('principal');
  }


  newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
          this.newUsuario.image = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  getUsuarios() {
    this.usuariosSuscriber = this.firestoreService.getCollection<Usuario>(this.path).subscribe(res => {
      this.usuarios = res;
      console.log('Lista de usuarios: ', this.usuarios);
    });
  }


  async guardarCambios() {
    this.presentLoading();
    const email = this.newUsuario.email;
    const password = this.newUsuario.password;
    const surname = this.newUsuario.apellido;
    const nameImage = this.newUsuario.nombre;
    const phone1 = this.newUsuario.telefono1;
    const phone2 = this.newUsuario.telefono2;
    const address = this.newUsuario.direccion;
    const city = this.newUsuario.localidad;
    const state = this.newUsuario.provincia;
    const country = this.newUsuario.pais;
    if (this.newFile !== undefined) {
      const res = await this.firestorageService.uploadImage(this.newFile, this.path, nameImage);
      this.newUsuario.image = res;
    }
    this.firestoreService.updateDoc(this.newUsuario, this.path, this.newUsuario.uid).then(res => {
      this.loading.dismiss();
      this.presentToastSuccess('Usuario actualizado');
      this.enableEditUsuario = false;
      console.log('USUARIO ACTUALIZADO');
    }).catch(err => {
      this.presentToastError('Error al actualizar');
      console.log('ERROR AL ACTUALIZAR');
    });
  }


  async deleteUsuario(usuario: Usuario) {
    const alert = await this.alertController.create({
      cssClass: 'advertencia',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong> este usuario?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'cancelar',
          handler: (blah) => {
            // console.log('Confirma Cancelar: blah');
          }
        }, {
          cssClass: 'confirmar',
          text: 'confirmar',
          handler: () => {
            console.log('Confirma Ok');
            this.firestoreService.deleteDoc(this.path, usuario.uid).then(res => {
              this.presentToastSuccess('Eliminado con éxito');
              console.log('ELIMINADO CON EXITO');
            }).catch(err => {
              this.presentToastError('No se puede eliminar');
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
      // cssClass: 'lala',
      message: 'Actualizando...',
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
