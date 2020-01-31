// Object that will be used for representing players of the game.
// Where there're 3 varibales to keep count of the players' wins, ties, and losses.
// The isPlaying key-value pair is true when it's the players turn to play and 
//  it's false otherwise.
// The squaresControlled array will hold the IDs for the squares that the player clicked.
// The squaresControlled will be used to determine win cases.
const makePlayer = function (playerName, imgSrc) {
    let winCount = 0;
    let tieCount = 0;
    let lossCount = 0;

    return {
        playerName: playerName,
        isPlaying: false,
        suqaresControlled: [],
        imgSrc: imgSrc,
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

// Create and save player objects in seperate variables
// The first passed parameter represents the name of the player.
// The second passed parameter represents the src for the img used for either (X or O).
const playerX = makePlayer('Player X', '../images/x.png');
const playerO = makePlayer('Player O', '../images/o.png');

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
            const currentCombination = winCombinations[i];

            // Variable will be true if all three elements of the win combination array
            // are present in the squaresControlled array.
            if (squaresControlled.includes(currentCombination[0]) &&
                squaresControlled.includes(currentCombination[0]) &&
                squaresControlled.includes(currentCombination[0])) {

                return true;
            }
        }
    }

    return false;
};

// Function to handle switching player turns
const endTurn = function () {
    // Switch the active player
    playerX.isPlaying = !playerX.isPlaying;
    playerO.isPlaying = !playerO.isPlaying;

    // Update the header to view current player
    updateTurnHeader();
};

// Callback function that gets called when a square is clicked by a player.
const suqareClicked = function () {
    // Put the ID of the element clicked into a variable.
    const squareId = $(this).attr('id');

    // Disable the square clicked, so it can't be clicked multiple times
    // Also, remove .hover-effect class so it's visually obvious that it's disabled
    $(this).attr('disabled', 'true');
    $(this).removeClass('hover-effect');

    // pass the current player to the execute function
    if (playerX.isPlaying)
        executeTurn(playerX, 1, squareId);
    else
        executeTurn(playerO, 2, squareId);
};

// Function responsible for executing a player's turn
// Takes the player that's playing, and the ID of the suqare they chose 
// as parameters and execute necessary steps based on the choice.
const executeTurn = function (player, playerId, squareId) {
    // Chnage the img of the square based on the player the clicked it.
    $(`#${squareId} img`).attr('src', player.imgSrc);

    // Add the square id to the controlled squares of the player that chose it.
    player.suqaresControlled.push(squareId);

    // Check the player's controlled squares for win condition.
    if (checkWin(player.suqaresControlled)) {
        const winsSpan = $(`#wins-${playerId}`);

        // call win method to increase player score and update UI to show count
        winsSpan.text(player.win());

    } else {
        endTurn();
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
};

// Calling the function to start the game when the script is loaded.
startGame();