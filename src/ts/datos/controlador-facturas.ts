import axios from "axios";
import { Registro } from "../util/decorador-registro";
import { mensajero } from "../util/mensajero";
import { Estados } from "./enum-estados";
import { TiposFacturas } from "./enum-tipos-facturas";
import { Factura } from "./factura";
import { FacturaJSON } from "./interface-factura-json.js";

export class ControladorFacturas {
  private facturas: Factura[] = [];
  private facturasGastos: Factura[];
  private facturasIngresos: Factura[];

  constructor() {
    this.cargaFacturas();
  }

  private cargaFacturas(): void {
    axios.get<FacturaJSON[]>("http://localhost:3000/facturas").then(
      respuesta => {
        const facturasJSON = respuesta.data;
        for (const factura of facturasJSON) {
          const nuevaFactura = new Factura(
            factura.id,
            factura.numero,
            factura.tipo,
            factura.fecha,
            factura.concepto,
            factura.base,
            factura.tipoIVA,
            factura.estado,
            factura.cliente,
            factura.proveedor,
          );
          this.facturas.push(nuevaFactura);
        }
        this.dividirFacturasPorTipo();
        mensajero.emite({ tema: "facturas", contenido: "carga-inicial" });
      },
    );
  }

  private dividirFacturasPorTipo(): void {
    this.facturasIngresos = this.facturas.filter(factura => factura.tipo === TiposFacturas.ingreso);
    this.facturasGastos = this.facturas.filter(factura => factura.tipo === TiposFacturas.gasto);
  }

  public getFacturasPorTipo(tipo: TiposFacturas): Factura[] {
    return tipo === TiposFacturas.ingreso ? this.facturasIngresos : this.facturasGastos;
  }

  public getNFacturas(): number {
    return this.facturas.length;
  }

  public getTotales(tipo: TiposFacturas) {
    return this.getFacturasPorTipo(tipo).reduce((acum, factura) => {
      return {
        base: acum.base + factura.base,
        iva: acum.iva + factura.iva,
        total: acum.total + factura.total,
      };
    }, {
        base: 0,
        iva: 0,
        total: 0,
      });
  }

  public getFacturasImpresas(): number {
    return this.facturas.reduce((acum, factura) => acum + factura.impresiones, 0);
  }

  public getPendienteCobrarPorTipo(tipo: TiposFacturas): number {
    return this.getFacturasPorTipo(tipo).filter(factura => factura.estado === Estados.pendiente).reduce((acum, factura) => acum + factura.base, 0);
  }

  @Registro
  public getNFacturasPorTipoIVA(tipo: TiposFacturas, tipoIVA: number): number {
    return this.getFacturasPorTipo(tipo).filter(factura => factura.tipoIVA === tipoIVA).length;
  }

  public getBalance(): number {
    return this.getTotales(TiposFacturas.ingreso).base - this.getTotales(TiposFacturas.gasto).base;
  }

  public getNumeroFacturaMasCara(): string {
    const facturaMasCara = this.facturas.reduce((acum, factura) => acum.base >= factura.base ? acum : { base: factura.base, numero: factura.numero }, { base: 0, numero: "" });
    return facturaMasCara.numero;
  }

  public getNumeroFacturaMasBarata(): string {
    const facturaMasBarata = this.facturas.reduce((acum, factura) => acum.base < factura.base ? acum : { base: factura.base, numero: factura.numero }, { base: Number.POSITIVE_INFINITY, numero: "" });
    return facturaMasBarata.numero;
  }

  public getNEmitidasMes(): number {
    return this.facturas.filter(factura => factura.isMesActual()).length;
  }

  public getNombresClientesProveedores() {
    const nombres = this.facturas.map(factura => {
      return {
        nombre: factura.getNombreClienteOProveedor(),
        nFacturas: this.getNFacturasPorClienteProveedor(factura.getIdClienteProveedor()),
      };
    });
    return nombres.filter((nombre, indice, listaNombres) => listaNombres.findIndex(item => item.nombre === nombre.nombre && item.nFacturas === nombre.nFacturas) === indice);
  }

  private getNFacturasPorClienteProveedor(id: number): number {
    return this.facturas.filter(factura => factura.getIdClienteProveedor() === id).length;
  }
}
