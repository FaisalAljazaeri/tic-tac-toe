# tic-tac-toe

This is my project for a simple browser based tic-tac-toe game.
You can play an online version [here](https://hidden-journey-32341.herokuapp.com/)

## Technologies Used

1. HTML.
2. CSS.
3. Javascript.
4. NodeJS.
5. ExpressJS.
6. Socket io.

## Approach Taken

To implement this project, I have used HTML and CSS to structure and style the layout of the game board and all the other elements on the page.

In this game, when two players connect they're are modeled using a JavaScript object that has information about them. Using the player objects we can keep track of changes in the game, such as which squares does each player controls.

* When a player clicks on a square on the board, we add it to that players array of controlled squares and the turn switches to the other player.

* There's an array that holds all 8 possible winning combinations of squares.

* After each turn we check the player's squares against the winning squares array to check if we find a match, if there's then the player wins and the game is finished, otherwise we continue.

* When a turn doesn't pass the winning check we perform the draw check, which basically looks at all the squares taken by both players and determines if there's a possibility of a winner.

* If the turn doesn't result in a win or draw, the next turn starts and the process is repeated until the game end in either a draw or a win.

* A player has the ability to press the reset game button, which resets the state of the game and clears the board buttons.

## Wireframe

The wireframe can be found at this [link](https://wireframe.cc/u11Ebu)

## User Stories

* As a user I should be able to join the game and be connected with another player.

* As a user, I should be able to view my win, loss and draw counts.

* As a Game Host, only I should have the ability to restart the game.

* As a user, I should see a sign that the current game ended in a win.

* As a user, I should be able to chat with my opponent.

## Future Plans

I would like to enhance the styling and the overall user expirence of the project.

## Installation and Running

Use the NPM package manager to install required packages:

```bash
npm install --save express
```

```bash
npm install --save socet.io
```

To run you need to type this command in the server directory

```bash
node server.js
```

## Final Note

If you have any questions regarding this project, you can directly reach out to me and I'll try my best to answer.
