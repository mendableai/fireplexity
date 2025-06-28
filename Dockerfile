# Usa una imagen base de Node.js 20
FROM node:20-alpine AS base

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias necesarias para la compilación
RUN apk add --no-cache libc6-compat

# Copia los archivos de manifiesto del paquete e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
