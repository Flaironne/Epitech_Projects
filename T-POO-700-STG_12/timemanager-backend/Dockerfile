# Utiliser une image Elixir officielle
FROM elixir:1.14-alpine

# Installer les dépendances du système
RUN apk update && \
    apk add --no-cache build-base npm git inotify-tools

# Installer Hex et Rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application
COPY . .

# Installer les dépendances Elixir
# RUN mix deps.get

# Compiler l'application
# RUN mix compile

# Exposer le port de l'application Phoenix
EXPOSE 4000

# Commande pour démarrer l'application
CMD ["sh", "-c", "mix deps.get && mix ecto.migrate && mix run priv/repo/seeds.exs && mix phx.server"]
