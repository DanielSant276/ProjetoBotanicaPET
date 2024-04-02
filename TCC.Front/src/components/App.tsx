import { Fragment, useState } from "react";
import "./App.css";
import About from "./Game/About";
import Info from "./Game/Info";

export default function App() {
  const [screen, setScreen] = useState<number>(3);

  return (
    <div>
      <Fragment>
        {screen === 0 && (
          <div className="main-screen">
            <p className="title">Bingo plantas medicinais</p>

            <div className="options-box">
              <div onClick={() => setScreen(1)}>Entrar em uma sala</div>
              <div onClick={() => setScreen(2)}>Sobre</div>
              <div onClick={() => setScreen(3)}>Info plantas medicinais</div>
            </div>
          </div>
        )}

        {/* {screen === 2 && (
          
        )} */}

        {screen === 2 && (
          <About setScreen={setScreen} />
        )}

        {screen === 3 && (
          <Info setScreen={setScreen} />
        )}

        {/* {players.map((item, index) => {
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
          sortedNumber={sortedNumber}
          generateNextNumber={generateNextNumber}
          startGame={startGame}
          setStartGame={setStartGame}
          imageNames={imageNames}
        /> */}
      </Fragment>
    </div>
  );
}
