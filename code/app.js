// Object that will be used for representing players of the game.
// Where there're 3 varibales to keep count of the players' wins, ties, and losses.
// The isPlaying key-value pair is true when it's the players turn to play and 
//  it's false otherwise.
const makePlayer = function () {
    let winCount = 0;
    let tieCount = 0;
    let lossCount = 0;

    return {
        isPlaying: false,
        win: function () {
            winCount += 1;
            return winCount;
        },
        tie: function () {
            tieCount += 1;
            return tieCount;
        },
        lose: function () {
            lossCount += 1;
            return lossCount;
        },
        play: function () {
            this.isPlaying = true;
        },
        wait: function () {
            this.isPlaying = false;
        },
        getScore: function () {
            return {
                wins: winCount,
                ties: tieCount,
                losses: lossCount
            };
        }
    };
};

// An object used to represent the game board (with the 9 buttons).
// Where each key-value pair holds an array value in which holds 3 elements:
//      1- The actual btn element selected using JQuery.
//      2- The img element inside the button.
//      3- The src value for the img elment.
const board = {
    btn1: [$('#btn-1'), $('btn-1 img'), ''],
    btn2: [$('#btn-2'), $('btn-2 img'), ''],
    btn3: [$('#btn-3'), $('btn-3 img'), ''],
    btn4: [$('#btn-4'), $('btn-4 img'), ''],
    btn5: [$('#btn-5'), $('btn-5 img'), ''],
    btn6: [$('#btn-6'), $('btn-6 img'), ''],
    btn7: [$('#btn-7'), $('btn-7 img'), ''],
    btn8: [$('#btn-8'), $('btn-8 img'), ''],
    btn9: [$('#btn-9'), $('btn-9 img'), ''],
};

// Create and save player objects in seperate variables
const playerX = makePlayer();
const playerO = makePlayer();

// Function that will run everytime the game starts.
// It's responsible for randomly deciding which player will start the game
const coinToss = function () {

    // generating a random whole number between 1 and 2.
    // if it's 1 => playerX goes first.
    // if it's 2 => playerO goes first.
    const random = Math.floor(Math.random() * 2) + 1;

    if (random === 1) {
        playerX.play();
        playerO.wait();
    } else {
        playerO.play();
        playerX.wait();
    }
};

// Function responsible to change the HTML header to display the name of the current player.
const updateTurnHeader = function () {
    const turnHeader = $('#current');

    if (playerX.isPlaying)
        turnHeader.text('Player X');
    else
        turnHeader.text('Player O');
};

// Function to start the game initially.
// It's only called once when the script runs for the first time 
const startGame = function () {

    coinToss();
    updateTurnHeader();
};

// Calling the function to start the game when the script is loaded.
startGame();