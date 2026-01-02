# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM nginx:alpine

# Vite default build çıktısı: dist
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
