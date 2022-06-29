export interface Usuario {
    uid: string;
    email: string;
    password: string;
    apellido: string;
    nombre: string;
    telefono1: number;
    telefono2: number;
    direccion: string;
    localidad: string;
    provincia: string;
    pais: string;
    image: string;
}

export interface Cliente {
    id: string;
    apellido: string;
    nombre: string;
    email: string;
    telefono1: number;
    telefono2: number;
    empresa: string;
    direccion: string;
    localidad: string;
    provincia: string;
    pais: string;
    notas: string;
    fecha: Date;
}

export interface Proveedor {
    id: string;
    nombreEmpresa: string;
    nombreRepresentante: string;
    apellido: string;
    nombre: string;
    telefono1: number;
    telefono2: number;
    email: string;
    direccion: string;
    localidad: string;
    provincia: string;
    pais: string;
    notas: string;
    atencion: string;
    productos: string;
    fecha: Date;
}

export interface Servicio {
    id: string;
    nombre: string;
    tipo: string;
    unidadMedida: string;
    precio: number;
    precioTotalServicio: number;
    fecha: Date;
}

export interface FichaTecnica {
    id: string;
    nombre: string;
    cliente: Cliente;
    descripcion: string;
    medidaOrilla: number;
    medidaFleco: number;
    image: string;
    presupuestosFinalizados: PresupuestoLista[];
    fecha: Date;
}

export interface FichaDocumento {
    id: string;
    nombre: string;
    doc: string;
    fecha: Date;
}

export interface Presupuesto {
    id: string;
    numeroCodigo: string;
    usuario: Usuario;
    cliente: Cliente;
    ficha: FichaTecnica;
    servicios: Detalle[]; //probando entre Servicio[] y Detalle[] probar con ServicioSolicitado[]
    estado: EstadoPresupuesto;
    cantidadTotal: number;
    precioTotal: number;
    descuento: number;
    observacion: string;
    filePDF: string;
    fecha: any;
}

export interface Producto {
    id: string;
    nombre: string;
    tipo: string;
    precioCosto: number;
    precio: number;
    elaboracionFecha: string;
    vencimientoFecha: string;
    lote: string;
    color: string;
    unidadMedida: string;
    valorMedida: number;
    image: string;
    proveedor: Proveedor;
    fecha: Date;
}

export interface Venta {
    id: string;
    usuario: Usuario;
    cliente: Cliente[];
    productos: ProductoVendido[];
    precioTotal: number;
    fecha: any;
}

export interface PresupuestoLista {
    presupuesto: Presupuesto;
    cantidad: number;
}

export interface Detalle {
    id: string;
    usuario: string;
    servicios: ServicioSolicitado[];
}

export interface ServicioSolicitado {
    servicio: Servicio;
    cantidad: number;
}

export interface ProductoListaProveedor {
    producto: Producto;
    cantidad: number;
}

export interface ProductoVendido {
    producto: Producto;
    cantidad: number;
}

export type EstadoPresupuesto = 'abierto' | 'cerrado' ;
