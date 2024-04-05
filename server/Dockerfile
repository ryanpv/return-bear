FROM node:latest
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run dev
EXPOSE 8080
CMD ["node", "dist/servers.js"]