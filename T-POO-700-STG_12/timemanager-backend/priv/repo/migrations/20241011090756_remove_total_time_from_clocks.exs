defmodule Timemanager.Repo.Migrations.RemoveTotalTimeFromClocks do
  use Ecto.Migration

  def change do
    alter table(:clocks) do
      remove :total_time
    end
  end
end
