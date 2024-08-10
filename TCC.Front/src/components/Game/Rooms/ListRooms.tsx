import { Fragment, useEffect, useState } from "react";
import "./ListRooms.css";
import { createRoom, getRooms } from "../Api/useRooms";
import { IRoom } from "../../../interfaces/IRoom";
import { IPlayer } from "../../../interfaces/IPlayer";
import { updateUser } from "../Api/useUser";
import Room from "./Room";
import { Modal } from "@mui/material";
import plantLogo from "../../../imgs/layout/plants-logo-bingo.png";
import backButton from "../../../imgs/icons/back.png";
import playButton from "../../../imgs/icons/play.png";
import attButton from "../../../imgs/icons/att.png";
import { vigenereEncrypt } from "../EncryptFunction/vigenere";

export default function ListRooms({ setScreen, user, setUser }: Props) {
  const [rooms, setRooms] = useState<IRoom[] | undefined>();
  const [roomsNotStarted, setRoomsNotStarted] = useState<number>(0);
  const [roomChosed, setRoomChosed] = useState<IRoom | null>(null);
  const [reloadRooms, setReloadRooms] = useState<boolean>(false);

  const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>("");

  const [emptyName, setEmptyName] = useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidWord, setInvalidWord] = useState<string[]>([]);

  const [roomsNumbers, setRoomsNumbers] = useState<number[]>([]);

  const verifyRoom = (room: IRoom) => {
    if (user.name !== "" && !user.name.startsWith(" ")) {
      if (room.numberOfPlayers > 3) {
        alert("Essa sala está lotada");
      } else {
        setRoomChosed(room);
      }
    } else {
      alert("Adicione um nome apropriado antes de tentar entrar na sala");
    }
  };

  const handleChangeUser = (newName: string) => {
    let player = user;
    player.name = newName;

    setUser({ ...player });
  };

  const handleChangeNewRoomName = (newRoomName: string) => {
    setNewRoomName(newRoomName);
  };

  const resetRoom = () => {
    setRoomChosed(null);
    setTimeout(() => {
      setReloadRooms(!reloadRooms);
    }, 500);
  };

  const createNewRoomOpener = (open: boolean) => {
    if (user.name === "") {
      alert("nome do jogador não selecionado");
    } else {
      setOpenCreateRoom(open);
    }
  };

  const createNewRoom = async () => {
    setInvalidName(false);
    setEmptyName(false);

    if (newRoomName === "") {
      setEmptyName(true);
      return;
    } else {
      setInvalidName(false);
      setEmptyName(false);
    }

    if (verifyInvalidName(newRoomName)) {
      setInvalidName(true);
      return;
    } else {
      setInvalidName(false);
    }

    setOpenCreateRoom(false);

    let newRoom = await createRoom(newRoomName, user);
    if (newRoom) {
      setRoomChosed(newRoom);
      // loobyGetAllRoomsInvoke(connection);
    } else {
      alert("Ocorreu um erro na criação da sala");
      return;
    }
    // final da parte do hub
    setNewRoomName("");
  };

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

  useEffect(() => {
    let numbers = [];

    for (let i = 0; i < 15; i++) {
      numbers.push(Math.floor(Math.random() * 100) + 1);
    }

    setRoomsNumbers(numbers);
  }, []);

  // verifica as salas que existe e recarrega sempre que alguém apertar em um botão de load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRooms();
        if (roomsData !== undefined) {
          setRooms(roomsData);

          const countNotStartedRooms = roomsData.filter(
            (room) => !room.started
          ).length;

          setRoomsNotStarted(countNotStartedRooms);
        }
      } catch (error) {
        console.error("Erro loading rooms:", error);
      }
    };

    fetchRooms();
  }, [reloadRooms]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (roomChosed == null) {
        setReloadRooms(!reloadRooms);
        console.log("reload");
      }
    }, 20000); // 20 segundos em milissegundos

    // Limpa o intervalo quando o componente é desmontado ou atualizado
    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // debouncer
  useEffect(() => {
    const debounceFunction = setTimeout(() => {
      if (user.name !== "") {
        if (verifyInvalidName(user.name)) {
          alert("nome escolhido não é valido");
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

  // pega as palavras do arquivo
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
                if (!room.started) {
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
                }
                return null;
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
                  onClick={() => setScreen(0)}
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
                      className="rooms-modal-alert-text-no-name"
                      style={{
                        display: emptyName ? "flex" : "none",
                        alignSelf: "center",
                      }}
                    >
                      Insira um nome para a nova sala
                    </p>
                    <p
                      className="rooms-modal-alert-text-invalid-name"
                      style={{
                        display: invalidName ? "flex" : "none",
                        alignSelf: "center",
                      }}
                    >
                      Nome inválido
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

interface Props {
  setScreen: (value: number) => void;
  user: IPlayer;
  setUser: (value: IPlayer) => void;
}
