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