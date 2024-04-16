import { IRoom } from "../../../interfaces/IRoom";

export const getRooms = async (): Promise<IRoom[] | undefined> => {
  try {
    const response = await fetch('https://localhost:8080/Rooms/GetRooms');
    if (!response.ok) {
      throw new Error('Erro loading data');
    }
    const data = await response.json();
    // Processar os dados recebidos do backend
    console.log(data);
    return data;
  } catch (error) {
    // Lidar com erros
    console.error('Erro:', error);
    return undefined; // Retornar undefined em caso de erro
  }
}
