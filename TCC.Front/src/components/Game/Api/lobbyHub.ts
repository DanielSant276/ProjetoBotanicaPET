import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const lobbyStartHub = async (url: string, setConnection: (value: HubConnection) => void) => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(LogLevel.Information)
      .build();
  
      connection.on("JoinGroup", (msg) => {
        console.log("conexão " + msg);
      });

      await connection.start();
      await connection.invoke("JoinGroup");

      setConnection(connection);

      // Ajustes para retirar o usuário da sala ao recarregar ela
      window.addEventListener("beforeunload", () => {
        loobySendActionToHub(connection);
      });

      window.addEventListener("unload", () => {
        loobySendActionToHub(connection);
      });

      window.addEventListener("popstate", () => {
        // eslint-disable-next-line no-restricted-globals
        if (history.state) {
            loobySendActionToHub(connection);
        } else {
            loobySendActionToHub(connection);
        }
      });
  }
  catch(e) {
    console.log("Error");
    console.log(e);
  }
};

// fecha a conexão do hub
export const loobySendActionToHub = async (connection: HubConnection) =>  {
  connection.invoke("CloseCoonection");
}