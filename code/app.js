// Object that will be used for representing players of the game.
// Where there're 3 varibales to keep count of the players' wins, ties, and losses.
// The isPlaying key-value pair is true when it's the players turn to play and 
//  it's false otherwise.
// The squaresControlled array will hold the IDs for the squares that the player clicked.
// The squaresControlled will be used to determine win cases.
const makePlayer = function () {
    let winCount = 0;
    let tieCount = 0;
    let lossCount = 0;

    return {
        isPlaying: false,
        suqaresControlled: [],
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

// Array that holds the arrays that reperesent the squares of winning combinations.
const winCombinations = [
    ['btn-1', 'btn-2', 'btn-3'], // first row
    ['btn-4', 'btn-5', 'btn-6'], // second row
    ['btn-7', 'btn-8', 'btn-9'], // third row
    ['btn-1', 'btn-4', 'btn-7'], // first column
    ['btn-2', 'btn-5', 'btn-8'], // second column
    ['btn-3', 'btn-6', 'btn-9'], // third column
    ['btn-1', 'btn-5', 'btn-9'], // top-left to bottom-right diagonally
    ['btn-3', 'btn-5', 'btn-7'], // top-right to botton-left diagonally
];

// Function responsible to see if a winning condition is met.
// It works by checking if any of the winning cases are achived with the collection of squares.
// Example of winning combinations: [square1,square2,square3] which are the 3 suqares in the first row.
const checkWin = function (squaresControlled) {

    // check if the player controls at least 3 squares before checking for win condition
    if (squaresControlled.length >= 3) {

        // Iterate over the winCombinations array and check if the controlled array
        // contains a winning combination.
        for (let i = 0; i < winCombinations.length; i++) {
            const currentElement = winCombinations[i];

            // Variable will be true if all three elements of the win combination array
            // are present in the squaresControlled array.
            const isWin = currentElement.every(el => {
                squaresControlled.indexOf(el);
            });

            if (isWin)
                return true;
        }
    }

    return false;
};

// Callback function that gets called when a square is clicked by a player.
const suqareClicked = function () {
    // Put the element clicked into a variable.
    const currentSquareId = $(this).attr('id');

    if (playerX.isPlaying) {
        // Chnage the img of the square based on the player the clicked it.
        $(`#${currentSquareId} img`).attr('src', '../images/x.png');

        // Add the square id to the controlled squares of the player that chose it.
        playerX.suqaresControlled.push(currentSquareId);

        // Check the player's controlled squares for win condition.
        if (checkWin(playerX.suqaresControlled))
            playerX.win(); // call win method to increase player score
    } else {
        $(`#${currentSquareId} img`).attr('src', '../images/o.png');
        playerO.suqaresControlled.push(currentSquareId);
        if (checkWin(playerO.suqaresControlled))
            playerO.win();
    }
};

// Function to start the game initially.
const startGame = function () {

    coinToss();
    updateTurnHeader();

    // Register click events for all buttons on the board
    const gameBoard = $('.game-board button');
    for (let i = 0; i < gameBoard.length; i++) {
        $(gameBoard[i]).click(suqareClicked);
    }

    // while (true) {

    // }
};

// Calling the function to start the game when the script is loaded.
startGame();