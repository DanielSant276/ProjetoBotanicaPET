import { IPlayer } from "../../../interfaces/IPlayer";
import { IRoom } from "../../../interfaces/IRoom";

export const getUser = async (token: string | undefined): Promise<IPlayer | undefined> => {
  try {
    const response = await fetch('https://localhost:8080/Players/GetPlayerById/' + token);
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

export const updateUser = async (player: IPlayer | undefined): Promise<IPlayer | undefined> => {
  try {
    const response = await fetch('https://localhost:8080/Players/UpdatePlayer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(player) // Converte o objeto player para uma string JSON
    });
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