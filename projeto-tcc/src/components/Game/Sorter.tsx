import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import './Sorter.css';

export function Sorter({ sortedNumber, setSortedNumber, startGame, setStartGame }: Props) {
  const numbersAlreadySorted = useRef<number[]>([]);
  const sorterSpeed = useRef<number>(10);
  const genareteNumbers = useRef<number>(0);

  const intervalId = useRef<NodeJS.Timer>();
  const [startAnimation, setStartAnimation] = useState<boolean>(false);

  const [showNumber, setShowNumber] = useState<number>(-1);
  
  useEffect(() => {
    if (startAnimation) {
      const fastIntervalId = setInterval(() => {
        if (genareteNumbers.current < 2000) {
          genareteNumbers.current += 80;
          setShowNumber(Math.floor(Math.random() * 21));
        } else {
          clearInterval(fastIntervalId);
        }
      }, 500);

      const slowIntervalId = setInterval(() => {
        if (sorterSpeed.current < 4000) {
          sorterSpeed.current += 200;
          setShowNumber(Math.floor(Math.random() * 21));
        } else {
          clearInterval(slowIntervalId);
          stopAnimation();
          let regenerateNumber = showNumber;
          while (numbersAlreadySorted.current.includes(regenerateNumber) || regenerateNumber < 0) {
            regenerateNumber = Math.floor(Math.random() * 21);
          }
          setShowNumber(regenerateNumber);
          console.log(regenerateNumber);
        }
      }, sorterSpeed.current/5);
      
      return () => clearInterval(slowIntervalId); // Limpe o intervalo quando o componente for desmontado
    }
  }, [startAnimation, showNumber]);
  
  const stopAnimation = () => {
    setStartAnimation(false);
  };
  

  return (
    <div className='sorter-grid-extern column'>
      <div className='sorter-grid-intern'>
        {/* <p className='sorted-number not-selectable'> */}
          {showNumber > -1 ? (
            <div className='sorter-image-box align' style={{left: '0px'}}>
              <p className='sorted-number white-color'>{showNumber}</p>
            </div>
          ) : (
            <div>
              <p className='sorted-number'></p>
            </div>
          )}
        {/* </p> */}
      </div>

      <div
        className='sorter-next-button align link'
        onClick={() => setStartAnimation(true)}
      >
        {startGame ? (
          <div className='not-selectable'>Próximo</div>
        ) : (
          <div className='not-selectable' onClick={() => setStartGame(true)}>
            Iniciar
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  sortedNumber: number;
  setSortedNumber: Dispatch<SetStateAction<number>>
  startGame: boolean;
  setStartGame: Dispatch<SetStateAction<boolean>>;
}
