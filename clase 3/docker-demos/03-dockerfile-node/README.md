# Demo 3: crear una imagen con Dockerfile

Esta carpeta contiene la version preparada para mostrar en vivo. Para escribirla desde cero, usa este orden:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "index.js"]
```

El Dockerfile guardado separa la copia de `package.json` y `index.js` para que la explicacion sea mas clara y la imagen no incorpore archivos innecesarios.

## Ejecutar

```bash
docker build -t hola-clase .
docker run --rm hola-clase
```

Salida esperada:

```text
Hola clase!
```

## Inspeccionar la imagen

```bash
docker image ls hola-clase
docker history hola-clase
```

## Puntos para explicar

- `FROM` selecciona la imagen base.
- `WORKDIR` fija la carpeta actual dentro de la imagen.
- `COPY` agrega archivos al sistema de archivos de la imagen.
- `CMD` define el proceso por defecto del contenedor.
- `docker build` crea una imagen con capas.
- `docker run` crea una instancia efimera de esa imagen.
