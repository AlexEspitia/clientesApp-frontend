import { HttpEventType } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'perfil-cliente',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @Input() cliente: Cliente;

  title: string = "Datos del Cliente";
  public fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
    public authService: AuthService,
    public modalService: ModalService,
    public facturaService: FacturaService
     ) { }

  ngOnInit(): void {
  }
/**
* @return metodo seleccionar la imagen
* @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
*/
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error seleccionar imagen','El archivo debe ser de tipo img','error');
      this.fotoSeleccionada = null;
    }
  }
/**
* @return metodo subir la imagen
* @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
*/
  subirFoto(){
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload','Error debe seleccionar una foto','error');
    }else{
    this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(event =>{
      if (event.type === HttpEventType.UploadProgress) {
        this.progreso = Math.round((event.loaded / event.total) * 100);
      }else if(event.type === HttpEventType.Response){
        let response: any = event.body;
        this.cliente = response.cliente as Cliente;

        this.modalService.notificarUpload.emit(this.cliente)
        Swal.fire('La imagen se ha subido correctamente!',response.mensaje,'success');
      }
    });
  }
}
cerrarModal(){
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null;
  this.progreso = 0;
}
delete(factura:Factura):void{
  Swal.fire({
    title: 'Está seguro?',
    text: `¿Seguro desea eliminar la factura ${factura.descripcion}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, cancela!'
    }).then((result) => {
    if (result.value) {
      this.facturaService.delete(factura.id).subscribe(
        () => {
          this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
          Swal.fire(
            'Factura Eliminado!',
            `Factura ${factura.descripcion} eliminada con éxito.`,
            'success'
        )
        } 
      )  
     }
  });
}
}
