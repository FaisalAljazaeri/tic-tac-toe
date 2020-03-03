// loading required moduals
let http = require("http");
let express = require("express");
let socketio = require("socket.io");

let app = express();
let server = http.createServer(app);
let io = socketio(server);

// serving static files from the client directory
app.use(express.static(__dirname + "/client"));

server.listen(process.env.PORT || 3000, () => {
    console.log("ready to work");
});

// variable to hold the socket that's yet to connect to a game.
let waitingPlayer;

io.on("connection", onConnection);

function onConnection(socket) {
    socket.emit("chat", "Welcome", true);

    if (waitingPlayer) {
        // connect players to chat
        connectChat(socket, waitingPlayer);
        // register click button event for both players
        registerEvent("btn", socket, waitingPlayer);

        // Switch player turns
        switchTurn(waitingPlayer, socket);

        // Register reset game events for both sockets
        reset(waitingPlayer, socket);

        // Assign each socket an img url for X or O
        waitingPlayer.on("imgs", () => socket.emit("imgs"));

        // Send both players a message
        waitingPlayer.emit("chat", "Opponent joind.", true);
        socket.emit("chat", "You are ready to play", true);

        // There currently no players on hold for a game so reset the variable
        waitingPlayer = null;
    } else {
        // the first socket to connect is put on hold for a game
        // and sent an apprpriate message
        waitingPlayer = socket;
        socket.emit("chat", "waiting for an opponent...", true);
    }
}

function connectChat(socket1, socket2) {
    // register messaging between the two players.
    socket1.on("chat", (msg, ai, opp) => socket1.emit("chat", msg, ai, false));
    socket2.on("chat", (msg, ai, opp) => socket2.emit("chat", msg, ai, false));

    socket1.on("chat", (msg, ai, opp) => socket2.emit("chat", msg, ai, true));
    socket2.on("chat", (msg, ai, opp) => socket1.emit("chat", msg, ai, true));
}

// helper function to register events to both players
function registerEvent(event, socket1, socket2) {
    socket1.on(event, data => socket2.emit(event, data));
    socket2.on(event, data => socket1.emit(event, data));
}

// regsiter turn switching events to both players
function switchTurn(socket1, socket2) {
    socket1.emit("playFirst");

    socket1.on("sendTurn", () => socket2.emit("turn"));
    socket2.on("sendTurn", () => socket1.emit("turn"));

    socket1.on("sendDisplayTurn", () => socket2.emit("displayTurn"));
    socket2.on("sendDisplayTurn", () => socket1.emit("displayTurn"));

    socket1.emit("displayTurn");
    socket2.emit("displayTurn");
}

// register the reset button event so that it's only inniated by the "host" of
// the game.
function reset(socket1, socket2) {
    socket1.on("reset", () => socket2.emit("reset"));
}
