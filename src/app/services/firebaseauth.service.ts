import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  datosUsuario: Usuario;

  constructor(public auth: AngularFireAuth,
              public firestoreService: FirestoreService) {

              this.stateUser();
  }


  stateUser() {
    this.stateAuth().subscribe(res => {
      if (res !== null) {
        this.getUserInfo();
      }
    });
  }


  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }


  logout() {
    return this.auth.signOut();
  }


  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }


  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }


  async getUid() {
    const user = await this.auth.currentUser;
    if (user === null) {
      return null;
    } else {
      return user.uid;
    }
  }


  stateAuth() {
    return this.auth.authState;
  }


  async getUserInfo() {
    const uid = await this.getUid();
    const path = 'Usuarios';
    this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.datosUsuario = res;
      }
    });
  }





}
