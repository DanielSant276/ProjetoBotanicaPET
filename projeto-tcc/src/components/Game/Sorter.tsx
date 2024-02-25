import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import './Sorter.css';

const totalNumbers = 21;
const divWidth = [260]

export function Sorter({ sendSortedNumber, startGame, setStartGame }: Props ) {
  const [sortedNumber, setSortedNumber] = useState<number>(-1);
  const [numbersSorted, setNumbersSorted] = useState<boolean[]>([]);
  const [divDesmounted, setDivDesmounted] = useState<boolean[]>([]);
  const [laps, setLaps] = useState<number>(0);
  
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [animationStoped, setAnimationStoped] = useState<boolean>(true);
  const [moveToLeft, setMoveToLeft] = useState<number>(0);

  const leftoverNumbers = useRef<number[]>([]);
  const intervalId = useRef<NodeJS.Timer>();
  const completeLaps = useRef<number[]>([]);
  const speed = useRef<number>(0);

  const generateAnimation = () => {
    // if (sortedNumber !== -1) {
    //   setNumbersSorted(numbersSorted.slice(0, 21));

    //   for (let i = 0; i < totalNumbers; i++) {
    //     divDesmounted.push(false);
    //   }
    // }

    setStartAnimation(true);

    let index = Math.floor(Math.random() * leftoverNumbers.current.length);
    let number = leftoverNumbers.current[index];
    setSortedNumber(number);
    console.log(number);

    let rotation = Math.floor(Math.random() * 10) + 15;
    setLaps(1);
    console.log(`número de voltas: ${rotation}`);

    let setSpeed = 20;
    speed.current = setSpeed;

    setAnimationStoped(false);

    intervalId.current = setInterval(() => {
      setMoveToLeft(prevPosition => prevPosition + speed.current);
      if (speed.current > 10) {
        // speed.current--;
      }
    }, 100);
  }

  useEffect(() => {
    if (laps > 0) {
      console.log(`foram dadas: ${laps}`);
    }
  }, [laps]);

  const stopAnimation = () => {
    clearInterval(intervalId.current);
    setStartAnimation(false);
    // setLaps(0);
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
        completeLaps.current.push(0);
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
              let leftPosition = 21 - moveToLeft + (divWidth[0] * (index + (totalNumbers * completeLaps.current[index])));

              if (completeLaps.current[sortedNumber] === laps && speed.current !== 10) {
                speed.current = 10;
              }

              if (leftPosition < -238) {
                completeLaps.current[index]++;
              }
              // else {
              //   leftPosition = 21 - moveToLeft + (divWidth[0] * (index + (totalNumbers * completeLaps.current[index])))
              // }

              // if (speed.current === 0 && sortedNumber !== index && startAnimation) {
              //   leftPosition = 21 + (divWidth[0] * (index + (totalNumbers * (completeLaps.current[index])) + 1))
              // }

              if (speed.current === 10) {
                if (!animationStoped) {
                  clearInterval(intervalId.current);
                  setAnimationStoped(true);
                }
                let divLeftPosition = parseInt(document.getElementById(`sorter-image-box-${sortedNumber}`)?.style.left.replace('px', '')!);
                
                if (divLeftPosition - speed.current > 21) {
                  leftPosition = divLeftPosition - speed.current
                }
                else if (divLeftPosition - speed.current < 21) {
                  leftPosition = 21;
                  speed.current = 0;
                }
                else {
                  leftPosition = leftPosition - speed.current;
                }
              }

              

              // if (animationStoped && index % totalNumbers === sortedNumber && Math.floor(index / totalNumbers) === laps) {
              //   leftPosition = 21;
              // }
              // else {
              //   leftPosition = 21 - moveToLeft + (divWidth[0] * index);
              // }


              return (
                <div
                  key={index}
                  id={`sorter-image-box-${index}`}
                  className='sorter-image-box align'
                  style={{left: `${leftPosition}px`}}>
                  <p className={`sorted-number not-selectable ${item ? 'red-color' : 'white-color'}`}>
                    {index}
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
            onClick={startAnimation ? () => null : generateAnimation}
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
