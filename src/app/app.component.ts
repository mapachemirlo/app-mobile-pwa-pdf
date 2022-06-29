import { Component } from '@angular/core';
import { FirebaseauthService } from './services/firebaseauth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  admin = true;
  user = '';

  constructor(public firebaseauthService: FirebaseauthService) {
    this.getUid();
  }


  getUid() {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        if (res.uid === 'k8VgmQu09zdoSMrEfy51nj18fJp1') {
          this.admin = true;
          this.user = 'Administrador';
        } else {
          this.admin = false;
          this.user = res.email;
        }
      } else {
        this.admin = false;
        this.user = 'Offline';
      }
    });
  }








}
