FROM node:22.13.1-bullseye

WORKDIR /app

RUN mkdir -p /app/data && chmod 777 /app/data

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

ENV NODE_PATH="/app/node_modules"
ENV LD_LIBRARY_PATH="/app/node_modules/.pnpm/@roamhq+wrtc-linux-x64@0.8.1/node_modules/@roamhq/wrtc-linux-x64"

ENV COOKIE_STORAGE_PATH="/app/data"

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 7886

CMD ["pnpm", "start"]
