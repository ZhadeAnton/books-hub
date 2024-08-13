FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g typescript prisma
RUN npm run prisma:generate
EXPOSE 6600
CMD ["npm", "run", "dev"]
