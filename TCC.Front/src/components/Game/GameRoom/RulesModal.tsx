import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import backButton from "../../../imgs/icons/back.png";

export default function RulesModal({ setOpenHelpRoom}: Props){
  return (
    <div className="game-room-modal-screen">
      <div className="game-room-modal-box column">
        <div className="game-room-modal-header">
          <div className="game-room-modal-header-circle" />
          <p className="game-room-modal-header-title">COMO JOGAR</p>
          <div className="game-room-modal-header-circle" />
        </div>
        <div className="game-room-modal-content column">
          <div className="game-room-modal-logo">
            <p className="game-room-modal-logo-title">BINGO</p>
            <img
              className="game-room-modal-logo-img"
              src={plantLogo}
              alt="Logo do projeto"
            />
          </div>

          <div className="game-room-modal-text-content">
            <div className="game-room-modal-text-background" />
            <p className="game-room-modal-text">
              A cada 5 segundos, uma nova planta será sorteada. As plantas não 
              marcadas aparecem em preto e branco na sua cartela, enquanto as 
              já marcadas ficam coloridas. A cada planta marcada, você ganha 
              100 pontos. Para vencer, você deve acumular 600 pontos e, além 
              disso, apertar o botão Bingo. Independente de quem alcançar 600 
              pontos primeiro, só vence quem apertar o botão Bingo.
            </p>
          </div>

          <div className="game-room-modal-create-room">
            <img
              src={backButton}
              className="game-room-modal-back-button"
              onClick={() => setOpenHelpRoom(false)}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  setOpenHelpRoom: (value: boolean) => void;
}