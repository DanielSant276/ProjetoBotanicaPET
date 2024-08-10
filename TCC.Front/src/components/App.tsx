import { Fragment, useEffect, useState } from "react";
import "./App.css";
import About from "./Game/Menus/About";
import Info from "./Game/Menus/Info";
import Cookies from "js-cookie";
import { getUser } from "./Game/Api/useUser";
import { IPlayer } from "../interfaces/IPlayer";
import ListRooms from "./Game/Rooms/ListRooms";
import { verifyPlayerInRoom } from "./Game/Api/useRooms";
import plantLogo from "../imgs/layout/plants-logo-bingo.png";
import plantsCircleIntern from "../imgs/layout/plants-wheel-intern.png";
import plantsCircleExtern from "../imgs/layout/plants-wheel-extern.png";
import play from "../imgs/icons/play.png";
import infoProject from "../imgs/icons/info-project.png";
import infoPlants from "../imgs/icons/info-plants.png";

const playerPlaceHolder: IPlayer = {
  id: "",
  name: "",
  ready: false,
};

export default function App() {
  const [screenLoaded, setScreenLoaded] = useState<boolean>(true);
  const [user, setUser] = useState<IPlayer>(playerPlaceHolder);
  const [screen, setScreen] = useState<number>(0);

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
        setScreenLoaded(true);

        fetchPlayerInRoom(user.id);
      }
    };

    const fetchPlayerInRoom = async (userId: string) => {
      debugger;
      const room = await verifyPlayerInRoom(userId);

      if (room === "Jogador não encontrado") {
        console.log("Jogador não encontrado");
      } else if (
        room === "Sala não encontrada" ||
        room === undefined ||
        room === null
      ) {
        console.log("Sala não encontrada");
      } else if (room === "Sala não iniciada") {
        console.log("Sala não iniciada");
      } else if (typeof room === "string") {
        window.location.href = `/Room/${room}`;
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <Fragment>
        {!screenLoaded && <div className="main-screen"></div>}

        {screen === 0 && screenLoaded && (
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
              <div className="play-icon" onClick={() => setScreen(1)}>
                <img src={play} alt="Botão de jogar" />
                <p>JOGAR</p>
              </div>
              <div className="info-project-icon" onClick={() => setScreen(2)}>
                <img src={infoProject} alt="Botão de informações do projeto" />
                <p>PROJETO</p>
              </div>
              <div className="info-plants-icon" onClick={() => setScreen(3)}>
                <img src={infoPlants} alt="Botão de informações das plantas" />
                <p>PLANTAS</p>
              </div>
            </div>
          </div>
        )}

        {screen === 1 && screenLoaded && (
          <ListRooms setScreen={setScreen} user={user} setUser={setUser} />
        )}

        {screen === 2 && screenLoaded && <About setScreen={setScreen} />}

        {screen === 3 && screenLoaded && <Info setScreen={setScreen} />}
      </Fragment>
    </div>
  );
}
