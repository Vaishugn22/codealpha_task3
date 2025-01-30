const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    players[socket.id] = { x: Math.random() * 400, y: Math.random() * 400, color: getRandomColor() };

    io.emit('updatePlayers', players);

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x += data.dx;
            players[socket.id].y += data.dy;
            io.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
