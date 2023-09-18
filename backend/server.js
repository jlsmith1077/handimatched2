const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
// const https = require('https')
// var fs = require('fs')

// const options = {
//     key: fs.readFileSync(__dirname + '/ssl/cert-key.pem', 'utf8'),
//    cert: fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8')
//  };
const socketio = require('socket.io')(http, {
    allowEIO3: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    }
});


const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};


const port = normalizePort(process.env.PORT || "5001");
app.set("port", port);

// const server = https.createServer(options,app).listen(443);
const server2 = http.createServer(app);
// server.on("error", onError);s
// server.on("listening", onListening);
server2.listen(port);
server2.keepAliveTimeout = 65000


socketio.on('connection', (socket) => {
    console.log('a websocket connection is established')
  
    socket.on('join-room', (roomId, username) => {
    console.log(roomId, username)
     })
})
  



// const file = require('./middleware/video_chat_files');
// const path = require('path')
// const app = require("./app");
// const { prototype } = require('stream');
// const https = require('https');
//  const fs = require('fs')
// const httpServer = require("http").createServer(app);
// const Filter = require('bad-words');

// const PORT = process.env.PORT || 5000;
// const options = {
// key: fs.readFileSync(path.resolve(__dirname,"./ssl/cert-key.pem")),
// cert: fs.readFileSync(path.resolve(__dirname,"./ssl/cert.csr"))
// }

// httpServer.listen(PORT, () => {
// console.log('server is running on port:', PORT)
// })

// https.createServer(options, function (req, res) {
//   res.writeHead(200);
//   res.end("Welcome to Node.js HTTPS Server");
//   }).listen(443)


// const socketio = require('socket.io')(httpServer);

// socketio.on('connection', (socket) => {
//     console.log('a websocket connection is established')
  
//     socket.on('join-room', (roomId, username) => {
//     console.log(roomId, username)
//   })


//   socket.emit('startMessage', 'Welcome SocketIo Connected!');
//   socket.broadcast.emit('startMessage', 'A new user has joined')


//   socket.on('disconnect', () => {
//     socketio.emit('message', 'User has left')
//   })

//   socket.on('startMessage', (message) => {
//     console.log('greet messsage sent', message)
//   })

//   socket.on('sendStream', (data) => {
//     console.log('greet messsage sent', data)
//     app.use(file)
//     socketio.broadcast('sendStream', data);
//   })

//   socket.on('handshake', (msg) => {
//       console.log('message', msg);
//       socketio.emit('handshake', msg)
//     })
  
//     socket.on('message', (message) => {
//         const filter = new Filter()
    
//         if(filter.isProfane(message) ) {
//             return callback('Profanity is not allowed');
//           }
//           socketio.emit('message', message )
//         })
//       });
      
      
