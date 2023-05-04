import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
    
     id: number;
     descripcion: string;
     observacion: string;
     fecha: Date;
     items: ItemFactura[]=[];
     cliente: Cliente;
     total:number;
     totalAPagar():number{
          this.total=0;
          this.items.forEach((item: ItemFactura)=>{
               this.total += item.calcularImporte();
          });
          return this.total;
     }
}
