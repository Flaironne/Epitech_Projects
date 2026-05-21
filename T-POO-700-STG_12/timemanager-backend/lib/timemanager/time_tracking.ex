defmodule Timemanager.TimeTracking do
  @moduledoc """
  The TimeTracking context.
  """

  import Ecto.Query, warn: false
  alias Timemanager.Repo
  alias Timemanager.TimeTracking.Clock
  alias Timemanager.TimeTracking.WorkingTime

  # Clocks Functions

  # Récupérer toutes les clocks
  def list_clocks do
    Repo.all(Clock)
  end

  # Récupérer toutes les clocks pour un utilisateur spécifique
  def list_clocks_by_user(user_id) do
    from(c in Clock, where: c.user_id == ^user_id)
    |> Repo.all()
  end

  # Récupérer une clock spécifique pour un utilisateur spécifique
  def get_clock_by_user!(user_id, clock_id) do
    Repo.get_by!(Clock, user_id: user_id, id: clock_id)
  end

  # Récupérer une clock par ID
  def get_clock!(id), do: Repo.get!(Clock, id)

  # Créer une nouvelle clock
  def create_clock(attrs \\ %{}) do
    %Clock{}
    |> Clock.changeset(attrs)
    |> Repo.insert()
  end

  # Mettre à jour une clock existante
  def update_clock(%Clock{} = clock, attrs) do
    clock
    |> Clock.changeset(attrs)
    |> Repo.update()
  end

  # Supprimer une clock
  def delete_clock(%Clock{} = clock) do
    Repo.delete(clock)
  end

  # Obtenir un changeset pour une clock
  def change_clock(%Clock{} = clock, attrs \\ %{}) do
    Clock.changeset(clock, attrs)
  end

  # Obtenir la dernière clock d'un utilisateur spécifique
  def get_last_clock(user_id) do
    from(c in Clock, where: c.user_id == ^user_id, order_by: [desc: c.inserted_at], limit: 1)
    |> Repo.one()
  end

  # Working Times Functions

  # Récupérer toutes les working times
  def list_workingtimes do
    Repo.all(WorkingTime)
  end

  # Récupérer toutes les working times pour un utilisateur spécifique
  def list_workingtimes_by_user(user_id) do
    from(w in WorkingTime, where: w.user_id == ^user_id)
    |> Repo.all()
  end

  # Récupérer une working time spécifique pour un utilisateur spécifique
  def get_working_time_by_user!(user_id, working_time_id) do
    Repo.get_by!(WorkingTime, user_id: user_id, id: working_time_id)
  end

  # Récupérer une working time par ID
  def get_working_time!(id), do: Repo.get!(WorkingTime, id)

  # Créer une nouvelle working time
  def create_working_time(attrs \\ %{}) do
    %WorkingTime{}
    |> WorkingTime.changeset(attrs)
    |> Repo.insert()
  end

  # Mettre à jour une working time existante
  def update_working_time(%WorkingTime{} = working_time, attrs) do
    working_time
    |> WorkingTime.changeset(attrs)
    |> Repo.update()
  end

  # Supprimer une working time
  def delete_working_time(%WorkingTime{} = working_time) do
    Repo.delete(working_time)
  end

  # Obtenir un changeset pour une working time
  def change_working_time(%WorkingTime{} = working_time, attrs \\ %{}) do
    WorkingTime.changeset(working_time, attrs)
  end
end
