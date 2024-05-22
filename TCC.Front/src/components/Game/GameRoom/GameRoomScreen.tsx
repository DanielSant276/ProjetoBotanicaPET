import { useEffect, useState } from "react";
import "./GameRoomScreen.css";
import { PlayerBoard } from "./PlayerBoard";
import {
  gameGetBoard,
  gameGetNumber,
  gameGetRanking,
  gameReceivedBoard,
  gameReceivedNumber,
  gameReceivedRanking,
  gameStartHub,
} from "../Api/hubGameRoom";
import { useParams } from "react-router-dom";
import { HubConnection } from "@microsoft/signalr";
import { IRanking } from "../../../interfaces/IRankings";
import Cookies from "js-cookie";

const images = require.context("../../../imgs", true);
const imageList = images.keys().map((image) => images(image));

export default function GameRoomScreen() {
  const { gameId } = useParams();
  const userToken = Cookies.get("userToken");

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [draftedNumber, setDraftedNumber] = useState<number>(-1);
  const [nextNumberTimer, setNextNumberTimer] = useState<number>(0);

  const [numbersAlreadyDrawn, setNumbersAlreadyDrawn] = useState<number[]>([]);

  const [boardNumbers, setBoardNumbers] = useState<number[]>([]);

  const [ranking, setRanking] = useState<IRanking[]>([]);

  // useEffect(() => {
  //   if (imageList) {
  //     console.log(imageList[draftedNumber].split("/")[3].split(".")[0]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [imageList]);

  useEffect(() => {
    if (gameId) {
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
  }, [gameId]);

  useEffect(() => {
    if (connection && gameId && userToken) {
      gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);

      gameReceivedNumber(connection, (number: number) => {
        console.log("Número recebido: ", number);
        setDraftedNumber(number);
        setNumbersAlreadyDrawn((prevNumbers) => [...prevNumbers, number]);
        setNextNumberTimer(10);
      });

      gameGetBoard(connection, gameId, userToken, imageList.length);

      gameReceivedBoard(connection, (value: string) => {
        setBoardNumbers(value.split(",").map(number => parseInt(number)));
      });

      gameGetRanking(connection, gameId);

      gameReceivedRanking(connection, (ranking: IRanking[]) => {
        setRanking(ranking);
      });
    }
  }, [connection, gameId, userToken]);

  // useEffect(() => {
  //   if (nextNumberTimer > 0 && connection && gameId) {
  //     const timer = setTimeout(() => {
  //       setNextNumberTimer(nextNumberTimer - 1);

  //       if (nextNumberTimer - 1 === 0) {
  //         gameGetNumber(connection, gameId, numbersAlreadyDrawn.length);
  //       }
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [nextNumberTimer]);

  return (
    <div className="main-screen">
      <div className="sorter-grid-extern column">
        <p className="sorter-timer-text">
          Próximo sorteio em {nextNumberTimer} segundos...
        </p>
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
        <PlayerBoard name={"Daniel"} sortedNumber={draftedNumber} boardNumbers={boardNumbers} />
      }
    </div>
  );
}
