import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IPlayer } from "../../../interfaces/IPlayer";

export const roomStartHub = async (url: string, roomId: string, user: IPlayer, getStartedGame: () => boolean, 
                                  setUser: (value: IPlayer) => void, setConnection: (value: HubConnection) => void) => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(LogLevel.Information)
      .build();
  
      connection.on("JoinGroup", (roomId, msg) => {
        console.log("conexão " + msg);
      });

      await connection.start();
      await connection.invoke("JoinGroup", roomId );

      setConnection(connection);

      // Ajustes para retirar o usuário da sala ao recarregar ela
      window.addEventListener("beforeunload", () => {
        if (!getStartedGame()) {
          roomSendActionToHub(connection, roomId, user, setUser);
        }
      });

      window.addEventListener("unload", () => {
        if (!getStartedGame()) {
          roomSendActionToHub(connection, roomId, user, setUser);
        }
      });

      window.addEventListener("popstate", () => {
        // eslint-disable-next-line no-restricted-globals
        if (history.state) {
          if (!getStartedGame()) {
            roomSendActionToHub(connection, roomId, user, setUser);
          }
        } else {
          if (!getStartedGame()) {
            roomSendActionToHub(connection, roomId, user, setUser);
          }
        }
      });
  }
  catch(e) {
    console.log("Error");
    console.log(e);
  }
};

// fecha a conexão do hub
export const roomSendActionToHub = async (connection: HubConnection, roomId: string, user: IPlayer, 
                                          setUser: (value: IPlayer) => void) =>  {
  connection.invoke("CloseConection", roomId, user.id);
  let updateUser = user;
  updateUser.ready = false;
  setUser(updateUser);
}

// envia para saber se está tudo certo
export const roomSendReadyStatus = (connection: HubConnection, isReady: boolean): void => {
  connection.invoke("SendReadyStatus", isReady);
};

// recebe informação de que está tudo certo
export const roomOnReceiveReadyStatus = (connection: HubConnection, callback: (isReady: boolean) => void): void => {
  connection.on("ReceiveReadyStatus", callback);
};

//entra na sala
export const roomJoinPlayerInRoom = (connection: HubConnection, roomId: string, userId: string): void => {
  connection.invoke("JoinPlayerInRoom", roomId, userId);
}

// novo jogador conectado na sala
export const roomNewPlayerConnected = (connection: HubConnection, callback: (player: IPlayer) => void): void => {
  connection.on("NewPlayerConnected", callback)
}

// recebe todos os jogadores na sala
export const roomGetPlayersInRoom = (connection: HubConnection, callback: (players: IPlayer[]) => void): void => {
  connection.on("GetPlayersInRoom", callback)
}

// update player status
export const roomUpdatePlayer = (connection: HubConnection, roomId: string, userId: string, ready: boolean) => {
  connection.invoke("UpdatePlayerInRoom", roomId, userId, ready);
}

// get player status update
export const roomGetPlayerUpdate = (connection: HubConnection, callback: (player: IPlayer) => void) => {
  connection.on("GetPlayerUpdate", callback);
}

export const roomRemovePlayer = (connection: HubConnection, callback: (player: IPlayer) => void) => {
  connection.on("RemovePlayer", callback);
}

export const roomChatLog = (connection: HubConnection, callback: (msg: string) => void) => {
  connection.on("Chat", callback);
}

export const roomStartGame = (connection: HubConnection, callback: (roomId: string) => void) => {
  connection.on("StartGame", callback);
}

// recebe qualquer erro
export const roomErro = (connection: HubConnection) => {
  connection.on("Error", (msg: string) => {
    console.log(msg)
  });
}