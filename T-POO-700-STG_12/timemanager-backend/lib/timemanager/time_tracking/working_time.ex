defmodule Timemanager.TimeTracking.WorkingTime do
  use Ecto.Schema
  import Ecto.Changeset

  schema "workingtimes" do
    field :start, :utc_datetime
    field :end, :utc_datetime
    # field :working_time_total, :integer, default: 0  # Supprimé car le champ n'existe plus
    belongs_to :user, Timemanager.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(working_time, attrs) do
    working_time
    |> cast(attrs, [:start, :end, :user_id])  # Retiré :working_time_total
    |> validate_required([:start, :end, :user_id])
  end
end
