import "../scss/main.scss";
import { ControladorFacturas } from "./datos/controlador-facturas";
import { VistaFacturas } from "./datos/vista-facturas";
import { mensajero } from "./util/mensajero";

const CFacturas = new ControladorFacturas();
mensajero.escucha("facturas").subscribe({
  next: mensaje => {
    if (mensaje.contenido === "carga-inicial") {
      const VFacturas = new VistaFacturas(CFacturas);
    }
  },
});
