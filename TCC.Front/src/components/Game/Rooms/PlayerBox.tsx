import React, { useEffect, useRef } from 'react';
import { IPlayer } from '../../../interfaces/IPlayer';

export default function PlayerBox({ player, index, addMarginBottom }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);

  // useEffect para diminuir o tamanho da fonte caso o nome fique maior do que o tamanho total
  useEffect(() => {
    if (divRef.current) {
      const container = divRef.current.querySelector('.room-player-box-intern') as HTMLDivElement;
      const textElement = container.querySelector('p') as HTMLParagraphElement;

      if (container && textElement) {
        let fontSize = 25; // Tamanho máximo desejado
        textElement.style.fontSize = `${fontSize}px`;

        while (textElement.scrollWidth > container.clientWidth - 40 && fontSize > 0) {
          fontSize -= 1;
          textElement.style.fontSize = `${fontSize}px`;
        }
      }

      if (index !== 4) {
        let box = container.parentNode as HTMLDivElement;
        
        let playersBox = box.parentNode as HTMLDivElement

        const paddingTop = parseFloat(getComputedStyle(playersBox).paddingTop);
        const paddingBottom = parseFloat(getComputedStyle(playersBox).paddingBottom);
        const height = playersBox.clientHeight - paddingTop - paddingBottom;

        let marginSpace = Math.floor((height - (4 * box.scrollHeight)) / 3);

        box.style.marginBottom = `${marginSpace}px`;
      }
    }
  }, [player.name]);

  return (
    <div
      key={`${player.name}-${index}`}
      className={
        player.ready
          ? "room-player-ready"
          : "room-player-not-ready"
      }
      ref={divRef}
    >
      <div className="room-player-box-intern">
        <p
          className={
            player.ready
              ? "room-player-ready-name-text"
              : "room-player-not-ready-name-text"
          }
        >
          {player.name}
        </p>
        <div
          className={
            player.ready
              ? "room-ready-light"
              : "room-not-ready-light"
          }
        />
      </div>
    </div>
  );
};

interface Props {
  player: IPlayer;
  index: number;
  addMarginBottom: boolean;
}