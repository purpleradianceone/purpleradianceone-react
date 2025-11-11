# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Declare Razorpay key argument
ARG VITE_RAZORPAY_API_ID_KEY
ENV VITE_RAZORPAY_API_ID_KEY=$VITE_RAZORPAY_API_ID_KEY

RUN npm install && npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy Vite output (dist) to nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
