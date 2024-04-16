import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IPlayer } from "../../../interfaces/IPlayer";

export const roomStartHub = async (url: string, roomId: number, user: IPlayer, setUser: (value: IPlayer) => void, setConnection: (value: HubConnection) => void) => {
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
        roomSendActionToHub(connection, roomId, user, setUser);
      });

      window.addEventListener("unload", () => {
        roomSendActionToHub(connection, roomId, user, setUser);
      });

      window.addEventListener("popstate", () => {
        // eslint-disable-next-line no-restricted-globals
        if (history.state) {
            roomSendActionToHub(connection, roomId, user, setUser);
        } else {
            roomSendActionToHub(connection, roomId, user, setUser);
        }
      });
  }
  catch(e) {
    console.log("Error");
    console.log(e);
  }
};

// fecha a conexão do hub
export const roomSendActionToHub = async (connection: HubConnection, roomId: number, user: IPlayer, setUser: (value: IPlayer) => void) =>  {
  connection.invoke("CloseCoonection", roomId, user.id);
  let updateUser = user;
  updateUser.ready = false;
  setUser(updateUser);
}

// envia para saber se está tudo certo
export const roomSendReadyStatus = (connection: HubConnection, isReady: boolean): void => {
  // debugger;
  connection.invoke("SendReadyStatus", isReady);
};

// recebe informação de que está tudo certo
export const roomOnReceiveReadyStatus = (connection: HubConnection, callback: (isReady: boolean) => void): void => {
  // debugger;
  connection.on("ReceiveReadyStatus", callback);
};

//entra na sala
export const roomJoinPlayerInRoom = (connection: HubConnection, roomId: number, userId: string): void => {
  // debugger;
  connection.invoke("JoinPlayerInRoom", roomId, userId);
}

// novo jogador conectado na sala
export const roomNewPlayerConnected = (connection: HubConnection, callback: (player: IPlayer) => void): void => {
  // debugger;
  connection.on("NewPlayerConnected", callback)
}

// recebe todos os jogadores na sala
export const roomGetPlayersInRoom = (connection: HubConnection, callback: (players: IPlayer[]) => void): void => {
  // debugger;
  connection.on("GetPlayersInRoom", callback)
}

// update player status
export const roomUpdatePlayer = (connection: HubConnection, roomId: number, userId: string, ready: boolean) => {
  // debugger;
  connection.invoke("UpdatePlayerInRoom", roomId, userId, ready);
}

// get player status update
export const roomGetPlayerUpdate = (connection: HubConnection, callback: (player: IPlayer) => void) => {
  // debugger;
  connection.on("GetPlayerUpdate", callback);
}

export const roomRemovePlayer = (connection: HubConnection, callback: (player: IPlayer) => void) => {
  connection.on("RemovePlayer", callback);
}





export const roomChatLog = (connection: HubConnection, callback: (msg: string) => void) => {
  // debugger;
  connection.on("Chat", callback);
}

// recebe qualquer erro
export const roomErro = (connection: HubConnection) => {
  // debugger;
  connection.on("Error", (msg: string) => {
    debugger;
    console.log(msg)
  });
}