const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
    app.use(express.static('Client'));
    res.sendFile('Client/index.html', { root: __dirname });
});
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
      console.log("p1",position2);
      io.emit("p2" ,position2);
  })
  socket.on('position1', (position1)=>{ //enemy position p1
    console.log('p2',position1);
      io.emit("p1", position1);
  })
  socket.on('attack', (player)=>{ 
    console.log(player);
    if(player===1){
        io.emit("atk",1);
    } else if (player===2){
        io.emit("atk",2);
    }
  })
});

//server.listen(3000, () => {
//  console.log('listening on *:3000');
//});