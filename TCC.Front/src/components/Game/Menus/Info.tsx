import "./Info.css";
import backImage from "../../../imgs/icons/back.png";

const images = require.context("../../../imgs/plants", true);
const imageList = images.keys().map((image) => images(image));

export default function Info({ setScreen }: Props) {
  return (
    <div className="main-screen main-screen-info">
      <img src={backImage} className="info-back-button" onClick={() => setScreen(0)} alt="Botão de retornar a tela principal" />
      <div className="info-plants-space">
        {imageList.map((item, index) => (
          <div className="info-plant-box" key={index}>
            <div className="info-box-imagem">
              <img className="info-image" src={item} alt="Imagem representativa da planta em questão" />
            </div>
            <div className="info-box-text">
              <p className="info-box-title">{item.split("/")[3].split(".")[0].toUpperCase()}</p>
              <p className="info-box-title-scientific">nome científico</p>
              <p className="info-box-full-text">utilização/curiosidades: lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  setScreen: (value: number) => void;
}
