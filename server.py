from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

players = {}
board = [""] * 9
current_player = "X"

@app.route('/')
def index():
    return render_template("index.html")

@socketio.on('connect')
def handle_connect():
    global players

    if 'player1' not in players:
        players['player1'] = {'id': request.sid, 'symbol': 'X'}
        emit("assignSymbol", "X")
    elif 'player2' not in players:
        players['player2'] = {'id': request.sid, 'symbol': 'O'}
        emit("assignSymbol", "O")
        socketio.emit("startGame", {"message": "Game started! X's turn."})
    else:
        emit("fullGame", {"message": "Game is full. Try again later."})
        return

@socketio.on("makeMove")
def handle_move(data):
    global board, current_player

    index = data['index']
    player_symbol = data['symbol']

    if board[index
