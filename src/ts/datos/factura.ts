import * as moment from "moment";
import { Registro } from "../util/decorador-registro";
import { Imprimible } from "../util/imprimible";
import { Estados } from "./enum-estados";
import { TiposFacturas } from "./enum-tipos-facturas";
import { Cliente } from "./interface-cliente";
import { Proveedor } from "./interface-proveedor";

export class Factura extends Imprimible {

  private fecha: moment.Moment;
  public tipo: TiposFacturas;
  public estado: Estados;

  constructor(
    public id: number,
    public numero: string,
    tipo: string,
    fecha: string,
    public concepto: string,
    public base: number,
    public tipoIVA: number,
    estado: string,
    private cliente?: Cliente,
    private proveedor?: Proveedor,
  ) {
    super();
    this.tipo = TiposFacturas[tipo];
    this.estado = Estados[estado];
    this.fecha = moment(fecha, "DD/MM/YYYY");
  }

  get iva(): number {
    return this.base * (this.tipoIVA / 100);
  }

  get total(): number {
    return this.base + this.iva;
  }

  public getFechaFormateada(formato: string = "DD/MM/YYYY"): string {
    return this.fecha.format(formato);
  }

  public getEstadoFormateado(): string {
    const estado = Estados[this.estado];
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  public getNombreClienteOProveedor(): string {
    return this.tipo === TiposFacturas.ingreso ? this.cliente.nombre : this.proveedor.nombre;
  }

  public isMesActual(): boolean {
    return this.fecha.isSame(moment(), "month");
  }

  public getIdClienteProveedor(): number {
    return this.tipo === TiposFacturas.gasto ? this.proveedor.id : this.cliente.id;
  }
}
