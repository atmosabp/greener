FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig*.json ./
COPY vite.config.ts index.html ./
COPY src ./src
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
