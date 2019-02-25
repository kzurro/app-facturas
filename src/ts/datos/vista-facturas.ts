import { mensajero } from "../util/mensajero";
import { ControladorFacturas } from "./controlador-facturas";
import { Estados } from "./enum-estados";
import { TiposFacturas } from "./enum-tipos-facturas";
import { tiposIVA } from "./enum-tipos-iva";

export class VistaFacturas {
  private HTML: any = {};

  constructor(private CFacturas: ControladorFacturas) {
    this.cargaHTML();
    this.pintaN();
    this.pintaLista(TiposFacturas.ingreso);
    this.pintaLista(TiposFacturas.gasto);
    this.pintaEstadisticas();
    this.pintaListaClientesProveedores();
    this.escucharMensajes();
  }

  private cargaHTML(): void {
    this.HTML.nFacturas = document.querySelector(".n-facturas");
    this.HTML.nIngresos = document.querySelector(".ingresos .n-facturas");
    this.HTML.nGastos = document.querySelector(".gastos .n-facturas");
    this.HTML.listaIngresos = document.querySelector(".ingresos .listado tbody");
    this.HTML.ingresos = this.HTML.listaIngresos.querySelectorAll("tr");
    this.HTML.listaGastos = document.querySelector(".gastos .listado tbody");
    this.HTML.gastos = this.HTML.listaGastos.querySelectorAll("tr");
    this.HTML.facturaBase = document.querySelector(".factura-base");
    this.HTML.totalesIngresos = document.querySelector(".ingresos .totales");
    this.HTML.totalesGastos = document.querySelector(".gastos .totales");
    this.HTML.nImpresiones = document.querySelector(".impresiones");
    this.HTML.popup = document.querySelector(".lightbox");
    this.HTML.textoPopup = document.querySelector(".lightbox-contenido");
    this.HTML.estadisticas = document.querySelector(".estadisticas");
    this.HTML.estadisticas.ingresos = this.HTML.estadisticas.querySelector(".estadisticas-ingresos");
    this.HTML.estadisticas.gastos = this.HTML.estadisticas.querySelector(".estadisticas-gastos");
    this.HTML.listaClientesProveedores = document.querySelector(".clientes-proveedores");
    this.HTML.clienteProveedorBase = document.querySelector(".cliente-proveedor-base");
    this.HTML.clienteProveedor = this.HTML.listaClientesProveedores.querySelectorAll("li");
  }

  private pintaN(): void {
    this.HTML.nFacturas.textContent = this.CFacturas.getNFacturas();
    this.HTML.nIngresos.textContent = this.CFacturas.getFacturasPorTipo(TiposFacturas.ingreso).length;
    this.HTML.nGastos.textContent = this.CFacturas.getFacturasPorTipo(TiposFacturas.gasto).length;
  }

  private pintaLista(tipo: TiposFacturas): void {
    this.limpiaLista(tipo);
    const lista = (tipo === TiposFacturas.gasto ? this.HTML.listaGastos : this.HTML.listaIngresos) as HTMLElement;
    for (const factura of this.CFacturas.getFacturasPorTipo(tipo)) {
      const nuevoItem = this.HTML.facturaBase.cloneNode(true);
      nuevoItem.querySelector(".numero").textContent = factura.numero;
      nuevoItem.querySelector(".fecha").textContent = factura.getFechaFormateada();
      nuevoItem.querySelector(".concepto").textContent = factura.concepto;
      nuevoItem.querySelector(".cliente-proveedor").textContent = factura.getNombreClienteOProveedor();
      nuevoItem.querySelector(".base").textContent = `${factura.base.toFixed(2)}€`;
      nuevoItem.querySelector(".iva").textContent = `${factura.iva.toFixed(2)}€`;
      nuevoItem.querySelector(".iva-porcentaje").textContent = factura.tipoIVA;
      nuevoItem.querySelector(".total").textContent = `${factura.total.toFixed(2)}€`;
      nuevoItem.querySelector(".estado").textContent = factura.getEstadoFormateado();
      nuevoItem.querySelector(".estado").classList.add(factura.estado === Estados.abonada ? "table-success" : "table-danger");
      nuevoItem.querySelector(".imprimir").addEventListener("click", (e: Event) => {
        e.preventDefault();
        this.abrirPopup("Imprimiendo...");
        factura.imprimir("EPSON 1000");
        /*factura.imprimir("EPSON 1000", () => {
          this.cerrarPopup("Impresión finalizada");
          this.actualizaNImpresiones();
        });*/
      });
      lista.appendChild(nuevoItem);
    }
    this.pintaTotalesPorTipo(tipo);
  }

  private abrirPopup(msj: string): void {
    this.HTML.popup.classList.add("on");
    this.HTML.textoPopup.textContent = msj;
  }

  private cerrarPopup(msj: string): void {
    this.HTML.textoPopup.textContent = msj;
    setTimeout(() => {
      this.HTML.popup.classList.remove("on");
    }, 1000);
  }

  private actualizaNImpresiones(): void {
    this.HTML.nImpresiones.textContent = this.CFacturas.getFacturasImpresas();
  }

  private pintaTotalesPorTipo(tipo: TiposFacturas): void {
    const totales = this.CFacturas.getTotales(tipo);
    const elemHTML = this.HTML[tipo === TiposFacturas.ingreso ? "totalesIngresos" : "totalesGastos"];
    elemHTML.querySelector(".base").textContent = `${totales.base.toFixed(2)}€`;
    elemHTML.querySelector(".iva").textContent = `${totales.iva.toFixed(2)}€`;
    elemHTML.querySelector(".total").textContent = `${totales.total.toFixed(2)}€`;
  }

  private limpiaLista(tipo: TiposFacturas): void {
    const listaItems = this.HTML[TiposFacturas[tipo] + "s"];
    for (const item of listaItems) {
      item.remove();
    }
  }

  private escucharMensajes(): void {
    mensajero.escucha("impresion").subscribe({
      next: mensaje => {
        if (mensaje.contenido === "finalizada") {
          this.cerrarPopup("Impresión finalizada");
          this.actualizaNImpresiones();
        }
      },
    });
  }

  private pintaEstadisticas(): void {
    this.actualizaNImpresiones();
    this.HTML.estadisticas.ingresos.querySelector(".pendiente").textContent = this.CFacturas.getPendienteCobrarPorTipo(TiposFacturas.ingreso).toFixed(2) + "€";
    this.HTML.estadisticas.gastos.querySelector(".pendiente").textContent = this.CFacturas.getPendienteCobrarPorTipo(TiposFacturas.gasto).toFixed(2) + "€";
    this.HTML.estadisticas.ingresos.querySelector(".n-facturas-general").textContent = this.CFacturas.getNFacturasPorTipoIVA(TiposFacturas.ingreso, tiposIVA.general);
    this.HTML.estadisticas.gastos.querySelector(".n-facturas-general").textContent = this.CFacturas.getNFacturasPorTipoIVA(TiposFacturas.gasto, tiposIVA.general);
    this.HTML.estadisticas.ingresos.querySelector(".n-facturas-reducido").textContent = this.CFacturas.getNFacturasPorTipoIVA(TiposFacturas.ingreso, tiposIVA.reducido);
    this.HTML.estadisticas.gastos.querySelector(".n-facturas-reducido").textContent = this.CFacturas.getNFacturasPorTipoIVA(TiposFacturas.gasto, tiposIVA.reducido);
    this.HTML.estadisticas.ingresos.querySelector(".n-facturas-superreducido").textContent = this.CFacturas.getNFacturasPorTipoIVA(TiposFacturas.ingreso, tiposIVA.superreducido);
    this.HTML.estadisticas.gastos.querySelector(".n-facturas-superreducido").textContent = this.CFacturas.getNFacturasPorTipoIVA(TiposFacturas.gasto, tiposIVA.superreducido);
    const balance = this.CFacturas.getBalance();
    this.HTML.estadisticas.querySelector(".balance").textContent = `${balance.toFixed(2)}€`;
    this.HTML.estadisticas.querySelector(".balance").classList.add(balance >= 0 ? "balance-positivo" : "balance-negativo");
    this.HTML.estadisticas.querySelector(".factura-cara").textContent = this.CFacturas.getNumeroFacturaMasCara();
    this.HTML.estadisticas.querySelector(".factura-barata").textContent = this.CFacturas.getNumeroFacturaMasBarata();
    this.HTML.estadisticas.querySelector(".n-facturas-mes").textContent = this.CFacturas.getNEmitidasMes();
  }

  private pintaListaClientesProveedores(): void {
    this.limpiarListaClientesProveedores();
    const clientesProveedores = this.CFacturas.getNombresClientesProveedores();
    const lista = this.HTML.listaClientesProveedores as HTMLElement;
    for (const clienteProveedor of clientesProveedores) {
      const nuevoItem = this.HTML.clienteProveedorBase.cloneNode(true);
      nuevoItem.querySelector(".cliente-proveedor-nombre").textContent = clienteProveedor.nombre;
      nuevoItem.querySelector(".cliente-proveedor-n-facturas").textContent = clienteProveedor.nFacturas;
      lista.appendChild(nuevoItem);
    }
  }

  private limpiarListaClientesProveedores(): void {
    for (const item of this.HTML.clienteProveedor) {
      item.remove();
    }
  }
}
