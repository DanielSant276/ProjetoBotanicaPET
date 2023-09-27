import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import './Sorter.css';

const totalNumbers = 21;
const divWidth = [260]

export function Sorter({ sendSortedNumber, startGame, setStartGame }: Props ) {
  const [sortedNumber, setSortedNumber] = useState<number>(-1);
  const [numbersSorted, setNumbersSorted] = useState<boolean[]>([]);
  const [divDesmounted, setDivDesmounted] = useState<boolean[]>([]);
  const [timesRotated, setTimesRotated] = useState<number>(0);
  
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [moveToLeft, setMoveToLeft] = useState<number>(0);
  const [animationStoped, setAnimationStoped] = useState<boolean>(false);

  const leftoverNumbers = useRef<number[]>([]);
  const intervalId = useRef<NodeJS.Timer>();

  const generateAnimation = () => {
    // if (sortedNumber !== -1) {
    //   setNumbersSorted(numbersSorted.slice(0, 21));

    //   for (let i = 0; i < totalNumbers; i++) {
    //     divDesmounted.push(false);
    //   }
    // }

    setDisableButton(true);

    let index = Math.floor(Math.random() * leftoverNumbers.current.length);
    let number = leftoverNumbers.current[index];
    setSortedNumber(number);
    console.log(number);

    let rotation = Math.floor(Math.random() * 10) + 15;
    setTimesRotated(rotation);
    console.log(`número de voltas: ${rotation}`);

    let speed = 500;

    intervalId.current = setInterval(() => {
      setMoveToLeft(prevPosition => prevPosition + speed);
      speed -= 2;
      // console.log(speed);
    }, 100);
  }

  useEffect(() => {
    if (timesRotated > 0) {
      console.log(`foram dadas: ${timesRotated}`);
    }
  }, [timesRotated]);

  const stopAnimation = () => {
    clearInterval(intervalId.current);
    setDisableButton(false);
    setTimesRotated(0);
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

  useEffect(() => {
    if (numbersSorted.length === 0) {
      for (let i = 0; i < totalNumbers; i++) {
        numbersSorted.push(false);
        divDesmounted.push(false);
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
            numbersSorted.map((item, index) => {              
              let leftPosition;

              if (animationStoped && index % totalNumbers === sortedNumber && Math.floor(index / totalNumbers) === timesRotated) {
                leftPosition = 21;
              }
              else {
                leftPosition = 21 - moveToLeft + (divWidth[0] * index);
              }

              if (leftPosition >= 1060) {
                return null;
              }

              if (leftPosition <= -810) {
                if (!divDesmounted[index]) {
                  let divsStatus = divDesmounted;
                  divsStatus[index] = true;
                  divsStatus.push(false);
                  setDivDesmounted(divsStatus);

                  let newNumbersSorted = numbersSorted;
                  newNumbersSorted.push(item);
                  setNumbersSorted(newNumbersSorted);

                  if (index % totalNumbers === 0) {
                    setTimesRotated(prevState => prevState++)
                  }
                }
                return null;
              }

              let value = index % totalNumbers;
              if (leftPosition < 21 && index % totalNumbers === sortedNumber && Math.floor(index / totalNumbers) === timesRotated) {
                setAnimationStoped(true);
                stopAnimation();

                return null;
              }
              else if (leftPosition !== 21 && index % totalNumbers !== sortedNumber && Math.floor(index / totalNumbers) >= timesRotated) {
                return null;
              }

              let val = index % totalNumbers;

              return (
                <div
                  key={index}
                  className='sorter-image-box align'
                  style={{left: `${leftPosition}px`}}>
                  <p className={`sorted-number not-selectable ${item ? 'red-color' : 'white-color'}`}>
                    {val}
                  </p>
                </div>
              )
            })
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
