import { Fragment, useEffect, useRef, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import { IRoom } from "../../../interfaces/IRoom";
import { IPlayer } from "../../../interfaces/IPlayer";
import { HubConnection } from "@microsoft/signalr";
import { roomNewPlayerConnected, roomErro, roomJoinPlayerInRoom, roomOnReceiveReadyStatus, roomSendReadyStatus, roomStartHub, roomGetPlayersInRoom, roomUpdatePlayer, roomGetPlayerUpdate, roomChatLog, roomRemovePlayer, roomSendActionToHub, roomStartGame } from "../Api/hubRooms";

export default function Rooms({ user, setUser, roomInfo, resetRoom }: Props) {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);

  // variável de controle para não limpar as informações das salas
  const startedGame = useRef<boolean>(false);
  
  const getStartedGame = () => {
    return startedGame.current;
  }

  const handleChangeMyPlayer = (ready: boolean) => {
    let player = user;
    
    player.ready = ready
    
    setUser(player);

    setPlayers(prevPlayers => handleChangePlayers(prevPlayers, player));

    // update player status
    if (connection) {
      roomUpdatePlayer(connection, roomInfo.id, user.id, user.ready);
    }
  };

  const handleChangePlayers = (prevPlayers: IPlayer[], updatedPlayer: IPlayer) => {
    const playerIndex = prevPlayers.findIndex(player => player.id === updatedPlayer.id);

    const updatedPlayers = [...prevPlayers];
    updatedPlayers[playerIndex] = updatedPlayer;
    return updatedPlayers;
  }

  useEffect(() => {
    roomStartHub("https://localhost:8080/Roomhub", roomInfo.id, user, getStartedGame, setUser, setConnection);

    return () => {
      connection?.stop();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      roomSendReadyStatus(connection, true);
      roomOnReceiveReadyStatus(connection, function (ready: boolean) {
        // debugger;
        if (ready) {
          roomJoinPlayerInRoom(connection, roomInfo.id, user.id);
        }
        else {
          console.log("Erro na conexão")
        }
      });

      // recebe todos os jogadores na sala
      roomGetPlayersInRoom(connection, function(players: IPlayer[]) {
        // debugger;
        setPlayers([...players, user]);
      });

      // Receba informações sobre novos jogadores que se conectaram à sala
      roomNewPlayerConnected(connection, (newPlayer: IPlayer) => {
        console.log(`Novo jogador conectado: ${newPlayer.name}`);
        setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
      });

      // Recebe informação de update de status
      roomGetPlayerUpdate(connection, (updatedPlayer: IPlayer) => {
        setPlayers(prevPlayers => handleChangePlayers(prevPlayers, updatedPlayer));
      });

      // Remove o jogador da sala
      roomRemovePlayer(connection, (player: IPlayer) => {
        setPlayers(prevPlayers => {
          return prevPlayers.filter(x => x.id !== player.id);
        });
      });

      // Parte do chat de informação
      roomChatLog(connection, (msg: string) => {
        setChat(prevMsgs => [...prevMsgs, msg])
      });
      
      // Dá início ao jogo
      roomStartGame(connection, (msg: string) => {
        setCounter(5);
      });

      // Recebe informação de erro caso ocorra
      roomErro(connection);
    }
  }, [connection]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
        setChat(prevMsgs => [...prevMsgs, `${counter}...`])

        if (counter - 1 === 0) {
          startedGame.current = true;
          window.location.href = `/Room/${roomInfo.id}`;
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [counter]);

  return (
    <Fragment>
      <div>
        <div className="main-screen">
          <p className="rooms-title">Sala {roomInfo.name}</p>

          <div className="rooms-box">
            <div className="rooms-selected-room">
              <div className="rooms-players-name">
                {players?.map((player) => (
                  <div className="rooms-player-name">
                    <div className="rooms-player-name">
                      <p>{player.name}</p>
                    </div>
                    <div>
                      {player.ready &&
                        <CheckIcon />
                      }
                    </div>
                  </div>
                ))}
              </div>
              {<div className="rooms-log-message">
                {chat.map((message) => (
                  <p>{message}</p>
                ))}
              </div>}
            </div>
            <div className="rooms-new-room-buttons">
              <div className="rooms-back-button" onClick={() => { 
                if (connection) { 
                  roomSendActionToHub(connection, roomInfo.id, user, setUser); 
                  resetRoom(); 
                }}}
              >
                <p>Voltar</p>
              </div>
              <div>
                <div className="rooms-start-button" onClick={() => handleChangeMyPlayer(!user.ready)}>
                  <p>Pronto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

interface Props {
  user: IPlayer;
  setUser: (value: IPlayer) => void;
  roomInfo: IRoom;
  resetRoom: () => void;
}