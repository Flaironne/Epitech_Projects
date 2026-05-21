defmodule TimemanagerWeb.WorkingTimeJSON do
  alias Timemanager.TimeTracking.WorkingTime

  @doc """
  """
  def index(%{workingtimes: workingtimes}) do
    %{data: for(working_time <- workingtimes, do: data(working_time))}
  end

  @doc """
  """
  def show(%{working_time: working_time}) do
    %{data: data(working_time)}
  end

  defp data(%WorkingTime{} = working_time) do
    %{
      id: working_time.id,
      user_id: working_time.user_id,
      start: working_time.start,
      end: working_time.end
    }
  end
end
