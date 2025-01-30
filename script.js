const socket = io();
let playerSymbol = null;

socket.on("assignSymbol", (symbol) => {
    playerSymbol = symbol;
    document.getElementById("status").textContent = `You are Player ${symbol}`;
});

socket.on("startGame", (data) => {
    document.getElementById("status").textContent = data.message;
});

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        if (playerSymbol) {
            socket.emit("makeMove", { index: cell.dataset.index, symbol: playerSymbol });
        }
    });
});

socket.on("updateBoard", (board) => {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.textContent = board[index];
    });
});

socket.on("updateTurn", (currentPlayer) => {
    document.getElementById("status").textContent = `Player ${currentPlayer}'s turn`;
});

socket.on("gameOver", (data) => {
    document.getElementById("status").textContent = data.message;
});

socket.on("resetGame", () => {
    document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
    document.getElementById("status").textContent = "New Game! Waiting for players...";
});
