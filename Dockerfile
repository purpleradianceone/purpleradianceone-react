# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve via Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# If using custom config:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
