defmodule TimemanagerWeb.Plugs.VerifyToken do
  import Plug.Conn

  @issuer "time_manager"

  def init(opts) do
    Enum.into(opts, %{})
  end

  def call(conn, opts) do
    case get_req_header(conn, "authorization") do
      ["Bearer " <> token] ->
        case verify_token(token) do
          {:ok, claims} ->
            user_role = claims["role"]

            # Si des rôles sont spécifiés dans opts, on vérifie si l'utilisateur y appartient
            if Map.has_key?(opts, :roles) and user_role not in opts.roles do
              conn
              |> send_resp(:forbidden, "Insufficient permissions")
              |> halt()
            else
              assign(conn, :claims, claims)
            end

          {:error, _reason} ->
            conn
            |> send_resp(:unauthorized, "Invalid token")
            |> halt()
        end

      _ ->
        conn
        |> send_resp(:unauthorized, "Missing or invalid token")
        |> halt()
    end
  end

  def get_created_token(user) do
    create_token(user)
  end

  defp create_token(user) do
    claims = %{
      "user_id" => to_string(user.id),
      "role" => to_string(user.role),
      "username" => to_string(user.username),
      "email" => to_string(user.email),
      "iss" => @issuer,
      "exp" => Joken.current_time() + 3600
    }

    signer = Joken.Signer.create("HS512", secret_key())

    case Joken.generate_and_sign(claims, claims, signer) do
      {:ok, token, _claims} ->
        token
      {:error, reason} ->
        raise "Token generation failed: #{inspect(reason)}"
    end
  end

  defp verify_token(token) do
    signer = Joken.Signer.create("HS512", secret_key())
    Joken.verify(token, signer)
  end

  defp secret_key do
    System.get_env("SECRET_KEY_BASE") || raise "SECRET_KEY_BASE not set in environment"
  end
end
