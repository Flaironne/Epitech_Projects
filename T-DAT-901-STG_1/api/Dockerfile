FROM node:20

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 8000
CMD ["pnpm", "run", "dev"]