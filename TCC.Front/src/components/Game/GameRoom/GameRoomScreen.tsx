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

const images = require.context("../../../imgs", true);
const imageList = images.keys().map((image) => images(image));

let timerNumber = 1;

export default function GameRoomScreen() {
  const { gameId } = useParams();
  const userToken = Cookies.get("userToken");

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [draftedNumber, setDraftedNumber] = useState<number>(-1);
  const [nextNumberTimer, setNextNumberTimer] = useState<number>(0);

  const [numbersAlreadyDrawn, setNumbersAlreadyDrawn] = useState<number[]>([]);

  const [boardNumbers, setBoardNumbers] = useState<number[]>([]);

  const [ranking, setRanking] = useState<IRanking[]>([]);

  const [playerName, setPlayerName] = useState<string>('');

  const [winningPlayer, setWinningPlayer] = useState<string>('');

  const markNumber = () => {
    if (connection && gameId && userToken) {
      const updatedRanking = ranking.map(player => 
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
  }

  useEffect(() => {
    if (gameId && userToken) {
      gameStartHub("https://localhost:8080/Gamehub", gameId, imageList.length, setConnection);

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
        setPlayerName('Daniel');
        setBoardNumbers(value.split(",").map(number => parseInt(number)));
      });

      gameGetRanking(connection, gameId);

      gameReceivedRanking(connection, (ranking: IRanking[]) => {
        debugger;
        setRanking(ranking);
      });

      gameUpdateRanking(connection, (attRanking: IRanking) => {
        setRanking((prevRanking) => {
          const updatedRanking = prevRanking.map(player => 
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

        if (nextNumberTimer - 1 === 0 && numbersAlreadyDrawn.length < imageList.length) {
          gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);
        }
        else {
          setNextNumberTimer(-1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [nextNumberTimer]);

  useEffect(() => {
    if (winningPlayer !== '') {
      alert(`O Jogador ${winningPlayer} ganhou o jogo!`);
      setNextNumberTimer(-1);
    }
  }, [winningPlayer]);

  return (
    <div className="main-screen">
      <div className="sorter-grid-extern column">
        {nextNumberTimer !== -1 ?
          (<p className="sorter-timer-text">
              Próximo sorteio em {nextNumberTimer} segundos...
          </p>) :
          (winningPlayer === '' ?
            (<p className="sorter-timer-text">
              Todas as plantas já foram sorteadas
            </p>) :
            (<p className="sorter-timer-text">
              Jogo finalizado {winningPlayer} venceu o jogo
            </p>)
          )
        }
        <div className="sorter-row-items">
          <div className="sorter-ranking-space column">
            <p>Ranking</p>
            {ranking.map((rank) => (
              <p key={rank.playerId}>{rank.playerName}: {rank.playerPoint === 0 ? '000' : rank.playerPoint}</p>
            ))}
          </div>
          <div className="sorter-grid-intern align">
            {draftedNumber !== -1 && (
              <img
                className="sorter-board-image"
                src={imageList[draftedNumber]}
                alt={imageList[draftedNumber].split("/")[3].split(".")[0]}
              />
            )}
            {draftedNumber !== -1 && (
              <div className="sorter-overlay">
                <p className="sorter-board-image-text">
                  {imageList[draftedNumber].split("/")[3].split(".")[0]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {boardNumbers.length > 0 &&
        <PlayerBoard name={playerName} boardNumbers={boardNumbers} numbersAlreadyDrawn={numbersAlreadyDrawn} markNumber={markNumber} callBingo={callBingo} />
      }
    </div>
  );
}
