defmodule Timemanager.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :username, :string
    field :email, :string
    field :password, :string
    field :role, :string

    belongs_to :manager, Timemanager.Accounts.User, foreign_key: :manager_id
    has_many :managed_users, Timemanager.Accounts.User, foreign_key: :manager_id
    has_many :clocks, Timemanager.TimeTracking.Clock, on_delete: :delete_all # supprimer tous les clocks d'un user quand on supprime le user
    has_many :workingtimes, Timemanager.TimeTracking.WorkingTime, on_delete: :delete_all # supprimer tous les working time d'un user quand on supprime le user


    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :email, :password, :role, :manager_id])
    |> validate_required([:username, :email, :password])
    |> validate_format(:email, ~r/^[\w._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Le mail doit être valide")
    |> validate_length(:username, min: 3, max: 20, message: "Le nom doit faire entre 3 et 20 caractères")
    |> validate_password_strength()  # Valider le mot de passe avant le hachage
    |> trim_whitespace([:username, :email])
    |> hash_password()  # Hacher le mot de passe après la validation
    |> unique_constraint(:email, message: "Le mail ou le username doit être unique")
    |> unique_constraint(:username, message: "Le mail ou le username doit être unique")
  end

  # Fonction appelée pour valider la robustesse du mot de passe
  defp validate_password_strength(changeset) do
    password = get_field(changeset, :password)


    # IO.inspect(password, label: "Mot de passe fourni (avant hachage)") # Debugage du pwd

    # Debugage du pwd (doit renvoyer true si mdp = correct par rapport à la regex, false si le mdp est pas assez robuste)
    # IO.inspect(Regex.match?(~r/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\-=[\]\\|])/u, password), label: "Le mot de passe correspond-il au regex ?")

    if password && !Regex.match?(~r/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\-=[\]\\|])/u, password) do
      add_error(changeset, :password, "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial")
    else
      changeset
    end
  end

  # Hacher le mot de passe avec Bcrypt
  defp hash_password(changeset) do
    if password = get_change(changeset, :password) do
      put_change(changeset, :password, Bcrypt.hash_pwd_salt(password))
    else
      changeset
    end
  end

  # Supprime les espaces blancs pour le mail / username
  defp trim_whitespace(changeset, fields) do
    Enum.reduce(fields, changeset, fn field, changeset ->
      update_change(changeset, field, &String.trim/1)
    end)
  end
end
