FROM node:22.13.1-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y \
  wget curl ca-certificates fonts-liberation libasound2 \
  libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
  libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxfixes3 \
  libxi6 libxrandr2 libxss1 libxtst6 xdg-utils \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/data && chmod 777 /app/data

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm rebuild wrtc

ENV COOKIE_STORAGE_PATH="/app/data"

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 7886

CMD ["pnpm", "start"]
