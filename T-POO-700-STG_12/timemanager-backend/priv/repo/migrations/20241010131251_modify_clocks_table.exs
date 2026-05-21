defmodule Timemanager.Repo.Migrations.ModifyClocksTable do
  use Ecto.Migration

  def change do
    alter table(:clocks) do
      add :total_time, :integer, default: 0  # total_time du temps en minute
      modify :status, :boolean, default: false  # changé en booléan
    end
  end
end
