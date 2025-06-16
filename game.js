// Game Module (IIFE)
const Game = (() => {
  // Private variables
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
      return [...board]; // Return a copy of the board
    },
    
    getCurrentPlayer() {
      return currentPlayer; // Return current player
    },
    
    getScores() {
      return { ...scores }; // Return a copy of the scores
    }
  };
})();

// Display Controller Module (IIFE)
const DisplayController = (() => {
  const boardElement = document.getElementById('board');
  const resetButton = document.getElementById('reset');
  const statusElement = document.createElement('div');
  statusElement.className = 'status';
  boardElement.parentNode.insertBefore(statusElement, boardElement.nextSibling);
  
  const renderBoard = () => {
    boardElement.innerHTML = '';
    Game.getBoard().forEach((cell, index) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.textContent = cell;
      cellElement.dataset.index = index;
      boardElement.appendChild(cellElement);
    });
  };
  
  const updateStatus = () => {
    const scores = Game.getScores();
    statusElement.innerHTML = `
      <p>Current Player: ${Game.getCurrentPlayer()}</p>
      <p>Scores - X: ${scores.X} | O: ${scores.O} | Draws: ${scores.draws}</p>
    `;
  };
  
  const handleCellClick = (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;
    
    const result = Game.makeMove(index);
    if (result) {
      render();
      if (result.winner) {
        setTimeout(() => alert(`${result.winner} wins!`), 10);
      } else if (result.draw) {
        setTimeout(() => alert("It's a draw!"), 10);
      }
    }
  };
  
  const render = () => {
    renderBoard();
    updateStatus();
  };
  
  const initEventListeners = () => {
    boardElement.addEventListener('click', handleCellClick);
    resetButton.addEventListener('click', () => {
      Game.reset();
      render();
    });
  };
  
  // Initialize game
  const init = () => {
    initEventListeners();
    render();
  };
  
  return { init };
})();

// Start the game
DisplayController.init();