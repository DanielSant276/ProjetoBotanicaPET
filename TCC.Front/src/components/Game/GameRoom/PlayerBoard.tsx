import { useState } from "react";
import "./PlayerBoard.css";
import { useErrorModal } from "../ErrorModal/ErrorModalProvider";

export function PlayerBoard({
  name,
  boardNumbers,
  numbersAlreadyDrawn,
  draftedNumber,
  markNumber,
  imageListColored,
  imageListBlackWhite,
  mark,
  gridSelected,
  setGridSelected
}: Props) {
  const [gridPositions] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const { showError } = useErrorModal();

  // Função para verificar se um número deve ser marcado no tabuleiro
  const handleCheck = (image: number, index: number) => {
    if (mark) {
      // setMark(false);
      if (gridSelected[index]) {
        showError("Planta já marcada", "sideErrorMessage");
        return;
      }

      if (numbersAlreadyDrawn.includes(image)) {
        let index = gridPositions.indexOf(image);
        let markGrid = gridSelected;
        markGrid[index] = true;

        setGridSelected(markGrid);
        markNumber();
      } else {
        showError("Planta ainda não selecionada", "sideErrorMessage");
      }
    }
  };

  return (
    <div className="player-board column">
      <div className="player-board-sorter">
        {draftedNumber !== -1 &&
          <img src={imageListColored[draftedNumber]} alt="Planta sorteada" />
        }
      </div>
      <div className="player-board-grid">
        {gridPositions.map((item, index) => (
          <div className="player-board-grid-image" key={index} onClick={() => handleCheck(item, index)}>
            {!gridSelected[index] ? 
              (<img src={imageListBlackWhite[item]} alt={imageListBlackWhite[item].split("/")[2].split(".")[0]} />) :
              (<img src={imageListColored[item]} alt={imageListColored[item].split("/")[2].split(".")[0]} />)
            }
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  name: string;
  boardNumbers: number[];
  numbersAlreadyDrawn: number[];
  draftedNumber: number;
  markNumber: () => void;
  imageListColored: string[];
  imageListBlackWhite: string[];
  mark: boolean;
  gridSelected: boolean[];
  setGridSelected: (value: boolean[]) => void;
}
