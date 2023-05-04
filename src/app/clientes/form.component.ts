import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { Ciudad } from './ciudad';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
  
export class FormComponent implements OnInit {
  
  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear Cliente";
  public errores: string[];
  public ciudades: Ciudad[];
  
  constructor(private clienteService: ClienteService,
    private router:Router, 
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getCiudades().subscribe(ciudades => this.ciudades = ciudades);
   
  }
  
  //Edirar cliente
  cargarCliente(): void{
    this.activateRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=>this.cliente = cliente)
      }
    });
  }

  //crear cliente
  create(): void{
    this.clienteService.create(this.cliente).subscribe(cliente =>{
    this.router.navigate(['/clientes'])
    Swal.fire('Nuevo cliente',`El cliente ${cliente.nombre}a sido creado con exito`, 'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.log('codigo de error desde el backend: '+ err.status);
      console.log(err.error.errores)
    }
   );
  }

  //Update cliente
  update(): void{
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(cliente => {
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente Actualizado',`${cliente.mensaje} ${cliente.cliente.nombre} `, 'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.log('codigo de error desde el backend: '+ err.status);
      console.log(err.error.errores)
    }
    )
  }
  
  compararCiudad(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
