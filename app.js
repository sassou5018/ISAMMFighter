const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');



const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/static', express.static(path.join(__dirname, 'Client')));


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});