defmodule TimemanagerWeb.WorkingTimeController do
  use TimemanagerWeb, :controller

  alias Timemanager.TimeTracking
  alias Timemanager.TimeTracking.WorkingTime

  action_fallback TimemanagerWeb.FallbackController


  # Lister toutes les working times
  def list_all(conn, _params) do
    workingtimes = TimeTracking.list_workingtimes()
    render(conn, "index.json", workingtimes: workingtimes)
  end

  # Lister toutes les working times d'un utilisateur spécifique
  def index(conn, %{"user_id" => user_id}) do
    workingtimes = TimeTracking.list_workingtimes_by_user(user_id)
    render(conn, "index.json", workingtimes: workingtimes)
  end

  # Créer une nouvelle working time pour un utilisateur spécifique
  def create(conn, %{"user_id" => user_id, "working_time" => working_time_params}) do
    working_time_params = Map.put(working_time_params, "user_id", user_id)

    with {:ok, %WorkingTime{} = working_time} <- TimeTracking.create_working_time(working_time_params) do
      conn
      |> put_status(:created)
      |> render("show.json", working_time: working_time)
    end
  end

  # Obtenir une working time spécifique pour un utilisateur spécifique
  def show(conn, %{"user_id" => user_id, "workingtime_id" => workingtime_id}) do
    working_time = TimeTracking.get_working_time_by_user!(user_id, workingtime_id)
    render(conn, "show.json", working_time: working_time)
  end

  # Mettre à jour une working time spécifique
  def update(conn, %{"workingtime_id" => workingtime_id, "working_time" => working_time_params}) do
    working_time = TimeTracking.get_working_time!(workingtime_id)

    with {:ok, %WorkingTime{} = working_time} <- TimeTracking.update_working_time(working_time, working_time_params) do
      render(conn, "show.json", working_time: working_time)
    end
  end

  # Supprimer une working time spécifique
  def delete(conn, %{"workingtime_id" => workingtime_id}) do
    working_time = TimeTracking.get_working_time!(workingtime_id)

    with {:ok, %WorkingTime{}} <- TimeTracking.delete_working_time(working_time) do
      send_resp(conn, :no_content, "")
    end
  end
end
