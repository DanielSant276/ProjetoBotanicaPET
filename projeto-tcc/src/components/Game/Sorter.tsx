import { Dispatch, SetStateAction } from 'react';
import './Sorter.css';

export function Sorter({
  sortedNumber,
  generateNextNumber,
  startGame,
  setStartGame,
}: Props) {
  return (
    <div className='sorter-grid-extern column'>
      <div className='sorter-grid-intern'>
        {/* <p className='sorted-number not-selectable'> */}
          {sortedNumber > -1 ? (
            <div className='sorter-image-box align' style={{left: '0px'}}>
              <p className='sorted-number white-color'>{sortedNumber}</p>
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
        onClick={() => generateNextNumber()}
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
  generateNextNumber: () => void;
  startGame: boolean;
  setStartGame: Dispatch<SetStateAction<boolean>>;
}
