//configurar dotenv//
require('dotenv').config();
//importar config basade datos//
const { db } = require('./database/config')
//importar app//
const app = require('./App');
const initModel = require('./model/initModel')
//server de socketio
const { Server } = require('socket.io')
const sockets = require('./sockets')

//autenticar y sincronizar base de datos//
db.authenticate()
.then( () => console.log('database authenticate'))
.catch( (err) => console.log(err))

initModel()

db.sync()
.then( () => console.log('database synced'))
.catch( (err) => console.log(err))

//metodo listen//
const PORT = process.env.PORT;
const serverApp = app.listen(PORT, () => {
  console.log(`app running on port ${PORT} 😛`);
});

const io = new Server(serverApp, {
  cors: {
    orogin: '*',
    methods: ['GET', 'POST']
  }
})

new sockets(io)
