FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig*.json ./
COPY vite.config.ts index.html ./
COPY src ./src

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
