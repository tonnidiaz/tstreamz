import { app } from "./src/app";
import io from "@pkg/cmn/utils/io";
import http from 'http'

const port = process.env.PORT ? Number(process.env.PORT) : 8000;

const server = http.createServer(app);


try {
    io.attach(server);
} catch (e) {
    console.log(e);
}


function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr?.port;
      console.log(addr);
    console.log('Listening on ' + bind);
    // debug('Listening on ' + bind);
  }

  server.listen(port);
server.on('error', onError);
server.on('listening', onListening);