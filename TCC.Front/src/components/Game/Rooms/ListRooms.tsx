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
import attButton from "../../../imgs/icons/att.png";

export default function ListRooms({ setScreen, user, setUser }: Props) {
  const [rooms, setRooms] = useState<IRoom[] | undefined>();
  const [roomChosed, setRoomChosed] = useState<IRoom | null>(null);
  const [reloadRooms, setReloadRooms] = useState<boolean>(false);

  const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>("");

  const [emptyName, setEmptyName] = useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidWord, setInvalidWord] = useState<string[]>([]);

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
  };

  const createNewRoomOpener = (open: boolean) => {
    if (user.name === "") {
      alert("nome do jogador não selecionado");
    } else {
      setOpenCreateRoom(open);
    }
  };

  const createNewRoom = async () => {
    if (newRoomName === "") {
      setEmptyName(true);
      return;
    }

    if (verifyInvalidName(newRoomName)) {
      setInvalidName(true);
      return;
    }

    setEmptyName(false);
    setInvalidName(false);
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
      if (
        invalidWord.includes(name) ||
        invalidWord.includes(name.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  // verifica as salas que existe e recarrega sempre que alguém apertar em um botão de load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRooms();
        if (roomsData !== undefined) {
          setRooms(roomsData);
        }
      } catch (error) {
        console.error("Erro loading rooms:", error);
      }
    };

    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadRooms]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (roomChosed == null) {
        setReloadRooms(!reloadRooms);
        console.log("reload");
      }
    }, 20000); // 20 segundos em milissegundos

    // Limpa o intervalo quando o componente é desmontado ou atualizado
    return () => clearInterval(intervalId);
  }, []);

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
  }, [user]);

  // pega as palavras do arquivo
  useEffect(() => {
    fetch("/notValidWords.txt")
      .then((response) => response.text())
      .then((texto) => {
        const lines = texto.split("\n");

        const stringsProcessadas = lines
          .map((linha) => linha.trim().replace(/,$/, ""))
          .filter((linha) => linha);
        setInvalidWord(stringsProcessadas);
      })
      .catch((error) => console.error("Erro ao carregar o arquivo:", error));
  }, []);

  return (
    <Fragment>
      {roomChosed === null ? (
        <div className="main-screen column">
          <div className="rooms-header">
            <p className="rooms-header-title">BINGO</p>
            <img className="rooms-header-img" src={plantLogo} />
          </div>

          <div className="rooms-content">
            <div className="rooms-grid">
              <div className="rooms-grid-box column">
                <p className="rooms-grid-box-text">SALA DO NAME</p>
                <p className="rooms-grid-box-rooms-players">3/4</p>
              </div>
              {Array.from({ length: 14 }, (_, index) =>
                index === 7 ? (
                  <div className="rooms-green-grid-box column">
                    <p className="rooms-green-grid-text-1">ESPAÇO</p>
                    <p className="rooms-green-grid-text-2">LIVRE</p>
                  </div>
                ) : (
                  <div className="rooms-grid-box-number">
                    <p className="rooms-grid-box-text-number">36</p>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="rooms-footer">
            <div className="rooms-footer-content">
              <div className="rooms-footer-content-icons">
                <img className="rooms-back-button" src={backButton} onClick={() => setScreen(0)} />
                <img className="rooms-att-button" src={attButton} onClick={() => setReloadRooms(!reloadRooms)} />
              </div>
              <input 
                className="rooms-footer-name-input" 
                type="text"
                placeholder="Escolha um nome de jogador (máximo de 10 letras)"
                value={user.name}
                onChange={(event) => handleChangeUser(event.target.value)} 
              />
              <div className="rooms-footer-new-room" onClick={() => createNewRoomOpener(true)}>
                <div className="rooms-footer-new-room-intern">
                  <p className="rooms-footer-new-room-text">NOVA SALA</p>
                </div>
              </div>
            </div>
          </div>
            {/* <div className="rooms-chose-room">
              {(rooms?.length === 0 ||
                rooms?.filter((room) => !room.started).length === 0) && (
                <div className="no-room">
                  <p>Nenhuma sala foi criada</p>
                </div>
              )}
              {rooms?.map((room) => {
                if (!room.started) {
                  return (
                    <div
                      className="rooms-info"
                      key={room.id}
                      onClick={() => verifyRoom(room)}
                    >
                      <p
                        className={`${
                          room.numberOfPlayers === 4 ? "red-color" : ""
                        }`}
                      >
                        Sala {room.name}
                      </p>
                      <p
                        className={`${
                          room.numberOfPlayers === 4 ? "red-color" : ""
                        }`}
                      >
                        {room.numberOfPlayers}/4
                      </p>
                    </div>
                  );
                }
                return <div key={0}></div>;
              })}
            </div>
            <div className="rooms-new-room-buttons">
              <div className="rooms-new-room" onClick={() => setScreen(0)}>
                <p>Voltar</p>
              </div>
              <div
                className="rooms-new-room"
                onClick={() => setReloadRooms(!reloadRooms)}
              >
                <p>Recarregar salas</p>
              </div>
              <div className="align">
                <p>Nome do Jogador:</p>
                <input
                  className="rooms-name-input"
                  type="text"
                  placeholder="Escolha um nome"
                  value={user.name}
                  onChange={(event) => handleChangeUser(event.target.value)}
                />
                <div
                  className="rooms-back-button"
                  onClick={() => createNewRoomOpener(true)}
                >
                  <p>Nova Sala</p>
                </div>
              </div>
            </div> */}

          <Modal
            open={openCreateRoom}
            onClose={() => createNewRoomOpener(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="rooms-modal-box">
              <p className="rooms-modal-title">Nome da sala</p>

              <div className="column">
                <p
                  className="rooms-modal-alert-text-no-name"
                  style={{ display: emptyName ? "flex" : "none" }}
                >
                  Insira um nome para a nova sala
                </p>
                <p
                  className="rooms-modal-alert-text-invalid-name"
                  style={{ display: invalidName ? "flex" : "none" }}
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
                <div
                  className="rooms-back-button"
                  onClick={() => createNewRoomOpener(false)}
                >
                  <p>Voltar</p>
                </div>

                <div
                  className="rooms-back-button"
                  onClick={() => createNewRoom()}
                >
                  <p>Criar sala</p>
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
