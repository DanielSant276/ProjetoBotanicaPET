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
import helpButton from "../../../imgs/icons/help.png";
import { useNavigate } from "react-router-dom";
import { useErrorModal } from "../ErrorModal/ErrorModalProvider";
import PlayerBox from "./PlayerBox";
import { Modal } from "@mui/material";
import RulesModal from "../GameRoom/RulesModal";

export default function Rooms({ user, setUser, roomInfo, resetRoom }: Props) {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [openHelpRoom, setOpenHelpRoom] = useState<boolean>(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Controla o início do jogo
  const startedGame = useRef<boolean>(false);

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

      let rulesMessage = false;

      // Parte do chat de informação
      roomChatLog(connection, (msg: string) => {
        setChat((prevMsgs) => [...prevMsgs, msg]);

        if (!rulesMessage) {
          setChat((prevMsgs) => [...prevMsgs, "Se é sua primeira vez jogando é recomendável clicar no botão \"?\" abaixo e ver mais sobre as regras do jogo."]);
          rulesMessage = true;
        }
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
          window.location.href = `/Game/${roomInfo.id}`;
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [counter]);

  // useEffect para controlar a contagem regressiva caso um jogador tire o estado de preparado
  useEffect(() => {
    if (players) {
      let playerList = players.filter((x) => x.ready === false)

      if (counter !== 0 && playerList.length > 0) {
        setCounter(0);
      }
    }
  }, [players]);

  // useEffect para manter o scrool em baixo caso mandem uma nova mensagem
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
}, [chat]);

  return (
    <Fragment>
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
                {players?.map((player, index) => (
                  <PlayerBox player={player} index={index} addMarginBottom={players.length - 1 !== index} />
                ))}
              </div>
            </div>

            <div className="room-log-box column">
              <div className="room-log-box-background"></div>
              <div ref={chatRef} className="room-log-text-box column">
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
              <div className="game-room-footer-content-icons">
                <img
                  className="rooms-att-button"
                  src={helpButton}
                  onClick={() => setOpenHelpRoom(true)}
                  alt="Botão de regras"
                />
              </div>
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

        <Modal open={openHelpRoom} onClose={() => setOpenHelpRoom(false)}>
          <RulesModal setOpenHelpRoom={setOpenHelpRoom} />
        </Modal>
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