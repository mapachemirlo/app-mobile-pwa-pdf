import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {


  usuario: Usuario = {
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

  newFile: any;
  uid = '';
  suscriberUserInfo: Subscription;
  ingresarEnable = false;


  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService,
              public toastController: ToastController) {

              this.firebaseauthService.stateAuth().subscribe(res => {
                // console.log(res);
                if (res !== null) {
                  this.uid = res.uid;
                  this.getUsuarioInfo(this.uid);
                } else {
                  this.initUsuario();
                }
              });
  }


   async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log(`UID de usuario -> ${uid}`);
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  initUsuario() {
    this.uid = '';
    this.usuario = {
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
  }


  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.usuario.image = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
      }
   }


  async registrarse() {
      const credenciales = {
        email: this.usuario.email,
        password: this.usuario.password
      };
      if (credenciales.email === '' || credenciales.password === '') {
        this.presentToastError('Email y contraseña obligatorios');
      } else {
        const res = await this.firebaseauthService.signup(credenciales.email, credenciales.password).catch(err => {
          console.log('ERROR -> ', err);
        });
        const uid = await this.firebaseauthService.getUid();
        this.usuario.uid = uid;
        this.guardarUsuario();
      }
   }


  async guardarUsuario() {
    const path = 'Usuarios';
    const email = this.usuario.email;
    const password = this.usuario.password;
    const surname = this.usuario.apellido;
    const name = this.usuario.nombre;
    const phone1 = this.usuario.telefono1;
    const phone2 = this.usuario.telefono2;
    const address = this.usuario.direccion;
    const city = this.usuario.localidad;
    const state = this.usuario.provincia;
    const country = this.usuario.pais;
    if (this.newFile !== undefined) {
      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
      this.usuario.image = res;
    }
    this.firestoreService.createDoc(this.usuario, path, this.usuario.uid).then(res => {
      this.presentToastSuccess('Datos guardados');
      console.log('GUARDADO CON EXITO');
    }).catch(err => {
      this.presentToastError('Error al guardar');
      console.log('ERROR AL GUARDAR ->', err);
    });
  }


  ingresar(){
    const credenciales = {
     email: this.usuario.email,
     password: this.usuario.password
    };
    if (credenciales.email === '' || credenciales.password === '') {
      this.presentToastError('Datos incompletos');
    } else {
      this.firebaseauthService.login(credenciales.email, credenciales.password).then(res => {
        this.presentToastSuccess('Sesión iniciada');
        console.log('INGRESO EXITOSO');
      }).catch(err => {
        this.presentToastError('Ingreso inválido');
         console.log('ERROR AL INGRESAR -> ', err);
      });
    }
  }


  async salir(){
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
  }


  getUsuarioInfo(uid: string) {
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
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
