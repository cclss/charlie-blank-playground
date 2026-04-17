defmodule HworldService.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      HworldServiceWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:hworld_service, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: HworldService.PubSub},
      # Start a worker by calling: HworldService.Worker.start_link(arg)
      # {HworldService.Worker, arg},
      # Start to serve requests, typically the last entry
      HworldServiceWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: HworldService.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    HworldServiceWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
