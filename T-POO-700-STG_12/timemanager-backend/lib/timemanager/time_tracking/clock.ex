defmodule Timemanager.TimeTracking.Clock do
  use Ecto.Schema
  import Ecto.Changeset

  schema "clocks" do
    field :time, :utc_datetime
    field :status, :boolean, default: false
    # field :total_time, :integer, default: 0  # Supprimé car le champ n'existe plus
    belongs_to :user, Timemanager.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(clock, attrs) do
    clock
    |> cast(attrs, [:time, :status, :user_id])  # Retiré :total_time
    |> validate_required([:time, :status, :user_id])
  end
end
