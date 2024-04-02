import "./About.css";

export default function About({ setScreen }: Props) {
  return (
    <div className="main-screen">
      <p className="title">Sobre</p>
      <div className="about-options-box">
        <p className="about-text">Projeto realizado pelo aluno x, participante do grupo pet, como projeto para conclusão de curso</p>
      </div>
      <div className="about-back-button" onClick={() => setScreen(0)}>Voltar</div>
    </div>
  );
}

interface Props {
  setScreen: (value: number) => void;
}