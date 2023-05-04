import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './perfil/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
  
})
export class ClientesComponent implements OnInit {

   clientes: Cliente[]=[];
   paginador: any;
   clienteSeleccionado: Cliente;
  
  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              public authService : AuthService,
              public modalService: ModalService
              ) { }

  ngOnInit() {
    
    this.activatedRoute.paramMap.subscribe(params =>{
      let page:number = + params.get('page');
      if(!page){
        page=0;
      }
   
    this.clienteService.getClientes(page)
    .pipe(
      tap((response:any) =>{
        (response.content as Cliente[]).forEach(cliente=>{
        });
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[]
      this.paginador= response;
    });
  });
  this.modalService.notificarUpload.subscribe(cliente =>{
    this.clientes = this.clientes.map(clienteOriginal =>{
      if (cliente.id == clienteOriginal.id) {
        clienteOriginal.foto = cliente.foto;
      }
      return clienteOriginal;
    })
  })
  }

  //Eliminar cliente
  delete(cliente: Cliente): void{
  
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancela!'
      }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          () => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
          )
          } 
        )  
       }
    });
  }
  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}