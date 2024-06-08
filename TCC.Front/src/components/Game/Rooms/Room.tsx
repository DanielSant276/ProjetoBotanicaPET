import { Fragment, useEffect, useRef, useState } from "react";
import "./Room.css";
import CheckIcon from "@mui/icons-material/Check";
import { IRoom } from "../../../interfaces/IRoom";
import { IPlayer } from "../../../interfaces/IPlayer";
import { HubConnection } from "@microsoft/signalr";
import {
  roomNewPlayerConnected,
  roomErro,
  roomJoinPlayerInRoom,
  roomOnReceiveReadyStatus,
  roomSendReadyStatus,
  roomStartHub,
  roomGetPlayersInRoom,
  roomUpdatePlayer,
  roomGetPlayerUpdate,
  roomChatLog,
  roomRemovePlayer,
  roomSendActionToHub,
  roomStartGame,
} from "../Api/hubRooms";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import backImage from "../../../imgs/icons/back.png";

export default function Rooms({ user, setUser, roomInfo, resetRoom }: Props) {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);

  // variável de controle para não limpar as informações das salas
  const startedGame = useRef<boolean>(false);

  const getStartedGame = () => {
    return startedGame.current;
  };

  const handleChangeMyPlayer = (ready: boolean) => {
    let player = user;

    player.ready = ready;

    setUser(player);

    setPlayers((prevPlayers) => handleChangePlayers(prevPlayers, player));

    // update player status
    if (connection) {
      roomUpdatePlayer(connection, roomInfo.id, user.id, user.ready);
    }
  };

  const handleChangePlayers = (
    prevPlayers: IPlayer[],
    updatedPlayer: IPlayer
  ) => {
    const playerIndex = prevPlayers.findIndex(
      (player) => player.id === updatedPlayer.id
    );

    const updatedPlayers = [...prevPlayers];
    updatedPlayers[playerIndex] = updatedPlayer;
    return updatedPlayers;
  };

  useEffect(() => {
    roomStartHub(
      "https://localhost:8080/Roomhub",
      roomInfo.id,
      user,
      getStartedGame,
      setUser,
      setConnection
    );

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
        } else {
          console.log("Erro na conexão");
        }
      });

      // recebe todos os jogadores na sala
      roomGetPlayersInRoom(connection, function (players: IPlayer[]) {
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
        setPlayers((prevPlayers) =>
          handleChangePlayers(prevPlayers, updatedPlayer)
        );
      });

      // Remove o jogador da sala
      roomRemovePlayer(connection, (player: IPlayer) => {
        setPlayers((prevPlayers) => {
          return prevPlayers.filter((x) => x.id !== player.id);
        });
      });

      // Parte do chat de informação
      roomChatLog(connection, (msg: string) => {
        setChat((prevMsgs) => [...prevMsgs, msg]);
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
        setChat((prevMsgs) => [...prevMsgs, `${counter}...`]);

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
      <div className="main-screen column">
        <div className="room-background-image" />

        <div className="rooms-header">
          <p className="rooms-header-title">BINGO</p>
          <img className="rooms-header-img" src={plantLogo} />
        </div>

        <div className="rooms-content">
          <div className="room-main-grid">
            <div className="room-names column">
              <div className="room-name">
                <p className="room-name-title">SALA DO MATUÊ</p>
              </div>

              <div className="room-players column">
                <div className="room-player-ready">
                  <div className="room-player-box-intern">
                    <p className="room-player-ready-name-text">Matuê</p>
                    <div className="room-ready-light" />
                  </div>
                </div>
                <div className="room-player-ready">
                  <div className="room-player-box-intern">
                    <p className="room-player-ready-name-text">Tuninho</p>
                    <div className="room-ready-light" />
                  </div>
                </div>
                <div className="room-player-not-ready">
                  <div className="room-player-box-intern">
                    <p className="room-player-not-ready-name-text">
                      SimasTurbo
                    </p>
                    <div className="room-not-ready-light" />
                  </div>
                </div>
                <div className="room-player-not-ready">
                  <div className="room-player-box-intern">
                    <p className="room-player-not-ready-name-text">
                      SiriSacudo
                    </p>
                    <div className="room-not-ready-light" />
                  </div>
                </div>
              </div>
            </div>

            <div className="room-log-box column">
              <div className='room-log-box-background'></div>
              <div className="room-log-text-box column">
                <p className="room-log-text">Boas vindas à sala do Matuê, SimasTurbo...</p>
                <p className="room-log-text">Tuninho está pronto!</p>
                <p className="room-log-text">Boas vindas à sala do Matuê, SiriSacudo...</p>
                <p className="room-log-text">O jogo irá começar em 5.</p>
                <p className="room-log-text">4.</p>
                <p className="room-log-text">3.</p>
                <p className="room-log-text">2.</p>
                <p className="room-log-text">1.</p>
                <p className="room-log-text">Bom jogo!</p>
                <p className="room-log-text">4.</p>
                <p className="room-log-text">3.</p>
                <p className="room-log-text">2.</p>
                <p className="room-log-text">1.</p>
                <p className="room-log-text">Bom jogo!</p>
                <p className="room-log-text">3.</p>
                <p className="room-log-text">2.</p>
                <p className="room-log-text">1.</p>
                <p className="room-log-text">Bom jogo!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rooms-footer">
          <div className="rooms-footer-content">
            <img className="rooms-back-button" src={backImage} />
            <div
              className="rooms-footer-new-room"
              onClick={() => console.log(true)}
            >
              <div className="rooms-footer-new-room-intern">
                <p className="rooms-footer-new-room-text">PRONTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='old-main-screen'>
        <p className='rooms-title'>Sala {roomInfo.name}</p>

        <div className='rooms-box'>
          <div className='rooms-selected-room'>
            <div className='rooms-players-name'>
              {players?.map((player) => (
                <div className='rooms-player-name'>
                  <div className='rooms-player-name'>
                    <p>{player.name}</p>
                  </div>
                  <div>{player.ready && <CheckIcon />}</div>
                </div>
              ))}
            </div>
            {
              <div className='rooms-log-message'>
                {chat.map((message) => (
                  <p>{message}</p>
                ))}
              </div>
            }
          </div>
          <div className='rooms-new-room-buttons'>
            <div
              className='rooms-back-button'
              onClick={() => {
                if (connection) {
                  roomSendActionToHub(connection, roomInfo.id, user, setUser);
                  resetRoom();
                }
              }}
            >
              <p>Voltar</p>
            </div>
            <div>
              <div
                className='rooms-start-button'
                onClick={() => handleChangeMyPlayer(!user.ready)}
              >
                <p>Pronto</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </Fragment>
  );
}

interface Props {
  user: IPlayer;
  setUser: (value: IPlayer) => void;
  roomInfo: IRoom;
  resetRoom: () => void;
}
