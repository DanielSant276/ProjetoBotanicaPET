import "./About.css";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import aboutImage from "../../../imgs/layout/about-image.png";
import backImage from "../../../imgs/icons/back.png";
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              mattis finibus sapien sed placerat. Donec ultricies non est at
              sodales. Integer molestie justo vitae efficitur hendrerit. Nunc
              cursus at dui ac aliquet. Cras pharetra, diam non cursus
              fringilla, est mi posuere erat, condimentum blandit nunc metus
              vitae mauris. Cras tempus et ex nec rutrum. Integer ligula metus,
              lobortis et cursus quis, laoreet nec nunc. Vestibulum eu feugiat
              ligula, a volutpat quam. Aenean vehicula, libero vel viverra
              ultricies, velit dolor dapibus magna, et tristique turpis ante
              quis ligula. Aliquam sit amet laoreet arcu. In hac habitasse
              platea dictumst. Sed consectetur semper efficitur. Sed efficitur
              velit neque, sit amet condimentum nunc consectetur et. Vestibulum
              ipsum mauris, lobortis eget suscipit nec, tempus eu risus.
            </p>
          </div>
          <div className="about-info-footer">
            <div className="about-info-footer-text-space">
              <p className="about-info-footer-text">CURSO</p>
              <p className="about-info-footer-text-course-name">
                &nbsp;SISTEMAS DA INFORMAÇÃO
              </p>
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