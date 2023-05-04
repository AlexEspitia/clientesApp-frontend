import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint: string = "http://localhost:8080/api/facturas";

  constructor(private http: HttpClient,
    private router: Router,) { }

    getfacturas(id:number): Observable<Factura> {
      return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
    }
     /**
  * @return metodo para eliminar factura
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`)
  }

  filtrarProducto(name: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndPoint}/productos/${name}`)
  }

  /**
  * @return metodo POST para crear factura
  * @author Alexander Espitia <paespitia6@outlook.com> 2022-12-01
  */
   public createFactura(factura: Factura){
    return this.http.post<Factura>(`${this.urlEndPoint}`, factura);
  }

}
