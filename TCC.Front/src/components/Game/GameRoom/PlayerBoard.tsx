import { useEffect, useState } from "react";
import "./PlayerBoard.css";

let maxValue = 21;

const images = require.context("../../../imgs", true);
const imageList = images.keys().map((image) => images(image));

export function PlayerBoard({ name, sortedNumber, boardNumbers }: Props) {
  const [gridPositions, setGridPositions] = useState<number[]>(boardNumbers);
  const [gridSelected, setGridSelected] = useState<boolean[]>([false, false, false, false, false, false]);

  useEffect(() => {
    if (gridPositions.includes(sortedNumber)) {
      let index = gridPositions.indexOf(sortedNumber);
      let markGrid = gridSelected;
      markGrid[index] = true;

      setGridSelected(markGrid);

      if (!gridSelected.includes(false)) {
        setTimeout(() => {
          alert(`jogador ${name} ganhou`);
          // setStartGame(false);
        }, 100);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedNumber]);

  return (
    // <div className={`player-board-extern player-board-${position} column`}>
    <div className="player-board-extern column">
      <div className="player-board-header">
        <p className="player-board-name white-color not-selectable">{name}</p>
        <div className="player-board-bingo-button" onClick={() => console.log("")}>
          <p>BINGO!</p>
        </div>
        <div className="player-board-check-button" onClick={() => console.log("")}>
          <p>marcar</p>
        </div>
      </div>
      <div className="player-board-intern">
        <div className="player-board-grid column">
          {gridPositions.map((item, index) => (
            <div
              key={index}
              className="player-board-grid-cell align not-selectable column"
            >
              <img
                className={
                  gridSelected[index]
                    ? "grayscale player-board-image"
                    : "white-color player-board-image"
                }
                src={imageList[item]}
                alt={imageList[item].split("/")[2].split(".")[0]}
              />
              <div className='player-board-overlay'>
                <p className='player-board-grid-image-text'>{imageList[item].split('/')[3].split('.')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Props {
  name: string;
  sortedNumber: number;
  boardNumbers: number[];
}
