import { Cliente } from "./interface-cliente";
import { Proveedor } from "./interface-proveedor";

export interface FacturaJSON {
  id: number;
  numero: string;
  tipo: string;
  fecha: string;
  concepto: string;
  cliente?: Cliente;
  proveedor?: Proveedor;
  base: number;
  tipoIVA: number;
  estado: string;
}
