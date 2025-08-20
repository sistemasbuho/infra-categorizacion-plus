FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Verificación de que el build fue exitoso
RUN echo "=== VERIFICANDO CONTENIDO DE DIST ==="
RUN ls -la /app/dist/
RUN echo "=== ARCHIVOS EN DIST ==="
RUN find /app/dist -type f

FROM nginx:stable-alpine

# Solución: Copiar con slash al final (solución conocida para este error)
COPY --from=builder /app/dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificación de que los archivos se copiaron correctamente
RUN echo "=== CONTENIDO EN NGINX ==="
RUN ls -la /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]