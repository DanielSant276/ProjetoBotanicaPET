import { useEffect, useState } from "react";
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
  gameStartHub,
  gameUpdateRanking,
} from "../Api/hubGameRoom";
import { useParams } from "react-router-dom";
import { HubConnection } from "@microsoft/signalr";
import { IRanking } from "../../../interfaces/IRanking";
import Cookies from "js-cookie";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import helpButton from "../../../imgs/icons/help.png";
import homeButton from "../../../imgs/icons/home.png";
import backButton from "../../../imgs/icons/back.png";
import backImage from "../../../imgs/layout/plants-wheel-intern.png";
import { Modal } from "@mui/material";
import { getRoomName } from "../Api/useRooms";

const images = require.context("../../../imgs/plants", true);
const imageList = images.keys().map((image) => images(image));

let timerNumber = 1;

export default function GameRoomScreen() {
  const { gameId } = useParams();
  const userToken = Cookies.get("userToken");

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [draftedNumber, setDraftedNumber] = useState<number>(-1);
  const [nextNumberTimer, setNextNumberTimer] = useState<number>(0);

  const [numbersAlreadyDrawn, setNumbersAlreadyDrawn] = useState<number[]>([]);

  const [boardNumbers, setBoardNumbers] = useState<number[]>([]);

  const [ranking, setRanking] = useState<IRanking[]>([]);

  const [playerName, setPlayerName] = useState<string>("");

  const [openHelpRoom, setOpenHelpRoom] = useState<boolean>(false);
  const [winningPlayer, setWinningPlayer] = useState<string>("");

  const markNumber = () => {
    if (connection && gameId && userToken) {
      const updatedRanking = ranking.map((player) =>
        player.playerId === userToken
          ? { ...player, playerPoint: player.playerPoint + 100 }
          : player
      );

      // Atualiza o estado com o novo array
      setRanking(updatedRanking);
      gameGainPoint(connection, gameId, userToken);
    }
  };

  const callBingo = () => {
    if (connection && gameId && userToken) {
      gameCallBingo(connection, gameId, userToken);
    }
  };

  useEffect(() => {
    if (gameId) {
      const fetchRoom = async () => {
        try {
          const roomsData = await getRoomName(gameId);
          if (roomsData !== undefined) {
            setRoomName(roomsData.name);
          }
        } catch (error) {
          console.error("Erro loading rooms:", error);
        }
      };

      fetchRoom();
    }
  }, [gameId]);

  useEffect(() => {
    if (gameId && userToken) {
      gameStartHub(
        "https://localhost:8080/Gamehub",
        gameId,
        imageList.length,
        setConnection
      );

      return () => {
        connection?.stop();
      };
    }
  }, [gameId, userToken]);

  useEffect(() => {
    if (connection && gameId && userToken) {
      gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);

      gameReceivedNumber(connection, (number: number) => {
        console.log("Número recebido: ", number);
        setDraftedNumber(number);
        setNumbersAlreadyDrawn((prevNumbers) => [...prevNumbers, number]);
        setNextNumberTimer(timerNumber);
      });

      gameGetBoard(connection, userToken, imageList.length);

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

      gameEndGame(connection, (playerName: string) => {
        setWinningPlayer(playerName);
      });
    }
  }, [connection, gameId, userToken]);

  useEffect(() => {
    if (nextNumberTimer > 0 && connection && gameId) {
      const timer = setTimeout(() => {
        setNextNumberTimer(nextNumberTimer - 1);

        if (
          nextNumberTimer - 1 === 0 &&
          numbersAlreadyDrawn.length < imageList.length
        ) {
          gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);
        } else {
          setNextNumberTimer(-1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [nextNumberTimer]);

  useEffect(() => {
    if (winningPlayer !== "") {
      alert(`O Jogador ${winningPlayer} ganhou o jogo!`);
      setNextNumberTimer(-1);
    }
  }, [winningPlayer]);

  return (
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
              markNumber={markNumber}
              callBingo={callBingo}
            />
          </div>
        </div>
      </div>

      <div className="game-room-footer">
        <div className="game-room-footer-content">
          <div className="game-room-footer-content-icons">
            {/* <img
              className="game-room-back-button"
              src={homeButton}
              // onClick={() => setScreen(0)}
            /> */}
            <img
              className="game-room-att-button"
              src={helpButton}
              onClick={() => setOpenHelpRoom(true)}
              alt="Botão de informações"
            />
          </div>
          <div
            className="game-room-footer-new-room"
            // onClick={() => createNewRoomOpener(true)}
          >
            <div className="game-room-footer-new-room-intern">
              <p className="game-room-footer-new-room-text">BINGO</p>
            </div>
          </div>
        </div>
      </div>

      <Modal open={openHelpRoom} onClose={() => setOpenHelpRoom(false)}>
        <div className="game-room-modal-screen">
          <div className="game-room-modal-box column">
            <div className="game-room-modal-header">
              <div className="game-room-modal-header-circle" />
              <p className="game-room-modal-header-title">COMO JOGAR</p>
              <div className="game-room-modal-header-circle" />
            </div>
            <div className="game-room-modal-content column">
              <div className="game-room-modal-logo">
                <p className="game-room-modal-logo-title">BINGO</p>
                <img
                  className="game-room-modal-logo-img"
                  src={plantLogo}
                  alt="Logo do projeto"
                />
              </div>

              <div className="game-room-modal-text-content">
                <div className="game-room-modal-text-background" />
                <p className="game-room-modal-text">
                  O Bingo é um jogo pipipopopopo, você faz isso e aquilo,
                  escolhe cartela e vê se a sua cartela bate com as foto que vão
                  aparecer, nesse caso tem erva e se tuas ervas aparecerem você
                  marca e aí você pontua e se pontuar as seis ervas você ganha,
                  mas pra ganhar tem que aparecer as seis ervas da sua cartela
                  na roleta do bingo e se for isso daí mesmo você ganha, mas
                  lembra do Uno? Então, é parecido, do mesmo jeito que foda-se
                  se você só tem uma carta, você tem que gritar UNO, foda-se se
                  você marcou as seis ervas, TEM QUE MARCAR BINGOOO pra ganhar,
                  beleza? Só apertar o botão vermelho grande escrito BINGO, sua
                  mula. É assim que joga bingo de erva medicinal.
                </p>
              </div>

              <div className="game-room-modal-create-room">
                <img
                  src={backButton}
                  className="game-room-modal-back-button"
                  onClick={() => setOpenHelpRoom(false)}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
