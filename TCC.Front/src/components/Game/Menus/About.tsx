import "./About.css";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import aboutImage from "../../../imgs/layout/about-image.png";
import backImage from "../../../imgs/icons/back.png";
import petLogo from "../../../imgs/layout/logo_10anos.png"
import ruralLogo from "../../../imgs/layout//rural_logo01.png"
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  
  // Função que redireciona o usuário para a tela inicial
  const goToHomeScreen = () => {
    navigate(`/`);
  };
  
  return (
    <div className="main-screen">
      <div className="about-image-space">
        <img
          src={aboutImage}
          className="about-image"
          alt="Imagem a esquerda representativa do projeto"
        />
      </div>
      <div className="about-text-space">
        <div className="about-title">
          <div className="about-title-box column">
            <p className="about-title-logo">BINGO</p>
            <div className="row">
              <p className="about-title-logo-2">PLANTAS</p>
              <p className="about-title-logo-3">MEDICINAIS</p>
            </div>
            <img src={plantLogo} className="plant-logo" alt="Logo do projeto" />
          </div>
        </div>
        <div className="about-info">
          <div className="about-info-text-space">
            <p className="about-info-title">PROJETO</p>
            <p className="about-info-text">
              Este projeto, desenvolvido no PET do curso de Sistemas de Informação da UFRRJ, visa criar uma versão digital 
              do tradicional bingo de plantas medicinais, com o intuito de tornar o aprendizado sobre essas plantas mais 
              acessível e envolvente. O jogo foi idealizado como uma ferramenta educativa para ensinar sobre as propriedades, 
              usos terapêuticos e curiosidades das plantas medicinais de forma lúdica e interativa. <br />
              Além de promover a educação sobre fitoterapia, o jogo estimula a curiosidade e o aprendizado colaborativo, 
              utilizando elementos de competição saudável para engajar os participantes. A interface amigável garante que 
              o jogo seja acessível tanto para aqueles familiarizados com tecnologia quanto para aqueles que estão dando 
              seus primeiros passos no mundo digital, tornando-o uma ferramenta inclusiva e educativa para todas as idades.
            </p>
          </div>
          <div className="about-info-footer">
            <div className="column">
              <div className="about-info-footer-text-space">
                <p className="about-info-footer-text">CURSO</p>
                <p className="about-info-footer-text-course-name">
                  &nbsp;SISTEMAS DA INFORMAÇÃO
                </p>
              </div>
              <div className="row">
                <img
                  src={petLogo}
                  className="about-info-footer-pet-logo"
                  alt="Logo do grupo pet"
                />
                <img
                  src={ruralLogo}
                  className="about-info-footer-rural-logo"
                  alt="Logo do grupo pet"
                />
              </div>
            </div>
            <img
              src={backImage}
              className="about-info-footer-back"
              onClick={() => goToHomeScreen()}
              alt="Botão de retornar a tela principal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}