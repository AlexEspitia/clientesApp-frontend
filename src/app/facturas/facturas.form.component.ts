import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { flatMap, map, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.form.component.html',
  styleUrls: ['./facturas.form.component.css']
})
export class FacturasFormComponent implements OnInit {

  title: string = 'Nueva Factura';
  factura: Factura = new Factura();

  myControl = new FormControl('');
  productosFiltrados: Observable<Producto[]>;


  constructor(private clienteService: ClienteService,
    private route: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente =>
        this.factura.cliente = cliente);
    });
    this.productosFiltrados = this.myControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this._filter(value) : []),
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProducto(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id)
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.myControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }
  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if (cantidad ==0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    })
  }
  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }
  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    })
  }
  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) =>id! == item.producto.id );
}
//crear Facturas
createFactura(): void{
  this.facturaService.createFactura(this.factura).subscribe(factura =>{
  Swal.fire(this.title,`Factura ${factura.descripcion}a sido creada con exito`, 'success')
  this.router.navigate(['/facturas',factura.id]);
    });
  }
}
