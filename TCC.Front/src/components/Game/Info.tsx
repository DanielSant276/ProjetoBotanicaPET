import { useState } from "react";
import "./Info.css";

export default function Info({ setScreen }: Props) {
  const [plants, setPlants] = useState<number[]>([0, 1, 2, 3, 4]);

  return (
    <div className="main-screen" style={{justifyContent: 'unset'}}>
      <p className="info-title">Info</p>
      <div className="info-back-button" onClick={() => setScreen(0)}>
        Voltar
      </div>
      {plants.map((item, index) => (
        <div className="info-plant-box" key={index}>
          <div className="info-box-imagem">
            <p>Imagem</p>
          </div>
          <div className="info-box-text">
            <p>nome: nome</p>
            <p>nome científico: nome</p>
            <p>utilização/curiosidades: lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
               lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
               lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  setScreen: (value: number) => void;
}
