defmodule Timemanager.Repo.Migrations.RemoveWorkingTimeTotalFromWorkingtimes do
  use Ecto.Migration

  def change do
    alter table(:workingtimes) do
      remove :working_time_total
    end
  end
end
