# Guia de demostracion - Clase 3

Duracion total sugerida: 15 a 20 minutos de demos. La demo de Redis es opcional.

## Antes de la clase

1. Abrir Docker Desktop.
2. Comprobar el motor:

```powershell
docker info
```

3. Abrir una terminal en la carpeta `docker-demos`.
4. Tener abiertas las diapositivas y este README.
5. Probar las imagenes antes de que llegue la clase si el internet del aula es inestable:

```powershell
docker pull hello-world
docker pull nginx:alpine
docker pull node:20-alpine
docker pull redis:7-alpine
```

## Demo 1 - despues de la comparacion local / VM / contenedor

**Duracion:** 2 minutos.

**Decir:** "Vamos a comprobar que Docker esta funcionando con el ejemplo mas pequeno posible."

```powershell
docker run hello-world
```

**Senalar en la salida:**

- Se encontro o descargo una imagen.
- Se creo un contenedor.
- Se ejecuto un proceso.
- El proceso termino y el contenedor dejo de estar activo.

**Pregunta:** "Cual es la diferencia entre la imagen y el contenedor?"

**Si falla:** ejecutar `docker info`. Si el engine no responde, continuar con las capturas o con la explicacion del Dockerfile; no invertir tiempo reiniciando durante la clase.

## Demo 2 - despues de hablar de ligereza y aislamiento

**Duracion:** 3 minutos.

```powershell
docker run -d --name demo-nginx -p 8080:80 nginx:alpine
docker ps
docker stats --no-stream demo-nginx
```

**Mostrar:** abrir `http://localhost:8080`.

**Decir:** "El contenedor tiene un proceso web escuchando en su puerto 80. El puerto 8080 es la puerta que abrimos en nuestro equipo."

**Comparacion:** mencionar que la cifra observada es del proceso en ese momento. No presentarla como una medicion universal de Docker frente a una VM.

**Limpiar:**

```powershell
docker rm -f demo-nginx
```

## Demo 3 - despues de la diapositiva Que es Docker

**Duracion:** 8 a 10 minutos.

Entrar a la carpeta:

```powershell
cd 03-dockerfile-node
```

Crear o mostrar `index.js`:

```javascript
console.log("Hola clase!");
```

Escribir en vivo este Dockerfile:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "index.js"]
```

Luego construir y ejecutar:

```powershell
docker build -t hola-clase .
docker run --rm hola-clase
```

**Decir mientras se construye:**

- `FROM` selecciona la base.
- `WORKDIR` establece el directorio de trabajo.
- `COPY` mete el codigo en la imagen.
- `CMD` indica que proceso se ejecuta al iniciar el contenedor.

**Relacionar con el diagrama:** "El Dockerfile es la receta; `docker build` produce la imagen; `docker run` crea el contenedor."

**Mostrar la capa resultante:**

```powershell
docker image ls hola-clase
docker history hola-clase
```

Volver a la raiz:

```powershell
cd ..
```

**Pregunta:** "Que pasaria si cambiamos el texto y volvemos a construir?" Esto abre la conversacion sobre capas y cache.

## Demo 4 - despues de Compose / orquestacion

**Duracion:** 5 minutos opcionales.

```powershell
cd 04-compose-redis
docker compose up --build -d
docker compose ps
```

Abrir `http://localhost:8081` y actualizar varias veces.

**Decir:** "La app web y Redis son procesos separados, pero Compose los describe como una sola aplicacion. La app encuentra a Redis usando el nombre del servicio: `redis`."

Comprobar desde la terminal:

```powershell
curl.exe http://localhost:8081
docker compose logs counter
```

Limpiar:

```powershell
docker compose down -v
cd ..
```

## Cierre y puente a la siguiente clase

Mostrar este prompt sin necesidad de ejecutarlo:

> Crea un Dockerfile para esta aplicacion Node.js, usa una imagen Alpine, copia los archivos necesarios, construye la imagen con el nombre `hola-clase` y ejecuta el contenedor. Explica cada instruccion antes de correr comandos.

**Cierre:** "Un agente puede escribir una primera version, pero nosotros validamos la imagen, el proceso, los puertos y los logs."

## Plan B de cinco minutos

Si hay poco tiempo o Docker falla:

1. Ejecutar solo `docker run hello-world`.
2. Mostrar el Dockerfile y explicar sus cuatro instrucciones.
3. Mostrar el prompt del agente.
4. Dejar Compose como material para practicar.

## Limpieza al final

```powershell
docker rm -f demo-nginx 2>$null
docker compose -f 04-compose-redis/docker-compose.yml down -v
```
