defmodule HworldServiceWeb.PageController do
  use HworldServiceWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
