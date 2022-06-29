/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente, Detalle, FichaTecnica, Presupuesto, Servicio, Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NodeService } from 'src/app/services/node.service';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.scss'],
})
export class PresupuestoComponent implements OnInit, OnDestroy {

  presupuesto: Presupuesto;

  uid = '';
  usuario: Usuario;

  id = ''; // nuevo
  cliente: Cliente; // nuevo
  fichaTecnica: FichaTecnica; // nuevo
  // servicioDetallado: Servicio;  // nuevo

  clientes: Cliente[] = [];
  fichas: FichaTecnica[] = [];
  presupuestos: Presupuesto[] = [];

  detalleServicio: Detalle; // de acá dentro necesito la propiedad 'servicios'

  presupuestoSuscriber: Subscription;
  cantidadPresupSuscriber: Subscription;
  suscriberUserInfo: Subscription;
  suscriberClientInfo: Subscription;
  suscriberFichaInfo: Subscription;
  clientesSuscribe: Subscription;
  fichasSuscribe: Subscription;

  total: number;
  descuento = null;
  precioFinal: number;
  precioDescuento: number;

  cantidad: number;
  numCodigo = null;

  private pathCliente = 'Clientes/';
  private pathFicha = 'Fichas/';


  constructor(public menucontroler: MenuController,
              public presupuestoService: PresupuestoService,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService,
              public toastController: ToastController,
              public router: Router,
              public nodeService: NodeService) {

                this.initServiciosDetalle();
                this.initPresupuesto();
                this.firebaseauthService.stateAuth().subscribe(res => {
                  if (res !== null) {
                    this.uid = res.uid;
                    this.getUsuarioInfo(this.uid);
                    this.loadDetalle();
                  }
                });

              }

  ngOnInit() {
    this.getClientes();
    this.getFichas();
    this.getCodigoPresupuesto();
  }


  ngOnDestroy() {
    console.log('ngOnDestroy() <- presupuesto components byeee!');
    if (this.presupuestoSuscriber) {
      this.presupuestoSuscriber.unsubscribe();
    }
    if (this.clientesSuscribe) {
      this.clientesSuscribe.unsubscribe();
    }
    if (this.fichasSuscribe) {
      this.fichasSuscribe.unsubscribe();
    }
    if (this.suscriberUserInfo) {
      this.suscriberUserInfo.unsubscribe();
    }
    if (this.suscriberClientInfo) {
      this.suscriberClientInfo.unsubscribe();
    }
    if (this.suscriberFichaInfo) {
      this.suscriberFichaInfo.unsubscribe();
    }
    if (this.cantidadPresupSuscriber) {
      this.cantidadPresupSuscriber.unsubscribe();
    }
  }


  openMenu() {
    this.menucontroler.toggle('principal');
  }


  getClientes() {
    this.clientesSuscribe = this.firestoreService.getCollection<Cliente>(this.pathCliente).subscribe(res => {
      this.clientes = res;
    });
  }


  getFichas() {
    this.fichasSuscribe = this.firestoreService.getCollection<FichaTecnica>(this.pathFicha).subscribe(res => {
      this.fichas = res;
    });
  }


  getUsuarioInfo(uid: string) {
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
      }
    });
  }


  getClienteInfo(id: string) {
    const path = 'Clientes';
    this.suscriberClientInfo = this.firestoreService.getDoc<Cliente>(path, id).subscribe(res => {
      if (res !== undefined) {
        this.cliente = res;
        console.log('El cliente traido es: ', this.cliente);
      }
    });
  }


  getFichaInfo(id: string) {
    const path = 'Fichas';
    this.suscriberFichaInfo = this.firestoreService.getDoc<FichaTecnica>(path, id).subscribe(res => {
      if (res !== undefined) {
        this.fichaTecnica = res;
        console.log('La ficha traida es: ', this.fichaTecnica);
      }
    });
  }


  selectCliente(event: any) {
    const cliente = event.detail.value as Cliente;
      this.id = cliente.id;
      console.log('ID de cliente seleccionado -> ',cliente.id);
      this.getClienteInfo(this.id);
  }



  selectFicha(event: any) {
    const ficha = event.detail.value as FichaTecnica;
    this.id = ficha.id;
    console.log('ID de la ficha seleccionada -> ', ficha.id);
    this.getFichaInfo(this.id);
  }


  initVariables(){
    this.total = null;
    this.descuento = null;
    this.precioFinal = null;
    this.precioDescuento = null;
    this.cantidad = null;
  }


  initServiciosDetalle() {
    this.detalleServicio = {
      id: '',
      usuario: null,
      servicios: []
    };
  }


  initPresupuesto() {
    this.presupuesto = {
      id: '',
      numeroCodigo: '',
      usuario: null,
      cliente: null,
      ficha: null,
      servicios: [],
      estado: 'abierto',
      cantidadTotal: null,
      precioTotal: null,
      descuento: null,
      observacion: '',
      filePDF: '',
      fecha: new Date()
    };
  }



  loadDetalle() {
    this.presupuestoSuscriber = this.presupuestoService.getDetalleServicio().subscribe(res => {
      this.detalleServicio = res;
      this.getCantidadTotal();
      this.getPrecioTotal();
      // this.getDetalleServicio();
    });
  }



  getPrecioTotal() {
    this.total = 0;
    this.detalleServicio.servicios.forEach(servicio => {
      this.total = servicio.servicio.precioTotalServicio + this.total;
    });
    this.precioFinal = this.total;
  }


  getDescuento() {
    if (this.descuento) {
      if (this.descuento < this.total) {
        this.precioDescuento = this.total - this.descuento;
        this.presupuesto.precioTotal = this.precioDescuento;
        this.presupuesto.descuento = this.descuento;
      } else {
        console.log('NO SE PUEDE APLICAR ESE DESCUENTO');
        this.presentToastError('Descuento inválido');
        this.descuento = null;
        return;
      }
    } else {
        this.precioFinal = this.total;
        this.presupuesto.precioTotal = this.precioFinal;
    }
  }


  deleteDescuento() {
    this.precioDescuento = 0;
    this.descuento = null;
  }



  getCantidadTotal() {
    this.cantidad = 0;
    this.detalleServicio.servicios.forEach(servicio => {
      this.cantidad = servicio.cantidad + this.cantidad;
    });
  }


  getCodigoPresupuesto() {
    let cantPresup = 0;
    const path = 'presupuestos';
    this.cantidadPresupSuscriber = this.firestoreService.getCollectionAllsimple<Presupuesto>(path).subscribe(res => {
      if(res.length) {
        this.presupuestos = res;
        cantPresup = this.presupuestos.length + 1;
        this.presupuesto.numeroCodigo = '000000-' + cantPresup.toString() + '-000';
        // console.log('Presupuesto N°: ', this.presupuesto.numeroCodigo);
      } else {
        cantPresup = 1;
        this.presupuesto.numeroCodigo = '000000-' + cantPresup.toString() + '-000';
      }
    });
  }



  presupuestar() {
    if (!this.detalleServicio.servicios.length) {
      console.log('Añade servicios al presupuesto');
      this.presentToastError('Agregue servicios');
      return;
    }
    const add: Detalle = {
      id: this.detalleServicio.id,
      usuario: this.detalleServicio.usuario,
      servicios: this.detalleServicio.servicios
    };
    if (!this.precioDescuento) {
      this.descuento = 0;
      this.presupuesto.precioTotal = this.precioFinal;
    }
    this.presupuesto.servicios.push(add);
    this.presupuesto.id = this.firestoreService.getId();
    this.presupuesto.fecha = new Date();
    this.presupuesto.usuario = this.usuario;
    this.presupuesto.cliente = this.cliente;
    this.presupuesto.ficha = this.fichaTecnica;
    this.presupuesto.cantidadTotal = this.cantidad;
    this.presupuesto.descuento = this.descuento;
    this.presupuesto.observacion = this.presupuesto.observacion;
    const pathPresu = 'Usuarios/' + this.uid + '/presupuestos/';
    if (this.presupuesto.cliente === undefined || this.presupuesto.ficha === undefined) {
      this.presentToastError('Especifique cliente y ficha técnica');
      console.log('DEBE ESPECIFICAR CLIENTE Y FICHA');
    } else {
      // console.log('Presupuesto a pasar: ', this.presupuesto);
      // this.firestoreService.createDoc(this.presupuesto, pathPresu, this.presupuesto.id).then(() => {
      //   console.log('PRESUPUESTO GUARDADO');
      //   this.presentToastSuccess('Presupuesto generado con éxito');
      //   this.presupuestoService.clearDetalles();
      //   this.initPresupuesto();
      //   this.initVariables();
      //   this.router.navigate(['/set-presupuesto']);
      // });

      this.nodeService.sendPresupuesto(this.presupuesto).subscribe(res => {
        console.log('Presupuesto enviado a la API');
      },
      err => {
        console.log('ALGO SALIÓ MAL', err);
      });
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

// ----------- FUNCIONES BACKUP -------------------//

  // newCliente: Cliente[] = [];
    // newFicha: FichaTecnica[] = [];

  // selectCliente(event: any) {
  //   const cliente = event.detail.value as Cliente;
  //   if (this.newCliente.length) {
  //     this.newCliente.pop();
  //     this.newCliente.push(cliente);
  //     this.presupuesto.cliente = this.newCliente;
  //   } else {
  //     this.newCliente.push(cliente);
  //     this.presupuesto.cliente = this.newCliente;
  //   }
  // }


  // selectFicha(event: any) {
  //   const ficha = event.detail.value as FichaTecnica;
  //   if (this.newFicha.length) {
  //     this.newFicha.pop();
  //     this.newFicha.push(ficha);
  //     this.presupuesto.ficha = this.newFicha;
  //   } else {
  //     this.newFicha.push(ficha);
  //     this.presupuesto.ficha = this.newFicha;
  //   }
  // }

  // getDetalleServicio() {
  //   this.detalleServicio.servicios.forEach( ser => {
  //     // console.log('Servicio ->',ser.servicio);
  //     this.servicioDetallado = ser.servicio;
  //     console.log('Nombre del servicio agregado: ', this.servicioDetallado.nombre);
  //   });
  // }


  // servicios = [];

  // for (let cant = 0; cant < this.presupuesto.servicios[0].servicios.length; cant ++) {
      //   // eslint-disable-next-line max-len
      //   this.servicios.push(this.presupuesto.servicios[0].servicios[cant].servicio.nombre);
      // }
      // this.nodeService.sendServicios(this.presupuesto.servicios[0]).subscribe(res => {
      //   console.log('Servicios enviados a la API');
      // },
      // err => {
      //   console.log('ALgo salio mal');
      // });
