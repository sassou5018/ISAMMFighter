const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/p1', (req, res) => {
    app.use(express.static('Client'));
    //if(req=="/p1"){
        res.sendFile('Client/player1.html', { root: __dirname });
    //}
    //else{
    //    res.sendFile('Client/index2.html', { root: __dirname });
    //}
});
app.get('/p2', (req, res) => {
    app.use(express.static('Client'));
    res.sendFile('Client/player2.html', { root: __dirname });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('position2', (position2)=>{ //player position p2
      //console.log(position2);
      socket.emit("p2" ,position2);
  })
  socket.on('position1', (position1)=>{ //enemy position p1
    //console.log(position1);
      socket.emit("p1", position1);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});