import { useState } from "react";
import "./PlayerBoard.css";

const images = require.context("../../../imgs/plants", true);
const imageList = images.keys().map((image) => images(image));

export function PlayerBoard({
  name,
  boardNumbers,
  numbersAlreadyDrawn,
  markNumber,
  callBingo,
}: Props) {
  const [gridPositions] = useState<number[]>(
    /* boardNumbers */ [0, 1, 2, 3, 4, 5]
  );
  const [gridSelected, setGridSelected] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  // const [gridSelected, setGridSelected] = useState<boolean[]>([true, true, true, true, true, true]);

  const [mark, setMark] = useState<boolean>(false);

  const handleCheck = (image: number, index: number) => {
    if (mark) {
      setMark(false);
      if (gridSelected[index]) {
        alert("número já selecionado");
        return;
      }

      if (numbersAlreadyDrawn.includes(image)) {
        let index = gridPositions.indexOf(image);
        let markGrid = gridSelected;
        markGrid[index] = true;

        setGridSelected(markGrid);
        markNumber();
      } else {
        alert("número ainda não selecionado");
      }
    }
  };

  const verifyBingo = () => {
    if (gridSelected.every((value) => value === true)) {
      callBingo();
      alert("BINGO! Você venceu");
    } else {
      alert("Ainda falta marcar algumas plantas!");
    }
  };

  return (
    // <div className="player-board-extern column">
    //   <div className="player-board-header">
    //     <p className="player-board-name white-color not-selectable">{name}</p>
    //     <div
    //       className="player-board-bingo-button"
    //       onClick={() => verifyBingo()}
    //     >
    //       <p>BINGO!</p>
    //     </div>
    //     <div
    //       className="player-board-check-button"
    //       onClick={() => setMark(true)}
    //     >
    //       <p>Marcar</p>
    //     </div>
    //   </div>
    //   <div className="player-board-intern">
    //     <div className="player-board-grid column">
    //       {gridPositions.map((item, index) => (
    //         <div
    //           key={index}
    //           className={
    //             gridSelected[index]
    //               ? "player-board-grid-cell align not-selectable column"
    //               : (
    //               mark
    //                 ? "player-board-grid-cell align not-selectable column clickable"
    //                 : "player-board-grid-cell align not-selectable column")
    //           }
    //           onClick={() => handleCheck(item, index)}
    //         >
    //           <img
    //             className={
    //               gridSelected[index]
    //                 ? "grayscale player-board-image"
    //                 : "white-color player-board-image"
    //             }
    //             src={imageList[item]}
    //             alt={imageList[item].split("/")[2].split(".")[0]}
    //           />
    //           <div className="player-board-overlay">
    //             <p className="player-board-grid-image-text">
    //               {imageList[item].split("/")[3].split(".")[0]}
    //             </p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="player-board column">
      <div className="player-board-sorter">
        <img className="" />
      </div>
      <div className="player-board-grid">
        <div className="player-board-grid-image">
          <img />
        </div>
        <div className="player-board-grid-image">
          <img />
        </div>
        <div className="player-board-grid-image">
          <img />
        </div>
        <div className="player-board-grid-image">
          <img />
        </div>
        <div className="player-board-grid-image">
          <img />
        </div>
        <div className="player-board-grid-image">
          <img />
        </div>
      </div>
    </div>
  );
}

interface Props {
  name: string;
  boardNumbers: number[];
  numbersAlreadyDrawn: number[];
  markNumber: () => void;
  callBingo: () => void;
}
