import { Dispatch, SetStateAction } from 'react';
import './Sorter.css';

const images = require.context('../../imgs', true);
const imageList = images.keys().map(image => images(image));

export function Sorter({
  sortedNumber,
  generateNextNumber,
  startGame,
  setStartGame,
  imageNames,
}: Props) {
  return (
    <div className='sorter-grid-extern column'>
      <div className='sorter-grid-intern'>
        {/* <p className='sorted-number not-selectable'> */}
          {sortedNumber > -1 ? (
            <div className='sorter-image-box align'>
              {/* <p className='sorted-number white-color'>{sortedNumber}</p> */}
              <img className='sorter-board-image' src={imageList[sortedNumber]} alt={imageList[sortedNumber].split('/')[2].split('.')[0]}/>
            </div>
          ) : (
            <div>
              <p className='sorted-number'></p>
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
  imageNames: string[];
}
