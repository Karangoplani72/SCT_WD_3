const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart-btn");
const playerModeButton = document.getElementById("player-mode");
const computerModeButton = document.getElementById("computer-mode");

let isPlayerTurn = true;
let isGameActive = true;
let isComputerOpponent = false;
let boardState = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

playerModeButton.addEventListener("click", () => startGame(false));
computerModeButton.addEventListener("click", () => startGame(true));
restartButton.addEventListener("click", resetGame);

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleCellClick(index));
});

function startGame(computerOpponent) {
  isComputerOpponent = computerOpponent;
  resetGame();
}

function resetGame() {
  boardState.fill(null);
  isPlayerTurn = true;
  isGameActive = true;
  messageElement.textContent = "";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
}

function handleCellClick(index) {
    if (boardState[index] || !isGameActive) return;
  
    // Place mark for the current player or computer
    boardState[index] = isPlayerTurn ? "X" : "O";
    cells[index].textContent = isPlayerTurn ? "X" : "O";
  
    if (checkWinner()) {
      if (isPlayerTurn) {
        messageElement.textContent = "Player 1 wins!";
      } else {
        messageElement.textContent = isComputerOpponent ? "Computer wins!" : "Player 2 wins!";
      }
      isGameActive = false;
      highlightWinningCells();
    } else if (boardState.every(cell => cell !== null)) {
      messageElement.textContent = "It's a draw!";
      isGameActive = false;
    } else {
      isPlayerTurn = !isPlayerTurn;
  
      // If playing against computer, make the computer's move
      if (isComputerOpponent && !isPlayerTurn && isGameActive) {
        setTimeout(computerMove, 500);  // Delay for computer's move
      }
    }
  }
  

function checkWinner() {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
  });
}

function highlightWinningCells() {
  winningCombinations.forEach(combination => {
    const [a, b, c] = combination;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
    }
  });
}

function computerMove() {
  // Simple AI that picks a random empty cell
  const emptyCells = boardState
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  handleCellClick(randomIndex);
}