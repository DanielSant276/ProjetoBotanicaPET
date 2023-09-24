import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import './Sorter.css';

const totalNumbers = 21;

export function Sorter({ sendSortedNumber, startGame, setStartGame }: Props ) {
  const [sortedNumber, setSortedNumber] = useState<number>(-1);
  const [numbersSorted, setNumbersSorted] = useState<boolean[]>([]);
  const leftoverNumbers = useRef<number[]>([]);
  
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [moveLeft, setMoveLeft] = useState<boolean>(false);
  const [moveToLeft, setMoveToLeft] = useState<number>(0);

  const generateAnimation = () => {
    setDisableButton(true);
    setMoveLeft(true);

    // Inicia o intervalo para mover a div a cada 100ms
    const intervalId = setInterval(() => {
      setMoveToLeft((prevPosition) => prevPosition + 80);
    }, 100);

    // Define um timeout para parar o movimento após 2 segundos (por exemplo)
    setTimeout(() => {
      clearInterval(intervalId);
      setMoveLeft(false);
      setDisableButton(true);
    }, 650 * 20);
  }

  // aqui é criado um número e depois marca ele como 'true' no numberSorted, tirando da lista leftoverNumbers
  const generateNextNumber = () => {
    if (leftoverNumbers.current.length !== 0){
      let index = Math.floor(Math.random() * leftoverNumbers.current.length);
      let number = leftoverNumbers.current[index];

      setSortedNumber(number);
      sendSortedNumber(number);

      let newNumbersSorted = numbersSorted;
      newNumbersSorted[number] = true;

      setNumbersSorted(newNumbersSorted);
      leftoverNumbers.current.splice(index, 1);
  
      console.log(numbersSorted);
      console.log(leftoverNumbers.current);
    }
    else {
      alert("não há mais números para serem sorteados");
    }
  };

  const positonImages = (index: number) => {
    if (index === 0) {
      return {
        left: `calc(21px - ${moveToLeft}px)`,
      }
    }
    else {
      return {
        left: `calc(21px + (var(--cardWidth) * ${index}) - ${moveToLeft}px)`,
      }
    }
  }

  useEffect(() => {
    if (numbersSorted.length === 0) {
      for (let i = 0; i < totalNumbers; i++) {
        numbersSorted.push(false);
      }
      console.log(numbersSorted)
      console.log(numbersSorted.length)
    }
  }, []);

  useEffect(() => {
    if (leftoverNumbers.current.length === 0) {
      for (let i = 0; i < totalNumbers; i++) {
        leftoverNumbers.current.push(i);
      }
      console.log(leftoverNumbers.current)
      console.log(leftoverNumbers.current.length)
    }
  }, []);

  return (
    <div className='sorter-grid-extern column'>
      <div className='sorter-grid-intern'>
        {/* <p className='sorted-number not-selectable'> */}
          {startGame ? (
            numbersSorted.map((item, index) => (
              <div
                key={index}
                className='sorter-image-box align'
                style={positonImages(index)}>
                <p className={`sorted-number not-selectable ${item ? 'red-color' : 'white-color'}`}>
                  {index}
                </p>
              </div>
            ))
          ) : (
            <div>
              <p className='sorted-number'></p>
            </div>
          )}
        <div className='gambiarra1'></div>
        <div className='gambiarra2'></div>
        {/* </p> */}
      </div>

      
        {startGame ? (
          <div
            className='sorter-next-button align link'
            onClick={disableButton ? () => null : generateAnimation}
          >    
            <div className='not-selectable'>Próximo</div>
          </div>
        ) : (
          <div
            className='sorter-next-button align link'
            onClick={() => setStartGame(true)}
          >
            <div className='not-selectable'>
              Iniciar
            </div>
          </div>
        )}
    </div>
  );
}

interface Props {
  sendSortedNumber: Dispatch<React.SetStateAction<number>>;
  startGame: boolean;
  setStartGame: Dispatch<SetStateAction<boolean>>;
}
