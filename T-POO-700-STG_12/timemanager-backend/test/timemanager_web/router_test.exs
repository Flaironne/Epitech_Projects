defmodule TimemanagerWeb.RouterTest do
  use TimemanagerWeb.ConnCase

  alias Timemanager.Repo
  alias Timemanager.Accounts.User
  alias Timemanager.Clocks.Clock
  alias Timemanager.WorkingTimes.WorkingTime

  describe "User routes" do
    test "GET /api/users", %{conn: conn} do
      conn = get(conn, "/api/users")
      assert json_response(conn, 200)
    end
  end

  describe "Clock routes" do
    test "GET /api/clocks/:userID", %{conn: conn, user: user} do
      conn = get(conn, "/api/clocks/#{user.id}")
      assert json_response(conn, 200)
    end
  end

  describe "WorkingTime routes" do
    test "GET /api/workingtime/:userID", %{conn: conn, user: user} do
      conn = get(conn, "/api/workingtime/#{user.id}")
      assert json_response(conn, 200)
    end
  end
end
