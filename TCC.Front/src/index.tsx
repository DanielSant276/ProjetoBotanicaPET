import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './components/App';
import About from './components/Game/Menus/About';
import Info from './components/Game/Menus/Info';
import ListRooms from './components/Game/Rooms/ListRooms';
import GameRoomScreen from './components/Game/GameRoom/GameRoomScreen';
import { ErrorModalProvider } from "./components/Game/ErrorModal/ErrorModalProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Definindo as rotas da aplicação usando o React Router
const router = createBrowserRouter([
  {
    // Rota principal que renderiza o componente App
    path: '/',
    element: <App />
  },
  {
    // Rota para a página Sobre
    path: '/About',
    element: <About />
  },
  {
    // Rota para a página de Informações
    path: '/Info',
    element: <Info />
  },
  {
    // Rota para a listagem de salas de jogo
    path: '/Rooms',
    element: <ListRooms />
  },
  // {
  //   // Rota para uma sala específica com um roomId dinâmico
  //   path: '/Room/:roomId',
  //   element: <Room />
  // },
  {
    // Rota para uma partida específica com um roomId dinâmico
    path: '/Game/:gameId',
    element: <GameRoomScreen />
  }
]);

root.render(
  <ErrorModalProvider>
    <RouterProvider router={router} />
  </ErrorModalProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
