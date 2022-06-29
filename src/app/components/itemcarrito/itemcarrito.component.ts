import { Component, Input, OnInit } from '@angular/core';
import { ProductoVendido } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-itemcarrito',
  templateUrl: './itemcarrito.component.html',
  styleUrls: ['./itemcarrito.component.scss'],
})
export class ItemcarritoComponent implements OnInit {

  @Input() productoVendido: ProductoVendido;
  @Input() botones = true;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {}


  addCarrito() {
    this.carritoService.addProducto(this.productoVendido.producto);
  }

  removeCarrito() {
    this.carritoService.removeProducto(this.productoVendido.producto);
  }

}
