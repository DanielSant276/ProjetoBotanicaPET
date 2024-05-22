import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IRanking } from "../../../interfaces/IRankings";

export const gameStartHub = async (url: string, roomId: string, maxNumber: number, /* user: IPlayer, setUser: (value: IPlayer) => void, */ setConnection: (value: HubConnection) => void) => {
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

export const gameGetNumber = (connection: HubConnection, roomId: string, indexNumberSorted: number): void => {
  // debugger;
  connection.invoke("GetNumber", roomId, indexNumberSorted);
}

export const gameReceivedNumber = (connection: HubConnection, callback: (number: number) => void): void => {
  // debugger;
  connection.on("ReceivedNumber", callback);
};

export const gameGetBoard = (connection: HubConnection, roomId: string, playerToken: string, maxNumber: number): void => {
  // debugger;
  connection.invoke("GenerateBoardNumbers", roomId, playerToken, maxNumber);
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