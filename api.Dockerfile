FROM node:18-alpine
WORKDIR /app
COPY api/db.json ./db.json
COPY api/server.js ./server.js
EXPOSE 8000
CMD ["node", "server.js"]
