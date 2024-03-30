import {
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import "./ConfigScreen.css";

export function ConfigScreen({ setPlayers }: Props) {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [playerSelected, setPlayerSelected] = useState<boolean>(false);
  const [playersName, setPlayersName] = useState<string[]>(['']);
  const [noPlayerName, setNoPlayerName] = useState<boolean>(false);
  const [repeatedPlayerName, setRepeatedPlayerName] = useState<boolean>(false);

  const playerOptions = [
    { id: "option1", label: 1 },
    { id: "option2", label: 2 },
    { id: "option3", label: 3 },
    { id: "option4", label: 4 },
  ];

  const handleOptionChange = (event: { target: { value: string } }) => {
    let players = parseInt(event.target.value, 10);
    let newPlayersName = [];

    for (let i = 0; i < players; i++) {
      newPlayersName.push("");
    }

    setNumberOfPlayers(players);
    setPlayersName(newPlayersName);
  };

  const handlePlayersName = (event: { target: { value: string } }, index: number) => {
    if (event.target.value.length <= 8) {
      let names = [...playersName];
      names[index] = event.target.value;
      setPlayersName(names);
    } 
  };

  const verifyNames = () => {
    for (let i = 0; i < playersName.length; i++) {
      if (playersName[i] === ''){
        setNoPlayerName(true);
        return;
      }
      else {
        setNoPlayerName(false);
      }
      for (let j = i + 1; j < playersName.length; j++) {
        if (playersName[i] === playersName[j]) {
          setRepeatedPlayerName(true);
          return;
        }
        else {
          setRepeatedPlayerName(false)
        }
      }
    }
      
    setPlayers(playersName);
  }

  return (
    <div className="config-principal-box column">
      {!playerSelected ? (
        <div className="config-players column">
          <p className="config-title white-color not-selectable">
            Selecione a quantidade de jogadores:
          </p>

          <div className="align">
            {playerOptions.map((item, index) => (
              <div key={index} id={item.id} className="config-input-and-text">
                <input
                  className="config-radio not-selectable"
                  type="radio"
                  name="player-number"
                  value={item.label}
                  checked={numberOfPlayers === item.label}
                  onChange={handleOptionChange}
                />
                <p className="white-color not-selectable">{item.label}</p>
              </div>
            ))}
          </div>

          <div
            className="config-players-select-button link align"
            onClick={() => setPlayerSelected(true)}
          >
            <p className="white-color not-selectable">Confirmar</p>
          </div>
        </div>
      ) : (
        <div className="config-players-name column">
          <div className='error-text-box column'>
            <p className={`red-color text-center ${noPlayerName ? 'visible' : 'not-visible'}`}>Um dos nomes está vazio <br/> por favor preencha!</p>
            <p className={`red-color text-center ${repeatedPlayerName ? 'visible' : 'not-visible'}`}>Nomes repetidos, por favor alterar</p>
          </div>

          {playersName.map((item, index) => (
            <div className="config-players-name-space column" key={index}>
              <p className="white-color">
                Nome do jogador número {index + 1} (max.: 8 caracteres)
              </p>
              <input
                type="text"
                value={playersName[index]}
                onChange={(event) => handlePlayersName(event, index)}
              />
            </div>
          ))}
          <div className="row ">
            <div
              className="config-players-select-button link align"
              onClick={() => setPlayerSelected(false)}
            >
              <p className="white-color not-selectable">Voltar</p>
            </div>
            <div className="config-players-select-button link align" onClick={() => verifyNames()}>
              <p className="white-color not-selectable">Confirmar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  setPlayers: Dispatch<SetStateAction<string[]>>;
}
