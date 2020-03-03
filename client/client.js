let socket = io();

// Register listnenrs for all buttons
let gameButtons = $(".game-board button");
gameButtons.attr("disabled", "true");

// Select the div where chat messages will be displayed
// To later apply some functions on it.
const messageBody = document.querySelector(".chat-box");

// Function that will be used to initalize player objects
const makePlayer = function(id) {
    let winCount = 0;
    let tieCount = 0;
    let lossCount = 0;

    return {
        playerId: id,
        turn: false,
        suqaresControlled: [],
        win: function() {
            winCount += 1;
            return winCount;
        },
        tie: function() {
            tieCount += 1;
            return tieCount;
        },
        lose: function() {
            lossCount += 1;
            return lossCount;
        }
    };
};

// create player objects
const player = makePlayer(1);
const opponent = makePlayer(2);

// All the squares controlled on the board (by player and opponent)
let allControlledSquares = [];

const startGame = function() {
    // Register click events for all buttons on the board
    for (let i = 0; i < gameButtons.length; i++) {
        $(gameButtons[i]).click(suqareClicked);
    }
};

const resetartGame = function() {
    // Reset the Images of the squares and enable any disabled button
    // and clear effects on any of the clicked buttons to return the game
    // to its starting state.
    for (let i = 0; i < gameButtons.length; i++) {
        $(gameButtons[i]).click(suqareClicked);
        $(`#${gameButtons[i].id} img`).attr("src", "");
        $(gameButtons[i]).addClass("hover-effect");
        $(gameButtons[i]).removeClass("clicked");
        $(gameButtons[i]).removeClass("green");
    }
    gameButtons.attr("disabled", "true");

    if (player.turn) {
        gameButtons.removeAttr("disabled");
    }

    // Clear both players controlled squares and the board squares
    // to mark the start of a new game
    allControlledSquares = [];
    player.suqaresControlled = [];
    opponent.suqaresControlled = [];

    // communicate to the other client to restart their game
    socket.emit("reset");
};

// saved image srcs for X and O symbols
const imgSrcs = ["/images/x.png", "/images/o.png"];

// All winning combinations
// Array that holds the arrays that reperesent the squares of winning combinations.
const winCombinations = [
    ["btn-1", "btn-2", "btn-3"], // first row
    ["btn-4", "btn-5", "btn-6"], // second row
    ["btn-7", "btn-8", "btn-9"], // third row
    ["btn-1", "btn-4", "btn-7"], // first column
    ["btn-2", "btn-5", "btn-8"], // second column
    ["btn-3", "btn-6", "btn-9"], // third column
    ["btn-1", "btn-5", "btn-9"], // top-left to bottom-right diagonally
    ["btn-3", "btn-5", "btn-7"] // top-right to botton-left diagonally
];

// Function to end the game (it's called when a draw or win occurs)
// It's responsible for stopping user input until a new game is started.
const endGame = function() {
    // disable all the buttons on the game board.
    gameButtons.off();
    $(".game-board button")
        .attr("disabled", "true")
        .removeClass("hover-effect");
};

// Function responsible to see if a winning condition is met.
// It works by checking if any of the winning cases are achived with the collection of squares.
// Example of winning combinations: [square1,square2,square3] which are the 3 suqares in the first row.
const checkWin = function(squaresControlled) {
    // check if the player controls at least 3 squares before checking for win condition
    if (squaresControlled.length >= 3) {
        // Iterate over the winCombinations array and check if the controlled array
        // contains a winning combination.
        for (let i = 0; i < winCombinations.length; i++) {
            const currentCombination = winCombinations[i];

            // Variable will be true if all three elements of the win combination array
            // are present in the squaresControlled array.
            if (
                squaresControlled.includes(currentCombination[0]) &&
                squaresControlled.includes(currentCombination[1]) &&
                squaresControlled.includes(currentCombination[2])
            ) {
                // change the bacground of winning buttons to green
                currentCombination.forEach(el => {
                    $(`#${el}`).addClass("green");
                });

                return true;
            }
        }
    }

    return false;
};

// Check the case of a draw and returns true or false
const checkDraw = function() {
    // First, figure all the controlled squares on the board
    const allControlledSquares = player.suqaresControlled.concat(
        opponent.suqaresControlled
    );

    // Since we entred this function we are sure that no player has won yet.
    // we need to check if all win combinations are included in the controlled squares,
    // to determine if we should end the game as draw, since all win cases are taken.
    for (let i = 0; i < winCombinations.length; i++) {
        const currentCombination = winCombinations[i];

        // if at least one combination is still not taken we exit the loop,
        // and return false since there is still possibility of a winner
        const includesAll =
            allControlledSquares.includes(currentCombination[0]) &&
            allControlledSquares.includes(currentCombination[1]) &&
            allControlledSquares.includes(currentCombination[2]);

        // If not all elemnets of the current combinations are included then
        // there's possibility of a winner, so we return false for draw.
        if (!includesAll && aPlayerHasChance(currentCombination)) return false;
    }
    return true;
};

const aPlayerHasChance = function(combination) {
    // Retreiving the sets of squares controlled by each player,
    // to compare it with the wining combination
    const playersSquares = [
        player.suqaresControlled,
        opponent.suqaresControlled
    ];
    const matches = [0, 0];

    for (let i = 0; i < playersSquares.length; i++) {
        for (let j = 0; j < playersSquares[i].length; j++) {
            const currentCombinationElement = combination[j];

            if (playersSquares[i].includes(currentCombinationElement))
                matches[i]++;
        }
    }

    // if the different players contorol two different squares in a combination
    // then it's a draw by default without considering the 3rd empty square
    if (matches[0] === 1 && matches[1] === 1) return false;
    else return true;
};

// Button click callback function
const suqareClicked = function() {
    switchTurn();
    // push the cliked square id to the global array that keeps track of board buttons
    allControlledSquares.push(this.id);
    // communicate to the opponent socket to disable the button pressed
    // and reflect necessary changes
    socket.emit("btn", this.id);

    // unregister listenr for clicked button and change style.
    $(this).off();
    $(this).removeClass("hover-effect");
    $(this).addClass("clicked");
    gameButtons.attr("disabled", "true");

    // check win condition for the opponent or the player depending on whose playing.
    if (player.turn) {
        $(`#${this.id} img`).attr("src", player.img);
        player.suqaresControlled.push(this.id);

        if (checkWin(player.suqaresControlled)) {
            const winsSpan = $(`#wins`);
            // call win method to increase player win score and update UI to show count
            winsSpan.text(player.win());

            // Call endGame function to stop the current game
            endGame();
        }
    } else {
        $(`#${this.id} img`).attr("src", opponent.img);
        opponent.suqaresControlled.push(this.id);

        if (checkWin(opponent.suqaresControlled)) {
            const lossesSpan = $(`#losses`);
            lossesSpan.text(player.lose());

            // Call endGame function to stop the current game
            endGame();
        }
    }

    if (checkDraw()) {
        // case of draw increase player's draw counter and change the UI to show it.
        const tiesSpan = $(`#ties`);
        tiesSpan.text(player.tie());

        // Call endGame function to stop the current game.
        endGame();
    }
    // } else {
    //     // The current turn didn't result in a win or draw,
    //     // so start the next turn.
    //     switchTurn();
    // }
};

// Header to show the player currently playing
const currentPlayerHeader = $("#current");
// Function to display indication of who's turn is it on the client's UI.
const onDisplayTurn = function() {
    if (player.turn) {
        currentPlayerHeader.text("You");
    } else {
        currentPlayerHeader.text("Opponent");
    }
};

// Callback function for the chat event.
// it's triggred if a message is sent on the chat and it holds the msg sent.
const onChat = function(msg, ai, opp) {
    // create a new paragraph with the passed msg and append it to the chat div
    let chatBox = $(".chat-box");
    let newP = $("<p>").text(msg);

    if (ai) {
        newP.addClass("anounce-msg");
    }

    if (opp) {
        newP.addClass("opponent-msg");
    } else {
        newP.addClass("player-msg");
    }

    chatBox.append(newP);

    // Scroll to the bottom of the chat box
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
};

// Triggred in the case of submit event on the chat form.
const chatForm = $("#chat-form");
chatForm.submit(function(e) {
    // get the current message and send end to the other client socket.
    // and clear the message box
    let chatInput = $("#chat-input");
    let chatText = chatInput.val();
    chatInput.val("");
    socket.emit("chat", chatText);

    // To stop the browser from loading the page on form submission
    e.preventDefault();
});

// Button click event handler on the opponent socket
const onBtn = function(btnId) {
    const btnClicked = $(`#${btnId}`);
    btnClicked.click();
};

const switchTurn = function() {
    // Trigger events on both player and opponent socket to switch turns
    // and display the results on the UI.

    // Triggering player's socket events
    socket.emit("turn");
    socket.emit("displayTurn");

    // Triggering opponent's socket events
    socket.emit("sendTurn");
    socket.emit("sendDisplayTurn");
};

// callback fucntion to switch turns and control who is able to play
// by either disabling or enabling buttons depending on who is playing
const onTurn = function() {
    if (player.turn) {
        player.turn = false;
        gameButtons.attr("disabled", "true");
    } else {
        player.turn = true;
        gameButtons.removeAttr("disabled");
    }
};

// Function that is called by the server when two players are connected
// it sets the turn for the firts player.
const onPlayFirst = function() {
    player.turn = true;
    player.img = imgSrcs[0];
    opponent.img = imgSrcs[1];
    socket.emit("imgs");
    gameButtons.removeAttr("disabled");

    // Register click event for the restart game button
    $("#restart-btn").click(resetartGame);
};

// setting the imgs for X and O symbols for both players
const setImgSrcs = function() {
    player.img = imgSrcs[1];
    opponent.img = imgSrcs[0];
};

// Registering required events on the client socket.
socket.on("chat", onChat);
socket.on("btn", onBtn);
socket.on("turn", onTurn);
socket.on("displayTurn", onDisplayTurn);
socket.on("playFirst", onPlayFirst);
socket.on("reset", resetartGame);
socket.on("imgs", setImgSrcs);

// Call to start the game as soon as the script is done loading.
startGame();
