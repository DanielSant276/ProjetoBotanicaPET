import { Fragment } from "react";
import "./App.css";
import plantLogo from "../imgs/layout/plants-logo-bingo.png";
import plantsCircleIntern from "../imgs/layout/plants-wheel-intern.png";
import plantsCircleExtern from "../imgs/layout/plants-wheel-extern.png";
import play from "../imgs/icons/play.png";
import infoProject from "../imgs/icons/info-project.png";
import infoPlants from "../imgs/icons/info-plants.png";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  
  // Função para mudar de tela com base no nome da rota passada
  const changeScreen = (screen: string) => {
    navigate(`/${screen}`);
  };

  return (
    <div>
      <Fragment>
        <div className="main-screen column">
          <div className="title-space">
            <div className="title-box column">
              <p className="title-logo">BINGO</p>
              <div className="row">
                <p className="title-logo-2">PLANTAS</p>
                <p className="title-logo-3">MEDICINAIS</p>
              </div>
              <img
                src={plantLogo}
                className="plant-logo"
                alt="Logo do projeto"
              />
            </div>
          </div>

          <div className="buttons-space">
            <div className="image-wrapper">
              <div className="circle-image-intern">
                <img
                  src={plantsCircleIntern}
                  alt="Imagem de plantas interna que gira a esquerda"
                />
              </div>
              <div className="circle-image-extern">
                <img
                  src={plantsCircleExtern}
                  alt="Imagem de plantas externas que gira a direita"
                />
              </div>
            </div>
            <div className="play-icon" onClick={() => changeScreen("Rooms")}>
              <img src={play} alt="Botão de jogar" />
              <p>JOGAR</p>
            </div>
            <div className="info-project-icon" onClick={() => changeScreen("About")}>
              <img src={infoProject} alt="Botão de informações do projeto" />
              <p>PROJETO</p>
            </div>
            <div className="info-plants-icon" onClick={() => changeScreen("Info")}>
              <img src={infoPlants} alt="Botão de informações das plantas" />
              <p>PLANTAS</p>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
