import { mensajero } from "./mensajero";

export abstract class Imprimible {
  public impresiones = 0;

  public imprimir(impresora: string): void {
    console.log(`Factura imprimiéndose por la impresora ${impresora}`);
    setTimeout(() => {
      this.impresiones++;
      console.log("Impresión finalizada");

      mensajero.emite({ tema: "impresion", contenido: "finalizada" });
    }, 1000);
  }

  /*public imprimir(impresora: string, callback?: () => void): void {
    console.log(`Factura imprimiéndose por la impresora ${impresora}`);
    setTimeout(() => {
      this.impresiones++;
      if (callback) {
        callback();
      }
      console.log("Impresión finalizada");
    }, 1000);
  }*/
}
