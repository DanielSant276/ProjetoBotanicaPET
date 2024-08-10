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
import backImage from "../../../imgs/layout/plants-wheel-intern.png";
import backButton from "../../../imgs/icons/back.png";
import homeButton from "../../../imgs/icons/home.png";

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
        <div className="room-background-image-space">
          <img src={backImage} className="room-background-image" />
        </div>

        <div className="rooms-header">
          <p className="rooms-header-title">BINGO</p>
          <img className="rooms-header-img" src={plantLogo} />
        </div>

        <div className="rooms-content">
          <div className="room-main-grid">
            <div className="room-names column">
              <div className="room-name">
                <p className="room-name-title">
                  SALA {roomInfo.name.toUpperCase()}
                </p>
              </div>

              <div className="room-players column">
                {players?.map((player) => (
                  <div
                    className={
                      player.ready
                        ? "room-player-ready"
                        : "room-player-not-ready"
                    }
                  >
                    <div className="room-player-box-intern">
                      <p
                        className={
                          player.ready
                            ? "room-player-ready-name-text"
                            : "room-player-not-ready-name-text"
                        }
                      >
                        {player.name}
                      </p>
                      <div
                        className={
                          player.ready
                            ? "room-ready-light"
                            : "room-not-ready-light"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="room-log-box column">
              <div className="room-log-box-background"></div>
              <div className="room-log-text-box column">
                {chat.map((message) => (
                  <p className="room-log-text">{message}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rooms-footer">
          <div className="rooms-footer-content">
            <div>
              <img
                className="rooms-back-button"
                src={backButton}
                onClick={() => {
                  if (connection) {
                    roomSendActionToHub(connection, roomInfo.id, user, setUser);
                    resetRoom();
                  }
                }}
                alt="Botão de voltar"
              />
              {/* <img className="rooms-home-button" src={homeButton} /> */}
            </div>
            <div
              className="rooms-footer-new-room"
              onClick={() => handleChangeMyPlayer(!user.ready)}
            >
              <div className="rooms-footer-new-room-intern">
                <p className="rooms-footer-new-room-text">PRONTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

interface Props {
  user: IPlayer;
  setUser: (value: IPlayer) => void;
  roomInfo: IRoom;
  resetRoom: () => void;
}
