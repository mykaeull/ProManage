# Use a imagem oficial do Node.js
FROM node:20

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação usa
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
