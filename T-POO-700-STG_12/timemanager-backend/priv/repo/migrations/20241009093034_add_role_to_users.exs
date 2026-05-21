defmodule Timemanager.Repo.Migrations.AddRoleToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :role, :string  # Ajoute la colonne 'role' 
    end
  end
end
