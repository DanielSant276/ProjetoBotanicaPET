import { Fragment, useEffect, useRef, useState } from "react";
import "./Room.css";
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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { getUser } from "../Api/useUser";
import { getRoom, verifyPlayerInRoom } from "../Api/useRooms";
import { useErrorModal } from "../ErrorModal/ErrorModalProvider";

const playerPlaceHolder: IPlayer = {
  id: "",
  name: "",
  ready: false,
};

const roomPlaceHolder: IRoom = {
  id: "",
  name: "",
  numberOfPlayers: 0,
  started: false,
};

export default function Rooms() {
  const { roomId } = useParams();
  
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [roomInfo, setRoomInfo] = useState<IRoom>(roomPlaceHolder);
  
  const [screenLoaded, setScreenLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<IPlayer>(playerPlaceHolder);

  const { showError } = useErrorModal();
  
  const navigate = useNavigate();

  // Controla o início do jogo
  const startedGame = useRef<boolean>(false);

  // Redireciona o usuário para a tela inicial
  const returnToListRooms = () => {
    navigate(`/Rooms`);
  };

  // Redireciona o usuário para a sala selecionada
  const goToHomeScreen = () => {
    navigate(`/`);
  };

  // Retorna o estado do jogo iniciado
  const getStartedGame = () => {
    return startedGame.current;
  };

  // Atualiza o status de pronto do jogador atual
  const handleChangeMyPlayer = (ready: boolean) => {
    let player = user;

    player.ready = ready;

    setUser(player);

    setPlayers((prevPlayers) => handleChangePlayers(prevPlayers, player));

    // Atualiza o status do jogador no servidor
    if (connection) {
      roomUpdatePlayer(connection, roomInfo.id, user.id, user.ready);
    }
  };

  // Atualiza a lista de jogadores com a nova informação do jogador atual
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

  // useEffect para buscar informações da sala quando o componente é montado
  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        const room = await getRoom(roomId);

        if (room) {
          setRoomInfo(room);
        }
        else {
          showError("Houve um problema ao entrar na sala", "errorMessage");
          returnToListRooms();
        }
      }
      fetchRoom();
    }
  }, [roomId]);

  // useEffect para buscar informações do usuário ao montar o componente
  useEffect(() => {
    let userToken = Cookies.get("userToken");

    const fetchUser = async () => {
      const user = await getUser(userToken);

      if (user) {
        if (!userToken) {
          Cookies.set("userToken", user.id, { expires: 30 });
        }

        let newUser: IPlayer = {
          id: user.id,
          name: user.name === undefined ? "" : user.name,
          ready: false,
        };

        setUser(newUser);
        setScreenLoaded(true);
      }
    };

    fetchUser();
  }, []);

  // useEffect para iniciar a conexão com o hub SignalR ao montar o componente
  useEffect(() => {
    roomStartHub(
      "https://localhost:8080/Roomhub",
      roomInfo.id,
      user,
      getStartedGame,
      setUser,
      setConnection
    );

    // Encerra a conexão com o hub ao desmontar o componente
    return () => {
      connection?.stop();
    };
  }, []);

  // useEffect para configurar eventos do hub SignalR após a conexão ser estabelecida
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

  // useEffect para controlar a contagem regressiva ao iniciar o jogo
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
      {!screenLoaded && <div className="main-screen"></div>}

      {screenLoaded && (
        <div className="main-screen column">
          <div className="room-background-image-space">
            <img src={backImage} className="room-background-image" alt="Imagem de plano de fundo" />
          </div>

          <div className="rooms-header">
            <p className="rooms-header-title">BINGO</p>
            <img className="rooms-header-img" src={plantLogo} alt="Logo do projeto" />
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
                      returnToListRooms();
                    }
                  }}
                  alt="Botão de voltar para a lista de salas"
                />
                <img 
                  className="rooms-home-button"
                  src={homeButton} 
                  onClick={() => {
                    if (connection) {
                      roomSendActionToHub(connection, roomInfo.id, user, setUser);
                      goToHomeScreen()
                    }
                  }}
                  alt="Botão de voltar para a Home"
                />
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
      )}
    </Fragment>
  );
}