# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy the CRA build output to nginx's html folder
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: custom nginx config for SPA
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration template
# NOTE: The official Nginx Docker image automatically runs `envsubst`
# on files in /etc/nginx/templates/ to replace variables.
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template


EXPOSE 80 443

# Replace env variables at runtime and start nginx
#CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
 CMD ["/bin/sh", "-c", "envsubst '$MAIN_DOMAIN' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
