import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IRanking } from "../../../interfaces/IRanking";

export const gameStartHub = async (url: string, roomId: string, maxNumber: number, setConnection: (value: HubConnection) => void) => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(LogLevel.Information)
      .build();
  
      connection.on("JoinGroup", (roomId, msg) => {
        console.log("conexão " + msg);
      });

      await connection.start();
      await connection.invoke("JoinGroup", roomId, maxNumber);

      setConnection(connection);

      // Ajustes para retirar o usuário da sala ao recarregar ela
      window.addEventListener("beforeunload", () => {
      });

      window.addEventListener("unload", () => {
      });

      window.addEventListener("popstate", () => {
        // eslint-disable-next-line no-restricted-globals
        if (history.state) {
          
        } else {

        }
      });
  }
  catch(e) {
    console.log("Error");
    console.log(e);
  }
};


// TODO: ver se está implementado
export const gameSendActionToHub = async (connection: HubConnection, roomId: string) =>  {
  //debugger;
  connection.invoke("CloseConection", roomId);
}


export const gameGetNumber = (connection: HubConnection, roomId: string, indexNumberSorted: number): void => {
  // debugger;
  connection.invoke("GetNumber", roomId, indexNumberSorted);
}

export const gameReceivedNumber = (connection: HubConnection, callback: (number: number) => void): void => {
  // debugger;
  connection.on("ReceivedNumber", callback);
};

export const gameGetBoard = (connection: HubConnection, playerId: string, maxNumber: number): void => {
  // debugger;
  connection.invoke("GenerateBoardNumbers", playerId, maxNumber);
}

export const gameReceivedBoard = (connection: HubConnection, callback: (value: string) => void): void => {
  // debugger;
  connection.on("ReceivedBoard", callback);
};

export const gameGetRanking = (connection: HubConnection, roomId: string): void => {
  // debugger;
  connection.invoke("GetRanking", roomId);
}

export const gameReceivedRanking = (connection: HubConnection, callback: (ranking: IRanking[]) => void): void => {
  // debugger;
  connection.on("ReceivedRanking", callback);
};

export const gameGainPoint = (connection: HubConnection, roomId: string, playerId: string): void => {
  // debugger;
  connection.invoke("GainPoint", roomId, playerId);
}

export const gameUpdateRanking = (connection: HubConnection, callback: (ranking: IRanking) => void): void => {
  // debugger;
  connection.on("UpdateRanking", callback);
};

export const gameCallBingo = (connection: HubConnection, roomId: string, playerId: string): void => {
  // debugger;
  connection.invoke("CallBingo", roomId, playerId);
}

export const gameEndGame = (connection: HubConnection, callback: (ranking: IRanking[]) => void): void => {
  // debugger;
  connection.on("CallBingo", callback);
};