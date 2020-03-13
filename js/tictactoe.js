const Player = (playerNum, symbol) => {
    let name = prompt(`Player ${playerNum}, what is your name?`)
    let wins = 0;
    if (!name) {
       name = `Player ${playerNum}`; 
    }
    return {name, playerNum, symbol, wins};
}

const DisplayController = (() => {
    let gameBoardDiv = document.getElementById("game-board");
    let playerDisplayDiv = document.getElementById("game-player-display");
    let playerWinsDiv = document.getElementById("game-wins-display")

    const initDisplay = () => {
        for (let i = 0; i < 9; i++) {
            let gameButton = document.createElement("div");
            gameButton.className = "game-button";
            gameButton.innerText = " ";
            gameButton.id = `button-${i}`;
            gameButton.placeid = i;
            playerWinsDiv.parentNode.insertBefore(gameButton, playerWinsDiv);
        }
    }

    const render = (boardArr) => {
        for (let i = 0; i < boardArr.length; i++) {
            element = document.querySelector(`[id="button-${i}"]`)
            element.innerText = boardArr[i];
        }
    }

    const renderPlayerDisplay = (player) => {
        playerDisplayDiv.innerText = `${player.name}'s Turn!`
    }

    const renderPlayerWin = (player) => {
        playerDisplayDiv.innerText = `${player.name} Wins!`
    }

    const renderPlayerWins = (player1, player2) => {
        playerWinsDiv.innerText = `${player1.name}: ${player1.wins} \n ${player2.name}: ${player2.wins}`
    }

    const renderTie = () => {
        playerDisplayDiv.innerText = "Tie!"
    }

    initDisplay();
    return {render, renderPlayerDisplay, renderPlayerWin, renderPlayerWins, renderTie};
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
    
    const isBoardFull = () => {
        return (board.indexOf(" ") == -1)
    }

    const setSymbol = (position, symbol) => {
        if (board[position] == " ") {
            board[position] = symbol;
            renderBoard();
            return true;
        }
        return false;
    }

    const getSymbol = (index) => {
        return board[index]
    }

    resetBoard();
    return {resetBoard,renderBoard,isBoardFull,setSymbol,getSymbol};
})();

const GameLogic = (() => {
    let player1 = Player(1, "X");
    let player2 = Player(2, "O");
    let currentPlayer = player1;
    let gameOver = false;

    let winningCombinations = [[0,4,8],[2,4,6],[1,4,7],[3,4,5],
                               [0,1,2],[2,5,8],[6,7,8],[0,3,6]]

    const hookButtonFunctions = () => {
        let gameButtons = document.getElementsByClassName("game-button");
        for (let button of gameButtons) {
            button.addEventListener("click", playerClicked)
        }
    }

    const playerClicked = (env) => {
        if (gameOver) {
            afterWinClick();
        } else if (GameBoard.setSymbol(env.target.placeid, currentPlayer.symbol)) {
            if (checkWin()) {
                winGame();
            } else if (checkTie()) {
                tie();
            } else {
                nextTurn();
                DisplayController.renderPlayerDisplay(currentPlayer);
            }
        }
        
    }

    const nextTurn = () => {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }
    
    const checkWin = () => {
        for (let combination of winningCombinations) {
            let winningCombo = true;
            for (let place of combination) {
                if (GameBoard.getSymbol(place) != currentPlayer.symbol) {
                    winningCombo = false;
                    break;
                }
            }
            if (winningCombo) {
                return true;
            }
        }
        return false;
    }

    const winGame = () => {
        currentPlayer.wins += 1;
        gameOver = true;
        DisplayController.renderPlayerWin(currentPlayer);
        DisplayController.renderPlayerWins(player1, player2);
        nextTurn();
    }

    const afterWinClick = () => {
        gameOver = false;
        GameBoard.resetBoard();
        GameBoard.renderBoard();
        DisplayController.renderPlayerDisplay(currentPlayer);
    }

    const checkTie = () => {
        return GameBoard.isBoardFull();
    }

    const tie = () => {
        gameOver = true;
        DisplayController.renderTie();
        GameBoard.resetBoard();
        nextTurn();
    }
    hookButtonFunctions();
    DisplayController.renderPlayerDisplay(currentPlayer);
    DisplayController.renderPlayerWins(player1, player2);
    return {};
})();