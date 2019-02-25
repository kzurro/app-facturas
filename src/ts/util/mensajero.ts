import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

interface Mensaje {
  tema: string;
  contenido: string;
}

class Mensajero {
  private mensajero: BehaviorSubject<Mensaje> = new BehaviorSubject({ tema: "", contenido: "" });

  public escucha(tema: string): Observable<Mensaje> {
    return this.mensajero.asObservable().pipe(
      filter(mensaje => mensaje.tema === tema),
    );
  }

  public emite(mensaje: Mensaje): void {
    console.log("Mensaje emitido:", mensaje);
    this.mensajero.next(mensaje);
  }
}

export const mensajero = new Mensajero();
