import { Fragment, useEffect, useRef, useState } from "react";
import "./App.css";
import { PlayerBoard } from "./Game/PlayerBoard";
import { Sorter } from "./Game/Sorter";
import { ConfigScreen } from "./Config/ConfigScreen";

export default function App() {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<string[]>(['a', 'b', 'c']);
  const [sortedNumber, setSortedNumber] = useState<number>(-1);

  const getPositions = () => {
    switch (players.length) {
      case 1:
        return ["center"];
      case 2:
        return ["bottom-left-only-2-bottom", "bottom-right-only-2-bottom"];
      case 3:
        return ["bottom-left", "center", "bottom-right"];
      case 4:
        return [
          "top-left",
          "top-right",
          "bottom-left-only-2-bottom",
          "bottom-right-only-2-bottom",
        ];
    }
  };

  return (
    <div className="Screen column">
      {players.length === 0 ? (
        <Fragment>
          <ConfigScreen setPlayers={setPlayers} />
        </Fragment>
      ) : (
        <Fragment>
          {players.map((item, index) => {
            let positions = getPositions();

            return (
              <PlayerBoard
                key={index}
                name={players[index]}
                position={positions ? positions[index] : ""}
                sortedNumber={sortedNumber}
                setStartGame={setStartGame}
              />
            );
          })}

          <Sorter
            sendSortedNumber={setSortedNumber}
            startGame={startGame}
            setStartGame={setStartGame}
          />
        </Fragment>
      )}
    </div>
  );
}
