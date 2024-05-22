import { IPlayer } from "../../../interfaces/IPlayer";
import { IRoom } from "../../../interfaces/IRoom";

export const getRooms = async (): Promise<IRoom[] | undefined> => {
  try {
    const response = await fetch("https://localhost:8080/Rooms/GetRooms");
    if (!response.ok) {
      throw new Error("Erro loading data");
    }
    const data = await response.json();
    // Processar os dados recebidos do backend
    console.log(data);
    return data;
  } catch (error) {
    // Lidar com erros
    console.error("Erro:", error);
    return undefined; // Retornar undefined em caso de erro
  }
};

export const createRoom = async (
  roomName: string,
  user: IPlayer
): Promise<IRoom | undefined> => {
  try {
    const response = await fetch("https://localhost:8080/Rooms/CreateRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomName: roomName,
        user: user,
      }),
    });
    if (!response.ok) {
      throw new Error("Erro loading data");
    }
    const data = await response.json();
    // Processar os dados recebidos do backend
    console.log(data);
    return data;
  } catch (error) {
    // Lidar com erros
    console.error("Erro:", error);
    return undefined; // Retornar undefined em caso de erro
  }
};

export const verifyPlayerInRoom = async (
  userId: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(`https://localhost:8080/Players/VerifyPlayerInRoom?playerId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro loading data");
    }
    const data = await response.json();
    // Processar os dados recebidos do backend
    console.log(data);
    return data;
  } catch (error) {
    // Lidar com erros
    console.error("Erro:", error);
    return undefined; // Retornar undefined em caso de erro
  }
};
