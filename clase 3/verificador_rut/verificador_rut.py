import itertools
import sys


def limpiar_rut(rut: str) -> str:
    """Limpia el RUT eliminando puntos, guiones y espacios, convirtiendo a mayúsculas."""
    return rut.replace(".", "").replace("-", "").replace(" ", "").upper()


def calcular_digito_verificador(cuerpo: str) -> str:
    """Calcula el dígito verificador usando el algoritmo Módulo 11."""
    multiplicadores = itertools.cycle([2, 3, 4, 5, 6, 7])
    suma = sum(int(digito) * factor for digito, factor in zip(reversed(cuerpo), multiplicadores))
    
    resto = suma % 11
    resultado = 11 - resto
    
    if resultado == 11:
        return "0"
    elif resultado == 10:
        return "K"
    else:
        return str(resultado)


def validar_rut(rut: str) -> tuple[bool, str]:
    """
    Valida si un RUT chileno es correcto.
    Retorna una tupla (es_valido, detalle).
    """
    rut_limpio = limpiar_rut(rut)
    
    if len(rut_limpio) < 2:
        return False, "El RUT ingresado es demasiado corto."
        
    cuerpo = rut_limpio[:-1]
    dv_ingresado = rut_limpio[-1]
    
    if not cuerpo.isdigit():
        return False, "El cuerpo del RUT solo debe contener números."
        
    if dv_ingresado not in "0123456789K":
        return False, "El dígito verificador debe ser un número del 0 al 9 o la letra K."
        
    dv_calculado = calcular_digito_verificador(cuerpo)
    
    if dv_ingresado == dv_calculado:
        return True, f"RUT correcto (DV esperado: {dv_calculado})."
    else:
        return False, f"RUT incorrecto. El dígito verificador esperado era '{dv_calculado}', pero se ingresó '{dv_ingresado}'."


def formatear_rut(rut: str) -> str:
    """Formatea un RUT en el estándar XX.XXX.XXX-X."""
    rut_limpio = limpiar_rut(rut)
    if len(rut_limpio) < 2:
        return rut
    cuerpo = rut_limpio[:-1]
    dv = rut_limpio[-1]
    
    try:
        cuerpo_formateado = f"{int(cuerpo):,}".replace(",", ".")
        return f"{cuerpo_formateado}-{dv}"
    except ValueError:
        return rut


def main():
    print("=" * 45)
    print("       VERIFICADOR DE RUT CHILENO")
    print("=" * 45)
    print("Formatos aceptados: 12.345.678-K, 12345678-K, 12345678K")
    print("Escribe 'salir' para terminar el programa.\n")
    
    while True:
        try:
            entrada = input("Ingrese el RUT a verificar: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nPrograma finalizado.")
            break
            
        if not entrada:
            print("Por favor, ingrese un RUT válido.\n")
            continue
            
        if entrada.lower() in ("salir", "exit", "q"):
            print("Hasta luego!")
            break
            
        es_valido, detalle = validar_rut(entrada)
        
        if es_valido:
            print("-> Resultado: CORRECTO")
            print(f"   RUT formateado: {formatear_rut(entrada)}")
            print(f"   Detalle: {detalle}\n")
        else:
            print("-> Resultado: INCORRECTO")
            print(f"   Motivo: {detalle}\n")


if __name__ == "__main__":
    main()
