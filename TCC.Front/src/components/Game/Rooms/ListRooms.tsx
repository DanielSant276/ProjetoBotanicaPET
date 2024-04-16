import { Fragment, useEffect, useState } from "react";
import "./ListRooms.css";
import { getRooms } from "../Api/useRooms";
import { IRoom } from "../../../interfaces/IRoom";
import { IPlayer } from "../../../interfaces/IPlayer";
import { updateUser } from "../Api/useUser";
import Room from "./Room";
import { HubConnection } from "@microsoft/signalr";
import { lobbyStartHub } from "../Api/lobbyHub";

export default function ListRooms({ setScreen, user, setUser }: Props) {
  const [rooms, setRooms] = useState<IRoom[] | undefined>();
  const [roomChosed, setRoomChosed] = useState<IRoom | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  // const [players, setPlayers] = useState<IPlayer[] | null>(null);

  const verifyRoom = (room: IRoom) => {
    if (room.numberOfPlayers > 3) {
      alert("Essa sala está lotada");
    } else {
      setRoomChosed(room)
    }
  };

  const handleChangeUser = (newName: string) => {
    let player = user;    
    player.name = newName;
    
    setUser({ ...player});
  };

  const resetRoom = () => {
    setRoomChosed(null);
  }

  useEffect(() => {
    if (rooms === undefined) {
      const fetchRooms = async () => {
        try {
          const roomsData = await getRooms();
          if (roomsData !== undefined) {
            setRooms(roomsData);
          }
        } catch (error) {
          console.error('Erro loading rooms:', error);
        }
      };
      
      fetchRooms();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    lobbyStartHub("https://localhost:8080/LobbyHub", setConnection);

    return () => {
      connection?.stop();
    };
  }, []);

  useEffect(() => {
    const debounceFunction = setTimeout(() => {
      if (user.name !== "") {
        const fetchUser = async () => {
          await updateUser(user);
        }
    
        fetchUser();
      }
    }, 500);

    return () => clearTimeout(debounceFunction);
  }, [user]);

  return (
    <Fragment>
      {roomChosed === null ?
        (
          <div className="main-screen">
            <p className="rooms-title">Salas</p>

            <div className="rooms-box" key='teste'>
              <div className="rooms-chose-room">
                {rooms?.map((room) => {
                  if (!room.started) {
                    return (
                      <div className="rooms-info" key={room.id} onClick={() => verifyRoom(room)}
                      >
                        <p className={`${room.numberOfPlayers === 4 ? "red-color" : ""}`}>
                          Sala {room.name}
                        </p>
                        <p className={`${room.numberOfPlayers === 4 ? "red-color" : ""}`}>
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
                <div className="align">
                  <p>Nome do Jogador:</p>
                  <input className="rooms-name-input" type="text" placeholder="Escolha um nome" value={user.name} onChange={(event) => handleChangeUser(event.target.value)}/>
                  <div className="rooms-back-button" onClick={() => setScreen(0)}>
                    <p>Nova Sala</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Room user={user} setUser={setUser} roomInfo={roomChosed} resetRoom={resetRoom}/>
        )
      }
    </Fragment>
  );
}

interface Props {
  setScreen: (value: number) => void;
  user: IPlayer;
  setUser: (value: IPlayer) => void;
}