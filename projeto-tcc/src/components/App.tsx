import { useEffect, useRef, useState } from 'react';
import './App.css';
import { PlayerBoard } from './PlayerBoard';
import { Sorter } from './Sorter';

const maxPlayers = 4;

export default function App() {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<string[]>(['Daniel', 'Ayrton', 'A', 'B']);
  const [sortedNumber, setSortedNumber] = useState<number>(-1);
  const numbersSorted = useRef<number[]>([]);

  const getPositions = () => {
    switch (players.length) {
      case 1:
        return ['center'];
      case 2:
        return ['bottom-left-only-2-bottom', 'bottom-right-only-2-bottom'];
      case 3:
        return ['bottom-left', 'center', 'bottom-right'];
      case 4:
        return ['bottom-left-only-2-bottom', 'bottom-right-only-2-bottom', 'top-left', 'top-right'];
    }
  };

  const generateNextNumber = () => {
    let newNumber = -1;
    while (numbersSorted.current.includes(newNumber) || newNumber < 0) {
      newNumber = Math.floor(Math.random() * 21);
    }

    numbersSorted.current.push(newNumber);
    setSortedNumber(newNumber);

    numbersSorted.current.sort((a, b) => a - b);
    console.log(numbersSorted.current);
  };

  useEffect(() => {
    if (startGame) {
      generateNextNumber();
    }
  }, [startGame]);

  return (
    <div className='Screen column'>
      {players.map((item, index) => {
        let positions = getPositions();

        return (
          <PlayerBoard
            key={index}
            name={players[index]}
            position={positions ? positions[index] : ''}
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
      />
    </div>
  );
}