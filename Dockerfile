FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro (aproveita cache do Docker)
COPY package.json ./
RUN npm install

# Copia o restante do código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
