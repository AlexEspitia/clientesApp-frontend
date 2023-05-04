import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import { Cliente } from './cliente';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Ciudad } from './ciudad';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = "http://localhost:8080/api/clientes";

  constructor(private http: HttpClient,
    private router: Router,
    ) { }


  getCiudades(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.urlEndPoint + '/ciudades')
  }

  /**
  * @return metodo GET para listar clientes
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  getClientes(page: number): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      
      map((response: any) => {
      (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let dataPipe = new DatePipe('es-CO');
          cliente.fecha = dataPipe.transform(cliente.fecha, 'fullDate')
          return cliente;
        });
        return response;
      }),
    );
  }
  /**
  * @return metodo POST para crear cliente
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.estatus == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje)
        }
        return throwError(e);
      }));
  }

  /**
  * @return metodo GET para buscar cliente por id
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  getCliente(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes'])
          console.error(e.error.mensaje)
        }
        
        return throwError(e);
      })
    );
  }

  /**
  * @return metodo PUT para actualizar cliente
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  update(cliente: Cliente): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.estatus == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }

  /**
  * @return metodo para eliminar cliente
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }
  /**
  * @return metodo para subir la imagen
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    let data = new FormData();
    data.append("archivo", archivo);
    data.append("id", id);

    //para ver la barra de progreso de subida
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, data, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}


