import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./PlayerBoard.css";

let maxValue = 21;

export function PlayerBoard({
  name,
  position,
  sortedNumber,
  setStartGame,
}: Props) {
  const [gridPositions, setGridPositions] = useState<number[]>([]);
  const [gridSelected, setGridSelected] = useState<boolean[]>([false, false, false, false, false, false]);

  useEffect(() => {
    const generateRandomNumber = () => {
      let values: number[] = [];

      for (let i = 0; i < 6; i++) {
        let numberGenerated = Math.floor(Math.random() * maxValue);

        if (!values.includes(numberGenerated)) {
          values.push(numberGenerated);
        } else {
          i--;
        }
      }

      return values;
    };

    setGridPositions(generateRandomNumber());
  }, []);

  useEffect(() => {
    if (gridPositions.includes(sortedNumber)) {
      let index = gridPositions.indexOf(sortedNumber);
      let markGrid = gridSelected;
      markGrid[index] = true;

      setGridSelected(markGrid);

      if (!gridSelected.includes(false)) {
        setTimeout(() => {
          alert(`jogador ${name} ganhou`);
          setStartGame(false);
        }, 100);
      }
    }
  }, [sortedNumber]);

  return (
    <div className={`player-board-extern player-board-${position} column`}>
      <p className="player-board-name white-color not-selectable">{name}</p>
      <div className="player-board-intern">
        <div className="player-board-grid column">
          {gridPositions.map((item, index) => (
            <div
              key={index}
              className="player-board-grid-cell align not-selectable"
            >
              <p className={gridSelected[index] ? "red-color" : "white-color"}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Props {
  name: string;
  position: string;
  sortedNumber: number;
  setStartGame: Dispatch<SetStateAction<boolean>>;
}
