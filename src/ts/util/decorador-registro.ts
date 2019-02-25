export function Registro(target: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const funcionOriginal = descriptor.value;
  if (typeof funcionOriginal === "function") {
    const nuevaFuncion = function(...args) {
      const resultado = funcionOriginal.apply(this, args);
      console.log(`Ejecutando método ${name}(`, ...args, `): ${resultado}`);
      return resultado;
    };
    descriptor.value = nuevaFuncion;
  }
  return descriptor;
}
