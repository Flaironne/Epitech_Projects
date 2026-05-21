alias Timemanager.Repo
alias Timemanager.Accounts.User

# Importer la fonction `from/2` pour les requêtes
import Ecto.Query

# Vérifier s'il y a déjà des utilisateurs admin dans la base de données
case Repo.all(from u in User, where: u.role == "admin") do
  [] ->
    # Si aucun utilisateur admin n'existe, créer un nouvel utilisateur admin
    admin_email = System.get_env("ADMIN_EMAIL")
    admin_username = System.get_env("ADMIN_USERNAME")
    admin_password = System.get_env("ADMIN_PASSWORD")

    # Chashage du mdp
    changeset = User.changeset(%User{}, %{
      email: admin_email,
      username: admin_username,
      password: admin_password,
      role: "admin"
    })

    # Insérer l'utilisateur admin
    case Repo.insert(changeset) do
      {:ok, _user} ->
        IO.puts("Admin user created successfully.")
      {:error, changeset} ->
        IO.inspect(changeset, label: "Failed to create admin user")
    end

  _admins ->
    IO.puts("Admin user already exists, skipping creation.")
end
