const socket = io();
let symbol = "";
let myTurn = false;

socket.on("assignSymbol", (assignedSymbol) => {
    symbol = assignedSymbol;
    document.getElementById("status").innerText = `You are ${symbol}. Waiting for opponent...`;
});

socket.on("startGame", (data) => {
    document.getElementById("status").innerText = data.message;
    myTurn = (symbol === "X");
});

socket.on("updateBoard", (board) => {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.innerText = board[index];
    });
});

socket.on("updateTurn", (currentPlayer) => {
    myTurn = (currentPlayer === symbol);
    document.getElementById("status").innerText = `${currentPlayer}'s turn`;
});

socket.on("gameOver", (winner) => {
    document.getElementById("status").innerText = winner;
});

socket.on("resetGame", () => {
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
    document.getElementById("status").innerText = "New game starting...";
});

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        if (myTurn && cell.innerText === "") {
            socket.emit("makeMove", cell.dataset.index);
        }
    });
});
