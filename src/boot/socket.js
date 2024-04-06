import { boot } from 'quasar/wrappers'
import { io } from "socket.io-client";


// const URLSocket = 'http://localhost:7171/';
const URLSocket = 'http://localhost:3000/';

const $socket = io(URLSocket, { autoConnect: false });

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async  ({app }) => {
//     app.config.globalProperties.$socket = URLSocket
//   console.log(app.config.globalProperties)
// })

export { $socket  }
