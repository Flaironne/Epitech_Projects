defmodule TimemanagerWeb.ClockJSON do
  alias Timemanager.TimeTracking.Clock

  @doc """
  Renders a list of clocks.
  """
  def index(%{clocks: clocks}) do
    %{data: for(clock <- clocks, do: data(clock))}
  end

  @doc """
  Renders a single clock.
  """
  def show(%{clock: clock}) do
    %{data: data(clock)}
  end

  defp data(%Clock{} = clock) do
    %{
      id: clock.id,
      user_id: clock.user_id,
      time: clock.time,
      status: clock.status,
    }
  end
end
