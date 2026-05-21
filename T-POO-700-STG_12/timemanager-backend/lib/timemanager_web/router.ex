defmodule TimemanagerWeb.Router do
  use TimemanagerWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticated do
    plug TimemanagerWeb.Plugs.VerifyToken
  end

  pipeline :user_access do
    plug TimemanagerWeb.Plugs.VerifyToken, roles: ["user", "manager", "manager_general", "admin"]
  end

  pipeline :manager_access do
    plug TimemanagerWeb.Plugs.VerifyToken, roles: ["manager", "manager_general", "admin"]
  end

  pipeline :manager_general_access do
    plug TimemanagerWeb.Plugs.VerifyToken, roles: ["manager_general", "admin"]
  end

  pipeline :admin_access do
    plug TimemanagerWeb.Plugs.VerifyToken, roles: ["admin"]
  end

  scope "/api", TimemanagerWeb do
    pipe_through :api

    post "/login", UserController, :login  # Route pour le login : accessible sans identification
    post "/register", UserController, :register  # Route pour le register : accessible sans identification

    # Utilisez la pipeline `authenticated` pour sécuriser les routes suivantes
    pipe_through :authenticated

    # Route pour récupérer les informations de l'utilisateur connecté
    get "/me", UserController, :me

    # Routes pour les clocks
    scope "/clocks" do
      pipe_through :user_access
      get "/", ClockController, :list_all
      post "/:user_id", ClockController, :create
    end

    scope "/clocks/:user_id" do
      pipe_through :user_access
      get "/", ClockController, :index
      get "/last", ClockController, :last_user_clock
      get "/:clock_id", ClockController, :show
      get "/last", ClockController, :last_user_clock
    end

    scope "/clocks/:clock_id" do
      pipe_through :admin_access
      put "/", ClockController, :update
      delete "/", ClockController, :delete
    end

    # Routes pour les workingtimes
    scope "/workingtimes" do
      pipe_through :user_access
      get "/", WorkingTimeController, :list_all
    end

    scope "/workingtimes/:user_id" do
      pipe_through :user_access
      get "/", WorkingTimeController, :index
    end

    scope "/workingtimes/:user_id" do
      pipe_through :manager_access
      post "/", WorkingTimeController, :create
    end

    scope "/workingtimes/:user_id/:workingtime_id" do
      pipe_through :user_access
      get "/", WorkingTimeController, :show
    end

    scope "/workingtimes/:workingtime_id" do
      pipe_through :manager_access
      put "/", WorkingTimeController, :update
      delete "/", WorkingTimeController, :delete
    end

    # Routes pour les utilisateurs
    scope "/users" do
      pipe_through :user_access
      get "/:id", UserController, :show
      put "/:id", UserController, :update  # Users and managers can only update themselves
      delete "/:id", UserController, :delete  # Users and managers can only delete themselves
    end

    scope "/users" do
      pipe_through :manager_access
      get "/", UserController, :index_managed_users  # Managers peuvent lister les utilisateurs qui leur sont associés
    end

    scope "/users" do
      pipe_through :manager_general_access
      put "/:id", UserController, :update  # Managers généraux peuvent mettre à jour d'autres utilisateurs
    end

    scope "/users" do
      pipe_through :admin_access
      resources "/", UserController, except: [:new, :edit]  # Admins ont accès à toutes les actions CRUD
    end
  end

  if Application.compile_env(:timemanager, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: TimemanagerWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
