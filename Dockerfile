FROM python:3.11-slim AS backend

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

FROM node:18-alpine AS frontend

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ ./src/
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend /usr/local/bin /usr/local/bin

COPY backend/ ./backend/

COPY --from=frontend /app/node_modules ./node_modules
COPY --from=frontend /app/package*.json ./
COPY --from=frontend /app/src ./src
COPY --from=frontend /app/index.html ./
COPY --from=frontend /app/vite.config.ts ./
COPY --from=frontend /app/tsconfig*.json ./
COPY --from=frontend /app/tailwind.config.js ./
COPY --from=frontend /app/postcss.config.js ./

EXPOSE 8000 5173

RUN echo '#!/bin/bash\n\
echo "Starting backend server..."\n\
cd backend && python app.py &\n\
echo "Starting frontend development server..."\n\
npm run dev -- --host 0.0.0.0\n\
wait' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"] 
