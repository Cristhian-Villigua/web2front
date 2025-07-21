# --- Etapa de Construcción (Build Stage) ---
# Usamos una imagen base de Node.js para construir nuestra aplicación
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json (o yarn.lock)
# antes de instalar dependencias para aprovechar el cache de Docker
COPY package.json package-lock.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Construimos la aplicación de React para producción
# El comando 'npm run build' generará los archivos estáticos en la carpeta 'dist'
RUN npm run build

# --- Etapa de Producción (Production Stage) ---
# Usamos una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copiamos los archivos de construcción generados desde la etapa 'builder'
# al directorio de Nginx donde se sirven los archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# Eliminamos la configuración por defecto de Nginx para usar nuestra propia (opcional, pero buena práctica)
# RUN rm /etc/nginx/conf.d/default.conf

# Opcional: Si necesitas una configuración específica de Nginx, puedes crear un archivo
# 'nginx.conf' en la raíz de tu proyecto y copiarlo así:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx cuando el contenedor se inicie
CMD ["nginx", "-g", "daemon off;"]