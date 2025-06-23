# --- Build Stage ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# --- Serve Stage ---
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
