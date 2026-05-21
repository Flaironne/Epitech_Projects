defmodule Timemanager.TimeTrackingFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Timemanager.TimeTracking` context.
  """

  @doc """
  Generate a clock.
  """
  def clock_fixture(attrs \\ %{}) do
    {:ok, clock} =
      attrs
      |> Enum.into(%{
        status: true,
        time: ~N[2024-10-07 12:34:00],
        user_id: 1  # Default user_id, you can change this as needed
      })
      |> Timemanager.TimeTracking.create_clock()

    clock
  end

  @doc """
  Generate a working_time.
  """
  def working_time_fixture(attrs \\ %{}) do
    {:ok, working_time} =
      attrs
      |> Enum.into(%{
        end: ~N[2024-10-07 12:34:00],
        start: ~N[2024-10-07 12:34:00],
        user_id: 1  # Default user_id, you can change this as needed

      })
      |> Timemanager.TimeTracking.create_working_time()

    working_time
  end
end
