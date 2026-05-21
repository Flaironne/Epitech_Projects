defmodule TimemanagerWeb.UserController do
  use TimemanagerWeb, :controller

  alias Timemanager.Accounts
  alias Timemanager.Accounts.User
  alias TimemanagerWeb.Plugs.VerifyToken

  action_fallback TimemanagerWeb.FallbackController


  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> render(:show, user: user)
    end
  end

  
  def login(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        token = VerifyToken.get_created_token(user)
        json(conn, %{token: token})

      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid credentials"})
    end
  end

  def me(conn, _params) do
    claims = conn.assigns[:claims]
    user_id = claims["user_id"]

    user = Accounts.get_user!(user_id)
    render(conn, :show, user: user)
  end

  def register(conn, %{"user" => user_params}) do
    user_params = user_params
    |> Map.put_new("role", "user")
    |> Map.put_new("manager_id", nil)

    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> json(%{message: "User registered successfully"})
    end
  end

  def index_managed_users(conn, _params) do
    claims = conn.assigns[:claims]
    role = claims["role"]
    user_id = claims["user_id"]

    users = case role do
      "admin" -> Accounts.list_users()
      "manager_general" -> Accounts.list_users()
      "manager" -> Accounts.list_users_by_manager_id(user_id)
      _ -> []
    end

    render(conn, :index, users: users)
  end

  def show(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    render(conn, :show, user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    claims = conn.assigns[:claims]
    user_id = claims["user_id"]
    role = claims["role"]

    cond do
      role == "admin" or (role == "manager_general" and user_id != id) or user_id == id ->
        user = Accounts.get_user!(id)
        with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
          render(conn, :show, user: user)
        end

      true ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "You are not authorized to update this user"})
    end
  end

  def delete(conn, %{"id" => id}) do
    claims = conn.assigns[:claims]
    user_id = claims["user_id"]
    role = claims["role"]

    cond do
      role == "admin" or user_id == id ->
        user = Accounts.get_user!(id)
        with {:ok, %User{}} <- Accounts.delete_user(user) do
          conn
          |> put_status(:ok)
          |> json(%{message: "User deleted successfully."})
        end

      true ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "You are not authorized to delete this user"})
    end
  end
end
