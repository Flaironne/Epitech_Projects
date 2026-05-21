defmodule Timemanager.Repo.Migrations.AddManagerIdToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :manager_id, references(:users, on_delete: :nilify_all) # si jamais un manager est supprimé, le champ est mis à null
    end

    create index(:users, [:manager_id])
  end
end
