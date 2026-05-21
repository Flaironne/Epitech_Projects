defmodule TimemanagerWeb.ClockController do
  use TimemanagerWeb, :controller

  alias Timemanager.TimeTracking
  alias Timemanager.TimeTracking.Clock

  action_fallback TimemanagerWeb.FallbackController

  # Lister toutes les clocks
  def list_all(conn, _params) do
    clocks = TimeTracking.list_clocks()
    render(conn, "index.json", clocks: clocks)
  end

  # Lister toutes les clocks d'un utilisateur spécifique
  def index(conn, %{"user_id" => user_id}) do
    clocks = TimeTracking.list_clocks_by_user(user_id)
    render(conn, "index.json", clocks: clocks)
  end

  # Créer une nouvelle clock pour un utilisateur spécifique
  def create(conn, %{"user_id" => user_id, "clock" => clock_params}) do
    clock_params = Map.put(clock_params, "user_id", user_id)

    with {:ok, %Clock{} = clock} <- TimeTracking.create_clock(clock_params) do
      conn
      |> put_status(:created)
      |> render("show.json", clock: clock)
    end
  end

   # Obtenir la dernière clock d'un utilisateur spécifique
   def last_user_clock(conn, %{"user_id" => user_id}) do
    clock = TimeTracking.get_last_clock(user_id)
    render(conn, "show.json", clock: clock)
  end

  # Obtenir une clock spécifique pour un utilisateur spécifique
  def show(conn, %{"user_id" => user_id, "clock_id" => clock_id}) do
    clock = TimeTracking.get_clock_by_user!(user_id, clock_id)
    render(conn, "show.json", clock: clock)
  end

  # Mettre à jour une clock spécifique
  def update(conn, %{"clock_id" => clock_id, "clock" => clock_params}) do
    clock = TimeTracking.get_clock!(clock_id)

    with {:ok, %Clock{} = clock} <- TimeTracking.update_clock(clock, clock_params) do
      render(conn, "show.json", clock: clock)
    end
  end

  # Supprimer une clock spécifique
  def delete(conn, %{"clock_id" => clock_id}) do
    clock = TimeTracking.get_clock!(clock_id)

    with {:ok, %Clock{}} <- TimeTracking.delete_clock(clock) do
      send_resp(conn, :no_content, "")
    end
  end


end
