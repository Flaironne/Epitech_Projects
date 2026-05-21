defmodule Timemanager.Repo.Migrations.ModifyWorkingtimesTable do
  use Ecto.Migration

  def change do
    alter table(:workingtimes) do
      add :working_time_total, :integer, default: 0  # working_time_total en minutes
    end
  end
end
