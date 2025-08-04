# Use Python 3.11 slim image for backend
FROM python:3.11-slim AS backend

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Use Node.js 18 for frontend
FROM node:18-alpine AS frontend

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy frontend source code
COPY src/ ./src/
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Use a lightweight image for the final stage
FROM python:3.11-slim

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python dependencies from backend stage
COPY --from=backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend /usr/local/bin /usr/local/bin

# Copy backend code
COPY backend/ ./backend/

# Copy frontend files from frontend stage
COPY --from=frontend /app/node_modules ./node_modules
COPY --from=frontend /app/package*.json ./
COPY --from=frontend /app/src ./src
COPY --from=frontend /app/index.html ./
COPY --from=frontend /app/vite.config.ts ./
COPY --from=frontend /app/tsconfig*.json ./
COPY --from=frontend /app/tailwind.config.js ./
COPY --from=frontend /app/postcss.config.js ./

# Expose ports
EXPOSE 8000 5173

# Create a startup script
RUN echo '#!/bin/bash\n\
echo "Starting backend server..."\n\
cd backend && python app.py &\n\
echo "Starting frontend development server..."\n\
npm run dev -- --host 0.0.0.0\n\
wait' > /app/start.sh && chmod +x /app/start.sh

# Set the default command
CMD ["/app/start.sh"] 