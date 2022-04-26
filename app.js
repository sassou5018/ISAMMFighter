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
  
  //create room
  socket.on('createID', (cID)=>{
    console.log(cID);
    let createID=cID;
    socket.join(cID);
  })


  //join room
  socket.on('joinID', (joinID)=>{
    console.log(joinID);
    socket.join(joinID);
  })


  //recieve p1 position and emit to p2
  socket.on('position2', (position2)=>{ //player position p2
      console.log("p1",position2);
      io.to(createID).emit("p2" ,position2);
  })


  //recieve p2 position and emit to p1
  socket.on('position1', (position1)=>{ //enemy position p1
    console.log('p2',position1);
      io.to(createID).emit("p1", position1);
  })


  //recieve attack event and evaluate value then emit atk event to other player
  socket.on('attack', (player)=>{ 
    console.log(player);
    if(player===1){
        io.to(createID).emit("atk",1);
    } else if (player===2){
        io.to(createID).emit("atk",2);
    }
  })
  
});




server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});