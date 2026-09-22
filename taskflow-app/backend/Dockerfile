FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar dependencias primero para aprovechar el cache de capas de Docker
COPY package*.json ./
RUN npm install --production

# Copiar el código fuente
COPY . .

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["npm", "start"]
