import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto, Proveedor } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit, OnDestroy {

  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  newProveedor: Proveedor[] = [];

  productosSuscribe: Subscription;
  proveedoresSuscribe: Subscription;
  suscriberProveedorInfo: Subscription; // nuevo

  newProducto: Producto;
  proveedor: Proveedor; // nuevo

  enableNewProducto = false;
  enableProveedorRead = true;
  newImage = '';
  newFile: any;
  loading: any;
  idProveedor = '';
  id = '';

  private path = 'Productos/';
  private pathProveedor = 'Proveedores/';


  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getProductos();
    this.getProveedores();
  }

  ngOnDestroy() {
    if (this.proveedoresSuscribe) {
      this.proveedoresSuscribe.unsubscribe();
    }
    if (this.productosSuscribe) {
      this.productosSuscribe.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  getProveedores() {
    this.proveedoresSuscribe = this.firestoreService.getCollection<Proveedor>(this.pathProveedor).subscribe(res => {
      this.proveedores = res;
    });
  }


  getProveedorInfo(id: string) {
    const path = 'Proveedores';
    this.suscriberProveedorInfo = this.firestoreService.getDoc<Proveedor>(path, id).subscribe(res => {
      if (res !== undefined) {
        this.proveedor = res;
        this.newProducto.proveedor = this.proveedor;
      }
    });
  }



  selectProveedor(event: any) {
    const proveedor = event.detail.value as Proveedor;
      this.id = proveedor.id;
      this.getProveedorInfo(this.id);
  }


  nuevo() {
    this.enableNewProducto = true;
    this.enableProveedorRead = false;
    this.newProducto = {
      id: this.firestoreService.getId(),
      nombre: '',
      tipo: '',
      precioCosto: null,
      precio: null,
      elaboracionFecha: '',
      vencimientoFecha: '',
      lote: '',
      color: '',
      unidadMedida: '',
      valorMedida: null,
      image: '',
      proveedor: null,
      fecha: new Date()
    };
  }


  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.newProducto.image = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
    }
  }


  async guardarProducto() {
    const pathStorage = 'Productos';
    const name = this.newProducto.nombre;
    const type = this.newProducto.tipo;
    const costPrice = this.newProducto.precioCosto;
    const price = this.newProducto.precio;
    const elaborationDate = this.newProducto.elaboracionFecha;
    const expiration = this.newProducto.vencimientoFecha;
    const lost = this.newProducto.lote;
    const colour = this.newProducto.color;
    const unitMeasure = this.newProducto.unidadMedida;
    const valueMeasure = this.newProducto.valorMedida;
    // const image = this.newProducto.image;
    if (this.newFile !== undefined) {

      if (this.newFile === this.newProducto.image) {
        const res = await this.firestorageService.uploadImage(this.newFile, pathStorage, name);
        this.newProducto.image = res;
      } else {
        console.log('no se pisará imagen');
        if (this.newProducto.proveedor === undefined || this.newProducto.proveedor === null) {
          console.log('DEBE ESPECIFICAR UN PROVEEDOR');
          this.presentToastError('DEBE ESPECIFICAR UN PROVEEDOR');
        } else {
          this.presentLoading();
          this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
            this.loading.dismiss();
            this.presentToastSuccess('Guardado con éxito');
            this.enableNewProducto = false;
            console.log('GUARDADO CON EXITO');
          }).catch(err => {
            this.presentToastError('Error al guardar');
            console.log('ERROR AL GUARDAR');
          });
        }
      }

    } else {
      console.log('NO SE TRATÓ NINGUNA IMAGEN, SE GUARDARÁ LO DEMÁS');
      if (this.newProducto.proveedor === undefined || this.newProducto.proveedor === null) {
        console.log('Debe especificar un proveedor');
        this.presentToastError('Debe especificar un proveedor');
      } else {
        this.presentLoading();
        this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
          this.loading.dismiss();
          this.presentToastSuccess('Guardado con éxito');
          this.enableNewProducto = false;
          console.log('GUARDADO CON EXITO');
        }).catch(err => {
          this.presentToastError('Error al guardar');
          console.log('ERROR AL GUARDAR');
        });
      }
    }
  }


  getProductos() {
    this.productosSuscribe = this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      this.productos = res;
    });
  }


  async deleteProducto(producto: Producto) {
    const alert = await this.alertController.create({
      cssClass: 'advertencia',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong> este producto?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'cancelar',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          cssClass: 'confirmar',
          text: 'confirmar',
          handler: () => {
            // console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, producto.id).then( res => {
              this.presentToastSuccess('Eliminado con éxito');
            }).catch( error => {
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


// ---- FUNCIONES BACKUP ---- //
// selectProveedor(event: any) {
  //   const provee = event.detail.value as Proveedor;
  //   if (this.newProveedor.length) {
  //     this.newProveedor.pop();
  //     this.newProveedor.push(provee);
  //     this.newProducto.proveedor = this.newProveedor;
  //   } else {
  //     this.newProveedor.push(provee);
  //     this.newProducto.proveedor = this.newProveedor;
  //   }
  // }


  // async guardarProducto() {
  //   const pathStorage = 'Productos';
  //   const name = this.newProducto.nombre;
  //   const type = this.newProducto.tipo;
  //   const costPrice = this.newProducto.precioCosto;
  //   const price = this.newProducto.precio;
  //   const elaborationDate = this.newProducto.elaboracionFecha;
  //   const expiration = this.newProducto.vencimientoFecha;
  //   const lost = this.newProducto.lote;
  //   const colour = this.newProducto.color;
  //   const unitMeasure = this.newProducto.unidadMedida;
  //   const valueMeasure = this.newProducto.valorMedida;
  //   const image = this.newProducto.image;
  //   if (this.newFile !== undefined) {
  //     const res = await this.firestorageService.uploadImage(this.newFile, pathStorage, name);
  //     this.newProducto.image = res;
  //   }
  //   if (this.newProducto.proveedor === undefined || this.newProducto.proveedor === null) {
  //     console.log('DEBE ESPECIFICAR UN PROVEEDOR');
  //     this.presentToastError('DEBE ESPECIFICAR UN PROVEEDOR');
  //   } else {
  //     this.presentLoading();
  //     this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
  //       this.loading.dismiss();
  //       this.presentToastSuccess('Guardado con éxito');
  //       this.enableNewProducto = false;
  //       console.log('GUARDADO CON EXITO');
  //     }).catch(err => {
  //       this.presentToastError('Error al guardar');
  //       console.log('ERROR AL GUARDAR');
  //     });
  //   }
  // }