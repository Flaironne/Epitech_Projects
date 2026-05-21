defmodule TimeManagerWeb.Plugs.VerifyToken do
  import Plug.Conn

  @issuer "time_manager"

  def init(opts), do: opts

  def call(conn, _opts) do
    case get_req_header(conn, "authorization") do
      ["Bearer " <> token] ->
        verify_token(conn, token)

      _ ->
        conn
        |> send_resp(401, "Missing or invalid token")
        |> halt()
    end
  end

  defp create_token(user) do
    claims = %{
      "user_id" => to_string(user.id),
      "username" => user.username,
      "email" => user.email,
      "role" => to_string(user.role),
      "iss" => @issuer,
      "exp" => Joken.current_time() + 3600
    }

    signer = Joken.Signer.create("HS512", secret_key())

    {:ok, token, _claims} = Joken.generate_and_sign(claims, claims, signer)

    token
  end

  def get_created_token(user) do
    create_token(user)
  end

  defp verify_token(conn, token) do
    # Create the signer (ensure secret_key is correct)
    signer = Joken.Signer.create("HS512", secret_key())

    # Verify and validate the token
    case Joken.verify(token, signer) do
      {:ok, claims} ->
        conn
        |> assign(:claims, claims)

      {:error} ->
        conn
        |> send_resp(401, "Invalid token")
        |> halt()
    end
  end

  defp secret_key do
    System.get_env("SECRET_KEY_BASE") || raise "SECRET_KEY_BASE not set in environment"
  end
end
