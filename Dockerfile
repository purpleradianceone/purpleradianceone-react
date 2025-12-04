# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Env variables
ARG ENV_PROFILE
ENV ENV_PROFILE=$ENV_PROFILE

ARG VITE_RAZORPAY_API_ID_KEY
ENV VITE_RAZORPAY_API_ID_KEY=$VITE_RAZORPAY_API_ID_KEY

ARG VITE_SITE_KEY_OF_CAPTCHA
ENV VITE_SITE_KEY_OF_CAPTCHA=$VITE_SITE_KEY_OF_CAPTCHA

RUN npm install && npm run build -- --mode $ENV_PROFILE

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy Vite output (dist) to nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
