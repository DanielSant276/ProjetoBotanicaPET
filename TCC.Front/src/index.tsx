import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import GameRoomScreen from './components/Game/GameRoom/GameRoomScreen';
import Room from './components/Game/Rooms/Room';
import { IPlayer } from './interfaces/IPlayer';
import { IRoom } from './interfaces/IRoom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const user: IPlayer = {id: '', name: 'Daniel', ready: false};
const setUser = (value: IPlayer) => {

};
const roomInfo: IRoom = {id: '23abebeb-6bd0-4f3f-a326-ace7fd5dab19', name: 'a', started: false, numberOfPlayers: 3};
const resetRoom = () => {

};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/Room/:gameId',
    element: <GameRoomScreen />
  },
  {
    path: '/RoomTest',
    element: <Room roomInfo={roomInfo}  setUser={setUser} user={user} resetRoom={resetRoom} />
  }
]);

root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
