const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = {};
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    if (!players.player1) {
        players.player1 = { id: socket.id, symbol: "X" };
        socket.emit("assignSymbol", "X");
    } else if (!players.player2) {
        players.player2 = { id: socket.id, symbol: "O" };
        socket.emit("assignSymbol", "O");
        io.emit("startGame", { message: "Game started! X's turn." });
    } else {
        socket.emit("fullGame", { message: "Game is full. Try again later." });
        socket.disconnect();
        return;
    }

    socket.on("makeMove", (index) => {
        if (players.player1?.id === socket.id && currentPlayer === "X" && board[index] === "") {
            board[index] = "X";
            currentPlayer = "O";
        } else if (players.player2?.id === socket.id && currentPlayer === "O" && board[index] === "") {
            board[index] = "O";
            currentPlayer = "X";
        } else {
            return;
        }

        io.emit("updateBoard", board);
        io.emit("updateTurn", currentPlayer);

        let winner = checkWinner();
        if (winner) {
            io.emit("gameOver", winner);
            resetGame();
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        if (players.player1?.id === socket.id) delete players.player1;
        if (players.player2?.id === socket.id) delete players.player2;
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        io.emit("resetGame");
    });
});

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return `${board[a]} wins!`;
        }
    }

    if (!board.includes("")) return "It's a draw!";
    return null;
}

function resetGame() {
    setTimeout(() => {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        io.emit("resetGame");
    }, 2000);
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
