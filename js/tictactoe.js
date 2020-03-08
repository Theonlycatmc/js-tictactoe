const Player = (playerNum) => {
    let name = prompt(`Player ${playerNum}, what is your name?`)
    if (!name) {
       name = `Player ${playerNum}`; 
    }
    return {name, playerNum};
}

const GameLogic = (() => {
    let player1 = Player(1);
    player1.symbol = "X"
    let player2 = Player(2);
    player2.symbol = "O"

    let currentPlayer = player2;

    const playerClicked = (env) => {
        if (GameBoard.setSymbol(env.target.placeid, currentPlayer.symbol)){
            nextTurn();
        }
    }

    const nextTurn = () => {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }
    return {playerClicked};
})();

const DisplayController = (() => {
    let gameBoardDiv = document.getElementById("game-board");

    const initDisplay = () => {
        for (let i = 0; i < 9; i++) {
            let gameButton = document.createElement("div");
            gameButton.className = "game-button";
            gameButton.innerText = " ";
            gameButton.id = `button-${i}`;
            gameButton.placeid = i;
            gameBoardDiv.addEventListener("click", GameLogic.playerClicked)
            gameBoardDiv.appendChild(gameButton);
        }
    }

    const render = (boardArr) => {
        for (let i = 0; i < boardArr.length; i++) {
            element = document.querySelector(`[id="button-${i}"]`)
            element.innerText = boardArr[i];
        }
    }
    initDisplay();
    return {render};
})();

const GameBoard = (() => {
    let board
    
    const renderBoard = () => {
        DisplayController.render(board)
    }

    const resetBoard = () => {
        board = []
        for (let i = 0; i < 9; i++) {
            board.push(" ");
        }
    }

    const setSymbol = (position, symbol) => {
        if (board[position] == " ") {
            board[position] = symbol;
            renderBoard();
            return true;
        }
        return false;
    }

    resetBoard();
    return {resetBoard,renderBoard,setSymbol,board};
})();