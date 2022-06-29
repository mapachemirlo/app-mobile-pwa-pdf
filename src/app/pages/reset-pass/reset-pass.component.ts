import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss'],
})
export class ResetPassComponent implements OnInit {

  email = '';
  enableForm = true;

  constructor(public menucontroler: MenuController,
              public toastController: ToastController,
              private firebaseauthService: FirebaseauthService) {
                this.enableForm = true;
              }

  ngOnInit() {}


  openMenu() {
    this.menucontroler.toggle('principal');
  }

  sendLinkReset() {
    if (this.email !== '') {
      this.firebaseauthService.resetPassword(this.email).then(() => {
        this.presentToastSuccess('Link enviado');
        this.enableForm = false;
        console.log('Link enviado');
      }).catch (err => {
        this.presentToastError('ERROR AL ENVIAR LINK');
        console.log('ERROR', err);
      });
    } else {
      this.presentToastError('Debe ingresar su email');
      console.log('INGRESE EMAIL');
    }
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
