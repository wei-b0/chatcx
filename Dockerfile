FROM node:22.13.1-bullseye

WORKDIR /app

RUN mkdir -p /app/data && chmod 777 /app/data

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm rebuild @roamhq/wrtc || echo "⚠️ wrtc rebuild failed, continuing..."

ENV COOKIE_STORAGE_PATH="/app/data"

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 7886

CMD ["pnpm", "start"]
