import { IPlayer } from "../../../interfaces/IPlayer";
import { IRoom } from "../../../interfaces/IRoom";

export const getRooms = async (playerId: string): Promise<IRoom[] | undefined> => {
  try {
    const response = await fetch(`https://localhost:8080/Rooms/GetRooms?playerId=${playerId}`);
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
  user: IPlayer,
  errorCallback: (message: string, type: string) => void
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
      const errorText = await response.text();
      if (errorText === "Máximo de salas criadas, entre em uma sala já existente ou aguarde um pouco" || errorText === "Ocorreu um erro ao criar a sala. Por favor, tente novamente." || errorText === "Jogador não encontrado") {
        errorCallback(errorText, "errorMessage");
      }
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

export const getRoom = async (roomId: string): Promise<IRoom | undefined> => {
  try {
    const response = await fetch(`https://localhost:8080/Rooms/GetRoom?roomId=${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
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
}

export const verifyPlayerInRoom = async (
  userId: string,
  roomId: string
): Promise<boolean | undefined> => {
  try {
    const response = await fetch(`https://localhost:8080/Players/VerifyPlayerInRoom?playerId=${userId}&roomId=${roomId}`, {
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

export const getVerifyRoom = async (roomId: string): Promise<IRoom | undefined> => {
  try {
    const response = await fetch(`https://localhost:8080/Rooms/VerifyRoom?roomId=${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
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
}