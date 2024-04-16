export {}
// import { HubConnectionBuilder } from '@microsoft/signalr';

// class SignalRService {
//   constructor() {
//     this.connection = new HubConnectionBuilder()
//       .withUrl("URL_DO_SEU_HUB_SIGNALR")
//       .build();

//     this.connection.start()
//       .then(() => console.log("Conecting SignalR"))
//       .catch(err => console.error("Error connecting to SignalR:", err));

//     this.connection.on("ReceberNumeroBingo", number => {
//       // Aqui você pode aplicar a lógica para processar o número de bingo recebido
//       console.log("Número de bingo recebido:", number);
//     });
//   }
// }

// export default SignalRService;