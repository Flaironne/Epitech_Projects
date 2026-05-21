defmodule Timemanager.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Timemanager.Repo

  alias Timemanager.Accounts.User


  def authenticate_user(email, password) do
    user = Repo.get_by(User, email: email)

    case user do
      nil ->
        {:error, "Invalid credentials"}

      user ->
        if Bcrypt.verify_pass(password, user.password) do
          {:ok, user}
        else
          {:error, "Invalid credentials"}
        end
    end
  end

    def list_users_by_manager_id(manager_id) do
      query = from u in User,
              where: u.manager_id == ^manager_id

      Repo.all(query)
    end



  @doc """
  Returns the list of users.
  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Returns the list of users by role.

  If the role is not valid, returns an error.
  """
  def list_users_by_role(role) when role in ["admin", "user", "manager", "manager_general"] do
    query = from u in User,
            where: u.role == ^role,
            select: u

    users = Repo.all(query)
    {:ok, users}  # Wrap the users list in an {:ok, users} tuple
  end


  def list_users_by_role(_invalid_role) do
    {:error, "Invalid role. Valid roles are: #{@valid_roles |> Enum.join(", ")}"}
  end


  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)

  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end
end
