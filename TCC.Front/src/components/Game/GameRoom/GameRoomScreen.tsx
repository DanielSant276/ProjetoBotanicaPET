import { Fragment, useEffect, useState } from "react";
import "./GameRoomScreen.css";
import { PlayerBoard } from "./PlayerBoard";
import {
  gameCallBingo,
  gameEndGame,
  gameGainPoint,
  gameGetBoard,
  gameGetNumber,
  gameGetRanking,
  gameReceivedBoard,
  gameReceivedNumber,
  gameReceivedRanking,
  gameSendActionToHub,
  gameStartHub,
  gameUpdateRanking,
} from "../Api/hubGameRoom";
import { useNavigate, useParams } from "react-router-dom";
import { HubConnection } from "@microsoft/signalr";
import { IRanking } from "../../../interfaces/IRanking";
import Cookies from "js-cookie";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import helpButton from "../../../imgs/icons/help.png";
import homeButton from "../../../imgs/icons/home.png";
import backButton from "../../../imgs/icons/back.png";
import backImage from "../../../imgs/layout/plants-wheel-intern.png";
import stageImage from "../../../imgs/layout/stage.png";
import victoryImage from "../../../imgs/layout/victory.png";
import endGameImage from "../../../imgs/layout/end-game.png";
import { Modal } from "@mui/material";
import { getRoom, verifyPlayerInRoom } from "../Api/useRooms";
import { useErrorModal } from "../ErrorModal/ErrorModalProvider";
import RulesModal from "./RulesModal";

const imagesColored = require.context(
  "../../../imgs/plants/testeColorido",
  true
);
const imageListColored = imagesColored
  .keys()
  .map((image) => imagesColored(image));
const imagesBlackWhite = require.context(
  "../../../imgs/plants/testePretoBranco",
  true
);
const imageListBlackWhite = imagesBlackWhite
  .keys()
  .map((image) => imagesBlackWhite(image));

let timerNumber = 1;

export default function GameRoomScreen() {
  const { gameId } = useParams();
  const userToken = Cookies.get("userToken");
  const { showError } = useErrorModal();

  const navigate = useNavigate();

  const [screenLoaded, setScreenLoaded] = useState<boolean>(true);

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [draftedNumber, setDraftedNumber] = useState<number>(-1);
  const [nextNumberTimer, setNextNumberTimer] = useState<number>(0);

  const [numbersAlreadyDrawn, setNumbersAlreadyDrawn] = useState<number[]>([]);

  const [boardNumbers, setBoardNumbers] = useState<number[]>([]);

  const [ranking, setRanking] = useState<IRanking[]>([{playerId: 'a', playerName: 'Fernanda', playerPoint: 600},
    {playerId: 'a', playerName: 'WWWWWWWWWW', playerPoint: 400},
    {playerId: 'a', playerName: 'teste3', playerPoint: 300},
    {playerId: 'a', playerName: 'teste4', playerPoint: 200}]);

  const [playerName, setPlayerName] = useState<string>("");

  const [openHelpRoom, setOpenHelpRoom] = useState<boolean>(false);
  const [winningPlayer, setWinningPlayer] = useState<string>("a");
  const [winningPlayerToken, setWinningPlayerToken] = useState<string>("");

  const [startScreenModal, setStartScreenModal] = useState<boolean>(false);
  const [startSecondCount, setStartSecondCount] = useState<number>(/* 20 */ 3);

  const [gridSelected, setGridSelected] = useState<boolean[]>(
    Array(boardNumbers.length).fill(false)
  );
  const [mark, setMark] = useState<boolean>(false);

  // Redireciona o usuário para a sala selecionada
  const goToHomeScreen = () => {
    navigate(`/`);
  };

  // Marca um número no tabuleiro e atualiza o ranking
  const markNumber = () => {
    if (connection && gameId && userToken) {
      const updatedRanking = ranking.map((player) =>
        player.playerId === userToken
          ? { ...player, playerPoint: player.playerPoint + 100 }
          : player
      );

      // Atualiza o estado com o novo ranking
      setRanking(updatedRanking);
      gameGainPoint(connection, gameId, userToken);
    }
  };

  // Função que chama "Bingo" e notifica o servidor
  const callBingo = () => {
    if (connection && gameId && userToken) {
      if (gridSelected.every((value) => value === true)) {
        gameCallBingo(connection, gameId, userToken);
        showError("BINGO! Você venceu", "sideErrorMessage");
      } else {
        showError("Ainda falta marcar algumas plantas!", "sideErrorMessage");
      }
    }
  };

  useEffect(() => {
    if (userToken && gameId) {
      const fetchPlayer = async () => {
        const playerData = await verifyPlayerInRoom(userToken, gameId);

        debugger;
        if (!playerData) {
          window.location.href = `/Rooms`;
        }
        else {
          setScreenLoaded(true);
        }
        setScreenLoaded(true);
        setStartScreenModal(true);
      };

      fetchPlayer();
    }
  }, [userToken, gameId]);

  useEffect(() => {
    if (startScreenModal && startSecondCount > 0) {
      const timer = setTimeout(() => {
        setStartSecondCount(startSecondCount - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (startScreenModal && startSecondCount === 0) {
      setStartScreenModal(false);
      setMark(true);
    }
  }, [startScreenModal, startSecondCount]);

  // useEffect para carregar as informações da sala ao montar o componente
  useEffect(() => {
    if (gameId && screenLoaded) {
      const fetchRoom = async () => {
        try {
          const roomsData = await getRoom(gameId);
          if (roomsData !== undefined) {
            setRoomName(roomsData.name);
          }
        } catch (error) {
          console.error("Erro loading rooms:", error);
        }
      };
      fetchRoom();
    }
  }, [gameId, screenLoaded]);

  // useEffect para configurar o hub SignalR ao montar o componente
  useEffect(() => {
    if (gameId && userToken && screenLoaded) {
      gameStartHub(
        "https://localhost:8080/Gamehub",
        gameId,
        imageListColored.length,
        setConnection
      );

      return () => {
        connection?.stop();
      };
    }
  }, [gameId, userToken, screenLoaded]);

  // useEffect para configurar a recepção de números sorteados, cartelas e ranking
  useEffect(() => {
    if (connection && gameId && userToken && !startScreenModal) {
      gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);

      gameReceivedNumber(connection, (number: number) => {
        console.log("Número recebido: ", number);
        setDraftedNumber(number);
        setNumbersAlreadyDrawn((prevNumbers) => [...prevNumbers, number]);
        setNextNumberTimer(timerNumber);
      });

      gameGetBoard(connection, userToken, imageListColored.length);

      // aqui eu preciso receber alem das informações do board, preciso do nome do jogador também
      gameReceivedBoard(connection, (value: string) => {
        setPlayerName("Daniel");
        setBoardNumbers(value.split(",").map((number) => parseInt(number)));
      });

      gameGetRanking(connection, gameId);

      gameReceivedRanking(connection, (ranking: IRanking[]) => {
        // debugger;
        setRanking(ranking);
      });

      gameUpdateRanking(connection, (attRanking: IRanking) => {
        setRanking((prevRanking) => {
          const updatedRanking = prevRanking.map((player) =>
            player.playerId === attRanking.playerId
              ? { ...player, playerPoint: attRanking.playerPoint }
              : player
          );
          return updatedRanking;
        });
      });

      gameEndGame(connection, (playerName: string, playerToken: string) => {
        setWinningPlayer(playerName);
        setWinningPlayerToken(playerToken);
      });
    }
  }, [connection, gameId, userToken, startScreenModal]);

  // useEffect para gerenciar o temporizador para o próximo número sorteado
  useEffect(() => {
    if (nextNumberTimer > 0 && connection && gameId) {
      const timer = setTimeout(() => {
        setNextNumberTimer(nextNumberTimer - 1);

        if (
          nextNumberTimer - 1 === 0 &&
          numbersAlreadyDrawn.length < imageListColored.length
        ) {
          gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);
        } else {
          setNextNumberTimer(-1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [nextNumberTimer]);

  // useEffect para mostrar um alerta quando o jogo é vencido
  useEffect(() => {
    if (winningPlayer !== "") {
      if (userToken === winningPlayerToken) {
        setNextNumberTimer(-1);
        showError('Você gannhou o jogo', "errorMessage");
      }
      else {
        showError(`O Jogador ${winningPlayer} ganhou o jogo!`, "errorMessage");
      }
    }
  }, [winningPlayer]);

  return (
    <Fragment>
      {!screenLoaded && <div className="main-screen"></div>}

      {(screenLoaded && winningPlayer === "") &&
        <div className="main-screen column">
          <div className="game-room-background-image-space">
            <img
              src={backImage}
              className="game-room-background-image"
              alt="Imagem de fundo"
            />
          </div>

          <div className="game-room-header">
            <p className="game-room-header-title">BINGO</p>
            <img
              className="game-room-header-img"
              src={plantLogo}
              alt="Logo do projeto"
            />
          </div>

          <div className="game-room-content">
            <div className="game-room-main-grid">
              <div className="game-room-names column">
                <div className="game-room-name">
                  <p className="game-room-name-title">
                    SALA {roomName.toUpperCase()}
                  </p>
                </div>

                <div className="game-room-players column">
                  {ranking.map((rank) => (
                    <div className="game-room-player" key={rank.playerId}>
                      <div className="game-room-player-box-intern">
                        <p className="game-room-player-name-text">
                          {rank.playerName}
                        </p>
                        <p className="game-room-player-name-text">
                          {rank.playerPoint === 0 ? "000" : rank.playerPoint}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="game-room-game-box column">
                <div className="game-room-game-box-background"></div>
                <PlayerBoard
                  name={playerName}
                  boardNumbers={boardNumbers}
                  numbersAlreadyDrawn={numbersAlreadyDrawn}
                  draftedNumber={draftedNumber}
                  markNumber={markNumber}
                  imageListColored={imageListColored}
                  imageListBlackWhite={imageListBlackWhite}
                  mark={mark}
                  gridSelected={gridSelected}
                  setGridSelected={setGridSelected}
                />
              </div>
            </div>
          </div>

          <div className="game-room-footer">
            <div className="game-room-footer-content">
              <div className="game-room-footer-content-icons">
                <img
                  className="game-room-att-button"
                  src={helpButton}
                  onClick={() => setOpenHelpRoom(true)}
                  alt="Botão de informações"
                />
              </div>
              <div
                className="game-room-footer-new-room"
                onClick={() => callBingo()}
              >
                <div className="game-room-footer-new-room-intern">
                  <p className="game-room-footer-new-room-text">BINGO</p>
                </div>
              </div>
            </div>
          </div>

          <Modal open={startScreenModal} onClose={() => setStartScreenModal(false)}>
            <div className="game-room-modal-screen">
              <div className="game-room-modal-box column">
                <div className="game-room-modal-header">
                  <div className="game-room-modal-header-circle" />
                  <p className="game-room-modal-header-title">REGRAS BÁSICAS</p>
                  <div className="game-room-modal-header-circle" />
                </div>
                <div className="game-room-modal-content column">
                  <div className="game-room-modal-advice-text-content">
                    <p className="game-room-modal-advice-text">O jogo irá começar em {startSecondCount} segundos</p>
                  </div>
                  <div className="game-room-modal-advice-text-content">
                    <div className="game-room-modal-text-background" />
                    <div className="column">
                      <p className="game-room-modal-advice-text">
                        O jogo vai começar!
                      </p>
                      <ul>
                        <li className="game-room-modal-advice-text">A cada x segundos, uma planta será sorteada</li>
                        <li className="game-room-modal-advice-text">Marque as plantas na sua cartela quando forem sorteadas</li>
                        <li className="game-room-modal-advice-text">O primeiro a marcar toda a cartela e clicar no botão Bingo ganha</li>
                        <li className="game-room-modal-advice-text">Informações mais detalhadas no botão ajuda (?)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="game-room-modal-create-room">
                    <img
                      src={backButton}
                      className="game-room-modal-back-button"
                      onClick={() => setStartScreenModal(false)}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          <Modal open={openHelpRoom} onClose={() => setOpenHelpRoom(false)}>
            <RulesModal setOpenHelpRoom={setOpenHelpRoom} />
          </Modal>
        </div>
      }

      {screenLoaded && winningPlayer !== "" && (
        <div
          className="main-screen column" style={{ justifyContent: "center" }}
        >
          <div className="end-game-box column">
            <div className="end-game-box-header row">
              <div className="end-game-header-circle" />
              <div className="end-game-header-imgs column">
                <img
                  className="end-game-header-img-end-game"
                  src={endGameImage}
                  alt="Logo do projeto"
                />
                <img
                  className="end-game-header-img-victory"
                  src={victoryImage}
                  alt="Logo do projeto"
                />
                <p className="end-game-header-winner-player">{ranking[0].playerName}</p>
                <img
                  className="end-game-header-img-stage"
                  src={stageImage}
                  alt="Logo do projeto"
                />
              </div>
              <div className="end-game-header-circle" />
            </div>
            <div className="end-game-box-ranking row">
              {ranking.map((item, index) => (
                <div className="end-game-ranking-row">
                  {index === 0 ?
                  (<div className="end-game-ranking-winner-label">
                    <div className="end-game-ranking-winner-label-intern">
                      <p className="end-game-ranking-winner-label-text">Vencedor</p>
                    </div>
                  </div>) :
                  (<div className="end-game-ranking-label">
                    <div className="end-game-ranking-label-intern">
                      <p className="end-game-ranking-label-text">{`${index + 1}º`} Lugar</p>
                    </div>
                  </div>)}
                  <div className="end-game-ranking-player-info">
                    <p className="end-game-ranking-player-name">{item.playerName}</p>
                    <p className="end-game-ranking-player-points">{item.playerPoint} pts!</p>
                  </div>
                </div>
              ))}
              {[...Array(4 - ranking.length)].map((_, index) => (
                <div className="end-game-ranking-row">
                </div>
              ))}
            </div>
            <img 
              className="end-game-home-button"
              src={homeButton} 
              onClick={() => {
                if (connection && gameId) {
                  gameSendActionToHub(connection, gameId);
                  goToHomeScreen()
                }
              }}
              alt="Botão de voltar para a Home"
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
