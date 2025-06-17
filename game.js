// Game Module (IIFE)
const Game = (() => {
  // Private state
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;
  let scores = { X: 0, O: 0, draws: 0 };

  // Private methods
  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const checkDraw = () => !board.includes('');

  // Public interface
  return {
    makeMove(index) {
      if (!gameActive || board[index] !== '') return false;
      
      board[index] = currentPlayer;
      
      if (checkWinner()) {
        gameActive = false;
        scores[currentPlayer]++;
        return { winner: currentPlayer };
      }
      
      if (checkDraw()) {
        gameActive = false;
        scores.draws++;
        return { draw: true };
      }
      
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      return true;
    },
    
    reset() {
      board = ['', '', '', '', '', '', '', '', ''];
      currentPlayer = 'X';
      gameActive = true;
    },
    
    getBoard() {
      return [...board];
    },
    
    getCurrentPlayer() {
      return currentPlayer;
    },
    
    getScores() {
      return { ...scores };
    }
  };
})();

// Display Controller
document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('board');
  const resetButton = document.getElementById('reset');
  const musicButton = document.getElementById('music-btn');
  const statusElement = document.getElementById('status');
  const xScoreElement = document.getElementById('x-score');
  const oScoreElement = document.getElementById('o-score');
  const drawScoreElement = document.getElementById('draw-score');
  
  // Open Coldplay playlist
  musicButton.addEventListener('click', () => {
    window.open('https://music.youtube.com/playlist?list=PLsvoYlzBrLFAJd4hNQSHw1lYjDKeQB_iU', '_blank');
  });
  
  // Render game board
  const renderBoard = () => {
    boardElement.innerHTML = '';
    Game.getBoard().forEach((cell, index) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      if (cell) {
        cellElement.textContent = cell;
      }
      cellElement.dataset.index = index;
      boardElement.appendChild(cellElement);
    });
  };
  
  // Update scores display
  const updateScores = () => {
    const scores = Game.getScores();
    xScoreElement.textContent = scores.X;
    oScoreElement.textContent = scores.O;
    drawScoreElement.textContent = scores.draws;
  };
  
  // Update game status
  const updateStatus = () => {
    statusElement.textContent = `Current player: ${Game.getCurrentPlayer()}`;
  };
  
  // Handle cell clicks
  const handleCellClick = (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;
    
    const result = Game.makeMove(parseInt(index));
    if (result) {
      render();
      if (result.winner) {
        setTimeout(() => alert(`${result.winner} wins!`), 100);
      } else if (result.draw) {
        setTimeout(() => alert("It's a draw!"), 100);
      }
    }
  };
  
  // Reset game
  const resetGame = () => {
    Game.reset();
    render();
  };
  
  // Main render function
  const render = () => {
    renderBoard();
    updateScores();
    updateStatus();
  };
  
  // Initialize event listeners
  boardElement.addEventListener('click', handleCellClick);
  resetButton.addEventListener('click', resetGame);
  
  // Start with sample scores
  Game.getScores().X = 3;
  Game.getScores().O = 2;
  Game.getScores().draws = 1;
  
  // Initial render
  render();
});