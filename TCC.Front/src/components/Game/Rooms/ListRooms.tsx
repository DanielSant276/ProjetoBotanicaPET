import { Fragment, useEffect, useState } from "react";
import "./ListRooms.css";
import {
  createRoom,
  getRooms,
  getVerifyRoom,
} from "../Api/useRooms";
import { IRoom } from "../../../interfaces/IRoom";
import { IPlayer } from "../../../interfaces/IPlayer";
import { getUser, updateUser } from "../Api/useUser";
import Room from "./Room";
import { Modal } from "@mui/material";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import backButton from "../../../imgs/icons/back.png";
import playButton from "../../../imgs/icons/play.png";
import attButton from "../../../imgs/icons/att.png";
import { vigenereEncrypt } from "../EncryptFunction/vigenere";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useErrorModal } from "../ErrorModal/ErrorModalProvider";

const playerPlaceHolder: IPlayer = {
  id: "",
  name: "",
  ready: false,
};

export default function ListRooms() {
  const [rooms, setRooms] = useState<IRoom[] | undefined>();
  const [roomsNotStarted, setRoomsNotStarted] = useState<number>(0);
  const [roomChosed, setRoomChosed] = useState<IRoom | null>(null);
  const [reloadRooms, setReloadRooms] = useState<boolean>(false);

  const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>("");

  const [invalidName, setInvalidName] = useState<string>("");
  const [invalidWord, setInvalidWord] = useState<string[]>([]);

  const [roomsNumbers, setRoomsNumbers] = useState<number[]>([]);

  const [screenLoaded, setScreenLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<IPlayer>(playerPlaceHolder);

  const { showError } = useErrorModal();

  const navigate = useNavigate();

  // Redireciona o usuário para a tela inicial
  const goToHomeScreen = () => {
    navigate(`/`);
  };

  // Verifica se a sala está disponível e se o jogador pode entrar nela
  const verifyRoom = async (room: IRoom) => {
    if (user.name !== "" && !user.name.startsWith(" ") && user.name.length <= 10) {
      const roomsData = await getVerifyRoom(room.id);
      if (roomsData) {
        setRoomChosed(room);
      } else {
        showError("Essa sala está lotada", "errorMessage");
        setReloadRooms(!reloadRooms);
      }
    } else {
      showError("Adicione um nome apropriado antes de tentar entrar na sala", "errorMessage");
    }
  };

  // Atualiza o nome do jogador
  const handleChangeUser = (newName: string) => {
    let player = user;
    player.name = newName;

    setUser({ ...player });
  };

  // Atualiza o nome da nova sala a ser criada
  const handleChangeNewRoomName = (newRoomName: string) => {
    setNewRoomName(newRoomName);
  };

  const resetRoom = () => {
    setRoomChosed(null);
  };
  // Abre o modal para criar uma nova sala, verificando se o nome do jogador foi inserido
  const createNewRoomOpener = (open: boolean) => {
    if (user.name === "") {
      showError("Nome do jogador não selecionado", "errorMessage");
    } 
    else if (user.name.startsWith(" ") || user.name.length > 10) {
      showError("Nome do jogador inválido", "errorMessage");
    } 
    else {
      setOpenCreateRoom(open);
    }
  };

  // Cria uma nova sala e redireciona o jogador para ela
  const createNewRoom = async () => {

    if (newRoomName === "") {
      setInvalidName("Insira um nome para a nova sala");
      return;
    } else {
      setInvalidName("");
    }

    if (newRoomName.length > 8) {
      setInvalidName("Nome da sala com mais de 8 caracteres");
      return;
    } else {
      setInvalidName("");
    }

    if (verifyInvalidName(newRoomName)) {
      setInvalidName("Nome inválido");
      return;
    } else {
      setInvalidName("");
    }

    setOpenCreateRoom(false);
    
    let newRoom = await createRoom(newRoomName, user, showError);

    if (newRoom) {
      setRoomChosed(newRoom);
    }
    else {
      showError("Ocorreu um erro na criação da sala", "errorMessage");
      return;
    }
    
    // final da parte do hub
    setNewRoomName("");
  };

  // Verifica se o nome da sala é válido
  const verifyInvalidName = (name: string) => {
    const regex = /[^a-zA-Z0-9]/;

    if (regex.test(name)) {
      return true;
    }

    if (invalidWord.length > 0) {
      if (invalidWord.includes(vigenereEncrypt(name.toLowerCase()))) {
        return true;
      }
    }
    return false;
  };

  // carregar as informações do usuário ao montar o componente
  useEffect(() => {
    let userToken = Cookies.get("userToken");

    const fetchUser = async () => {
      const user = await getUser(userToken);

      if (user) {
        if (!userToken) {
          Cookies.set("userToken", user.id, { expires: 30 });
        }

        let newUser: IPlayer = {
          id: user.id,
          name: user.name === undefined ? "" : user.name,
          ready: false,
        };

        setUser(newUser);
      }
    };

    fetchUser();
  }, []);

  // gerar números aleatórios para exibição
  useEffect(() => {
    let numbers = [];

    for (let i = 0; i < 15; i++) {
      numbers.push(Math.floor(Math.random() * 100) + 1);
    }

    setRoomsNumbers(numbers);
  }, []);

  // carrega as salas disponíveis e as recarrega quando necessário
  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        try {
          const roomsData = await getRooms(user.id);
          if (roomsData !== undefined) {
            setRooms(roomsData);

            const countNotStartedRooms = roomsData.length;

            setRoomsNotStarted(countNotStartedRooms);

            setScreenLoaded(true);
          }
        } catch (error) {
          console.error("Erro loading rooms:", error);
        }
      };

      fetchRooms();
    }
  }, [reloadRooms, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // debouncer para verificar a validade do nome do jogador e atualizá-lo
  useEffect(() => {
    const debounceFunction = setTimeout(() => {
      if (user.name !== "") {
        if (user.name.length > 10) {
          showError("Nome escolhido é maior do que o permitido", "errorMessage");
          return;
        }
        else if (verifyInvalidName(user.name)) {
          showError("Nome escolhido não é valido", "errorMessage");
          return;
        } else {
          const fetchUser = async () => {
            await updateUser(user);
          };

          fetchUser();
        }
      }
    }, 500);

    return () => clearTimeout(debounceFunction);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // carrega as palavras inválidas a partir de um arquivo de texto
  useEffect(() => {
    fetch("/notValidWordsEncrypt.txt")
      .then((response) => response.text())
      .then((texto) => {
        const lines = texto.split("\n");

        const stringsProcessadas = lines
          .map((linha) => linha.trim().replace(/,$/, ""))
          .filter((linha) => linha);
        setInvalidWord(stringsProcessadas);
      })
      .catch((error) => console.error("Erro ao carregar o arquivo:", error));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      {roomChosed === null ? (
        <div className="main-screen column">
          <div className="rooms-header">
            <p className="rooms-header-title">BINGO</p>
            <img
              className="rooms-header-img"
              src={plantLogo}
              alt="Logo do projeto"
            />
          </div>

          <div className="rooms-content">
            <div className="rooms-grid">
              {rooms?.map((room, index) => {
                return (
                  <Fragment key={room.id}>
                    <div
                      className="rooms-grid-box column"
                      key={room.id}
                      onClick={() => verifyRoom(room)}
                    >
                      <p
                        className={`${
                          room.numberOfPlayers === 4
                            ? "rooms-grid-box-text red-color"
                            : "rooms-grid-box-text"
                        }`}
                      >
                        SALA {room.name.toUpperCase()}
                      </p>
                      <p
                        className={`${
                          room.numberOfPlayers === 4
                            ? "rooms-grid-box-rooms-players red-color"
                            : "rooms-grid-box-rooms-players"
                        }`}
                      >
                        {room.numberOfPlayers}/4
                      </p>
                    </div>

                    {index === 7 && (
                      <div
                        className="rooms-green-grid-box column"
                        key="free-room"
                      >
                        <p className="rooms-green-grid-text-1">ESPAÇO</p>
                        <p className="rooms-green-grid-text-2">LIVRE</p>
                      </div>
                    )}
                  </Fragment>
                );
              })}

              {Array.from({ length: 15 - roomsNotStarted }, (_, index) =>
                roomsNotStarted + index === 7 ? (
                  <div className="rooms-green-grid-box column" key="free-room">
                    <p className="rooms-green-grid-text-1">ESPAÇO</p>
                    <p className="rooms-green-grid-text-2">LIVRE</p>
                  </div>
                ) : (
                  <div className="rooms-grid-box-number" key={`room-${index}`}>
                    <p className="rooms-grid-box-text-number">
                      {roomsNumbers[roomsNotStarted + index]}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="rooms-footer">
            <div className="rooms-footer-content">
              <div className="rooms-footer-content-icons">
                <img
                  className="rooms-back-button"
                  src={backButton}
                  onClick={() => goToHomeScreen()}
                  alt="Botão de voltar"
                />
                <img
                  className="rooms-att-button"
                  src={attButton}
                  onClick={() => setReloadRooms(!reloadRooms)}
                  alt="Botão de atualizar as salas"
                />
              </div>
              <input
                className="rooms-footer-name-input"
                type="text"
                placeholder="Escolha um nome de jogador (máximo de 10 letras)"
                value={user.name}
                onChange={(event) => handleChangeUser(event.target.value)}
              />
              <div
                className="rooms-footer-new-room"
                onClick={() => createNewRoomOpener(true)}
              >
                <div className="rooms-footer-new-room-intern">
                  <p className="rooms-footer-new-room-text">NOVA SALA</p>
                </div>
              </div>
            </div>
          </div>

          <Modal
            open={openCreateRoom}
            onClose={() => createNewRoomOpener(false)}
          >
            <div className="rooms-modal-screen">
              <div className="rooms-modal-box column">
                <div className="rooms-modal-header">
                  <div className="rooms-modal-header-circle" />
                  <p className="rooms-modal-header-title">CRIAR NOVA SALA</p>
                  <div className="rooms-modal-header-circle" />
                </div>
                <div className="rooms-modal-content column">
                  <p className="rooms-modal-title">NOME DA SALA</p>

                  <div className="column">
                    <p
                      className="rooms-modal-alert-text-invalid-name"
                      style={{
                        display: invalidName.length > 0 ? "flex" : "none",
                        alignSelf: "center",
                      }}
                    >
                      {invalidName}
                    </p>
                    <input
                      type="text"
                      className="rooms-modal-input"
                      value={newRoomName}
                      onChange={(event) =>
                        handleChangeNewRoomName(event.target.value)
                      }
                    />
                  </div>

                  <div className="rooms-modal-create-room">
                    <img
                      src={backButton}
                      className="rooms-modal-back-button"
                      onClick={() => createNewRoomOpener(false)}
                      alt="Botão de retornar"
                    />

                    <img
                      src={playButton}
                      className="rooms-modal-back-button"
                      onClick={() => createNewRoom()}
                      alt="Botão de aceitar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <Room
          user={user}
          setUser={setUser}
          roomInfo={roomChosed}
          resetRoom={resetRoom}
        />
      )}
    </Fragment>
  );
}
