import { Fragment, useEffect, useState } from "react";
import "./App.css";
import About from "./Game/Menus/About";
import Info from "./Game/Menus/Info";
import Cookies from "js-cookie";
import { getUser } from "./Game/Api/useUser";
import { IPlayer } from "../interfaces/IPlayer";
import ListRooms from "./Game/Rooms/ListRooms";

const playerPlaceHolder: IPlayer = {
  id: "",
  name: "",
  ready: false,
}

export default function App() {
  const [screenLoaded, setScreenLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<IPlayer>(playerPlaceHolder);
  const [screen, setScreen] = useState<number>(0);

  useEffect(() => {
    let userToken = Cookies.get('userToken');

    const fetchUser = async () => {
      const user = await getUser(userToken);

      if (user) {
        if (!userToken) {
          Cookies.set('userToken', user.id);
        }
        
        let newUser: IPlayer = {
          id: user.id,
          name: user.name === undefined ? "" : user.name,
          ready: false
        }

        setUser(newUser);
        setScreenLoaded(true);
      }
    }

    fetchUser();
  }, []);

  return (
    <div>
      <Fragment>
        {!screenLoaded &&
          <div className="main-screen">
          </div>
        }

        {screen === 0 && screenLoaded && (
          <div className="main-screen">
            <p className="title">Bingo plantas medicinais</p>

            <div className="options-box">
              <div onClick={() => setScreen(1)}>Entrar em uma sala</div>
              <div onClick={() => setScreen(2)}>Sobre</div>
              <div onClick={() => setScreen(3)}>Info plantas medicinais</div>
            </div>
          </div>
        )}

        {screen === 1 && screenLoaded && (
          <ListRooms setScreen={setScreen} user={user} setUser={setUser} />
        )}

        {screen === 2 && screenLoaded && (
          <About setScreen={setScreen} />
        )}

        {screen === 3 && screenLoaded && (
          <Info setScreen={setScreen} />
        )}
      </Fragment>
    </div>
  );
}
