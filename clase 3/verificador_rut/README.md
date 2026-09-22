# Verificador de RUT Chileno

Script en Python para validar el Rol Único Tributario (RUT) chileno mediante consola, implementando el algoritmo oficial de **Módulo 11**.

## Características
- **Entrada por consola**: Permite ingresar RUTs de forma interactiva en un bucle continuo.
- **Soporte de formatos**:
  - Con puntos y guion: `11.111.111-1`
  - Sin puntos y con guion: `11111111-1`
  - Sin puntos ni guion: `111111111`
  - Letra K en minúscula o mayúscula: `6-k` o `6-K`
- **Resultados claros**: Indica si el RUT es **CORRECTO** o **INCORRECTO**, explicando el motivo y mostrando el dígito verificador esperado.

## Estructura del proyecto
- `verificador_rut.py`: Script principal interactivo para consola.
- `test_verificador.py`: Pruebas unitarias para validar las funciones del algoritmo.

## Cómo ejecutar

### Ejecutar el verificador interactivo:
```bash
python verificador_rut.py
```

### Ejecutar las pruebas unitarias:
```bash
python -m unittest test_verificador.py
```
