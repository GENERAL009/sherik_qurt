FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose port for development
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]



