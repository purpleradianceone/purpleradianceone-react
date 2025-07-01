# Stage 1: Build
#FROM node:18-alpine AS builder

#WORKDIR /app
#COPY . .
#RUN npm install && npm run build

# Stage 2: Serve with NGINX
#FROM nginx:alpine

# Copy Vite output (dist) to nginx public folder
#COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA
#COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

#FROM alpine/git as final_builder
#COPY --from=builder /app/dist /app/dist
