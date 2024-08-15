FROM node:alpine3.18 as build

# Declare build time environment variables
ARG REACT_APP_PUBLISH_KEY
ARG REACT_APP_API_URL

# Set default values for environment variables
ENV REACT_APP_PUBLISH_KEY=$REACT_APP_PUBLISH_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build App
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/build .

EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
