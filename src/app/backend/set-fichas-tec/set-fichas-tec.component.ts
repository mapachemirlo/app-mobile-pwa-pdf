import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente, FichaDocumento, FichaTecnica } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-fichas-tec',
  templateUrl: './set-fichas-tec.component.html',
  styleUrls: ['./set-fichas-tec.component.scss'],
})
export class SetFichasTecComponent implements OnInit, OnDestroy {

  fichas: FichaTecnica[] = [];
  clientes: Cliente[] = [];
  documentoFichas: FichaDocumento[] = []; // nuevo
  newDocumentoFicha: FichaDocumento;  // nuevo

  newFicha: FichaTecnica;
  cliente: Cliente; // nuevo

  enableNewFicha = false;
  enableClienteRead = true;
  enableViewDocs = false; // nuevo

  newFileImage: any;
  newFileDoc: any;
  loading: any;
  id = ''; // nuevo
  uid = '';

  admin = true;
  user = '';

  clientesSuscribe: Subscription;
  fichasSuscribe: Subscription;
  suscriberClientInfo: Subscription;
  documentosSuscribe: Subscription;

  private path = 'Fichas/';
  private pathCliente = 'Clientes/';
  private pathDocumento = 'Documentos/'; // nuevo

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService,
              public firebaseauthService: FirebaseauthService) {
                this.initDocumento();
                this.getUid();
              }

  ngOnInit() {
    this.getClientes();
    this.getFichas();
  }

  ngOnDestroy() {
    if (this.clientesSuscribe) {
      this.clientesSuscribe.unsubscribe();
    }
    if (this.fichasSuscribe) {
      this.fichasSuscribe.unsubscribe();
    }
    if (this.suscriberClientInfo) {
      this.suscriberClientInfo.unsubscribe();
    }
    if (this.documentosSuscribe) {
      this.documentosSuscribe.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  nuevo() {
    this.enableNewFicha = true;
    this.enableClienteRead = false;
    this.newFicha = {
      id: this.firestoreService.getId(),
      nombre: '',
      cliente: null,
      descripcion: '',
      medidaOrilla: null,
      medidaFleco: null,
      image: '',
      presupuestosFinalizados: null,
      fecha: new Date()
    };
  }


  initDocumento() {
    this.newDocumentoFicha = {
      id: '',
      nombre: '',
      doc: '',
      fecha: new Date()
    };
  }


  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.newFileImage = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.newFicha.image = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
    }
  }


  async newDocUpload(event: any) {
    const pathStorageDocument = 'Documentos/' + 'Fichas/';
    if (event.target.files && event.target.files[0]) {
      this.newFileDoc = event.target.files[0];
      // console.log('el file es: ', this.newFileDoc.name);
      const name = this.newFileDoc.name + '.doc';
      this.newDocumentoFicha.nombre = name;
      const res = await this.firestorageService.uploadDoc(this.newFileDoc, pathStorageDocument, name);
      this.newDocumentoFicha.doc = res;
      this.newDocumentoFicha.id = this.firestoreService.getId();
      this.firestoreService.createDoc(this.newDocumentoFicha, this.pathDocumento, this.newDocumentoFicha.id).then(() => {
        this.presentToastSuccess('Archivo subido con éxito');
        console.log('ARCHIVO GUARDADO CON EXITO');
        console.log('El documento guardado es: ', this.newDocumentoFicha);
      }).catch(err => {
        this.presentToastError('Error al subir archivo');
        console.log('ERROR AL GUARDAR', err);
      });
    }
  }


  getDocumentosFichas() {
    this.documentosSuscribe = this.firestoreService.getCollection<FichaDocumento>(this.pathDocumento).subscribe(res => {
      this.documentoFichas = res;
      console.log('Estos son todos los documentos: ', res);
    });
  }


  getClientes() {
    this.clientesSuscribe = this.firestoreService.getCollection<Cliente>(this.pathCliente).subscribe(res => {
      this.clientes = res;
    });
  }


  selectCliente(event: any) {
    const cliente = event.detail.value as Cliente;
      this.id = cliente.id;
      this.getClienteInfo(this.id);
  }


  getClienteInfo(id: string) {
    const path = 'Clientes';
    this.suscriberClientInfo = this.firestoreService.getDoc<Cliente>(path, id).subscribe(res => {
      if (res !== undefined) {
        this.cliente = res;
        this.newFicha.cliente = this.cliente;
      }
    });
  }



  async guardarFicha() {
    const pathStorageImage = 'Fichas';
    // const pathStorageDocument = 'Documentos' + '/' + 'Fichas';
    const id = this.firestoreService.getId();
    const name = this.newFicha.nombre;
    const description = this.newFicha.descripcion;
    const shoreMeasure = this.newFicha.medidaOrilla;
    const fringesMeasure = this.newFicha.medidaFleco;
    if (this.newFileImage !== undefined) {

      if (this.newFileImage === this.newFicha.image) {
        const res = await this.firestorageService.uploadImage(this.newFileImage, pathStorageImage, name);
        this.newFicha.image = res;
      } else {
        console.log('no se pisará imagen');
        if (this.newFicha.cliente === undefined || this.newFicha.cliente === null) {
          console.log('DEBE ESPECIFICAR UN CLIENTE');
          this.presentToastError('Debe especificar un cliente');
        } else {
          this.presentLoading();
          this.firestoreService.createDoc(this.newFicha, this.path, this.newFicha.id).then(res => {
            this.loading.dismiss();
            this.presentToastSuccess('Guardado con éxito');
            this.enableClienteRead = true;
            this.enableNewFicha = false;
            this.enableViewDocs = false;
            console.log('GUARDADO CON EXITO');
          }).catch(err => {
            this.presentToastError('Error al guardar');
            console.log('ERROR AL GUARDAR');
          });
        }
      }
    } else {
      console.log('NO SE TRATÓ NINGUNA IMAGEN, SE GUARDARÁ LO DEMÁS');
      if (this.newFicha.cliente === undefined || this.newFicha.cliente === null) {
        console.log('DEBE ESPECIFICAR UN CLIENTE');
        this.presentToastError('Debe especificar un cliente');
      } else {
        this.presentLoading();
        this.firestoreService.createDoc(this.newFicha, this.path, this.newFicha.id).then(res => {
          this.loading.dismiss();
          this.presentToastSuccess('Guardado con éxito');
          this.enableClienteRead = true;
            this.enableNewFicha = false;
            this.enableViewDocs = false;
          console.log('GUARDADO CON EXITO');
        }).catch(err => {
          this.presentToastError('Error al guardar');
          console.log('ERROR AL GUARDAR');
        });
      }
    }
  }


  getFichas() {
    this.firestoreService.getCollection<FichaTecnica>(this.path).subscribe(res => {
      this.fichas = res;
    });
  }


  async deleteFicha(ficha: FichaTecnica) {
    const alert = await this.alertController.create({
      cssClass: 'advertencia',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong> esta ficha técnica?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'lala',
          handler: (blah) => {
            console.log('Confirma Cancelar: blah');
          }
        }, {
          cssClass: 'confirmar',
          text: 'confirmar',
          handler: () => {
            console.log('Confirma Ok');
            this.firestoreService.deleteDoc(this.path, ficha.id).then(res => {
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

  getUid() {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
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


  // ---------------------------------- EXPERIENCIA DEL USUARIO -------------------------------------- //

  async presentLoading() {
    this.loading = await this.loadingController.create({
      // cssClass: 'lala',
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

// ----- FUNCIONES BACKUP ------ //
  // newCliente: Cliente[] = [];
  // docs = [];  // nuevo


// selectCliente(event: any) {
  //   const cliente = event.detail.value as Cliente;
  //   if (this.newCliente.length) {
  //     this.newCliente.pop();
  //     this.newCliente.push(cliente);
  //     this.newFicha.cliente = this.newCliente;
  //   } else {
  //     this.newCliente.push(cliente);
  //     this.newFicha.cliente = this.newCliente;
  //   }
  // }



  // async guardarFicha() {
  //   const pathStorageImage = 'Fichas';
  //   const pathStorageDocument = 'Documentos' + '/' + 'Fichas';
  //   const id = this.firestoreService.getId();
  //   const name = this.newFicha.nombre;
  //   const description = this.newFicha.descripcion;
  //   const shoreMeasure = this.newFicha.medidaOrilla;
  //   const fringesMeasure = this.newFicha.medidaFleco;
  //   if (this.newFileImage !== undefined) {
  //     if (this.newFileImage === this.newFicha.image) {
  //       console.log('Es la misma imagen');
  //       const res = await this.firestorageService.uploadImage(this.newFileImage, pathStorageImage, name);
  //       this.newFicha.image = res;
  //     } else {
  //       console.log('La imagen es diferente, no se guardará');
  //       if (this.newFileDoc !== undefined) {
  //         const res = await this.firestorageService.uploadDoc(this.newFileDoc, pathStorageDocument, name);
  //         this.newFicha.fileDOC = res;
  //       }
  //       if (this.newFicha.cliente === undefined || this.newFicha.cliente === null) {
  //         console.log('DEBE ESPECIFICAR UN CLIENTE');
  //         this.presentToastError('DEBE ESPECIFICAR UN CLIENTE');
  //       } else {
  //         this.presentLoading();
  //         this.firestoreService.createDoc(this.newFicha, this.path, this.newFicha.id).then(res => {
  //           this.loading.dismiss();
  //           this.presentToastSuccess('Guardado con éxito');
  //           this.enableNewFicha = false;
  //           console.log('GUARDADO CON EXITO');
  //         }).catch(err => {
  //           this.presentToastError('Error al guardar');
  //           console.log('ERROR AL GUARDAR');
  //         });
  //       }
  //     }
  //   }
  // }


  // async newDocUpload(event: any) {
  //   const pathStorageDocument = 'Documentos/' + 'Fichas/';
  //   if (event.target.files && event.target.files[0]) {
  //     this.newFileDoc = event.target.files[0];
  //     // console.log('el file es: ', this.newFileDoc.name);
  //     const name = this.newFileDoc.name + '.doc';
  //     await this.firestorageService.uploadDoc(this.newFileDoc, pathStorageDocument, name).then(res => {
  //     this.docs.push(res);
  //     // guardar en firestore creando un documento tipo (Documento/fichas/ y ahi meterlas)
  //     this.presentToastSuccess('Archivo subido con Exito!');
  //     }).catch(err => {
  //       console.log('error al subir');
  //       this.presentToastError('ERROR AL SUBIR ARCHIVO');
  //     });
  //   }
  //   console.log('Contenido en Bucket de Firestorage ', this.docs);
  // }
