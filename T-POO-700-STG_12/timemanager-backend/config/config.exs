import Config

# Charger les variables d'environnement depuis le fichier .env

config :timemanager,
  ecto_repos: [Timemanager.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configuration du signer par défaut pour Joken
config :joken,
  default_signer: %{
    alg: "HS256",
    key: System.get_env("SECRET_KEY_BASE")
  }

# Configures the endpoint
config :timemanager, TimemanagerWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [json: TimemanagerWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Timemanager.PubSub,
  live_view: [signing_salt: "LO5iEqJ1"]

# Configures the mailer
config :timemanager, Timemanager.Mailer, adapter: Swoosh.Adapters.Local

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  timemanager: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.3",
  timemanager: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
