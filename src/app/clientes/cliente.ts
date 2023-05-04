import { Factura } from "../facturas/models/factura";
import { Ciudad } from "./ciudad";

export class Cliente {
    
    id: number;
    nombre: string;
    apellido: string;
    fecha: string;
    email: string;
    foto?: string;
    ciudad: Ciudad;
    facturas: Factura[]=[];
}
