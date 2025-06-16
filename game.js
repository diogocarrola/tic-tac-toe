const Game = (() => {
  // Private variables
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;

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

  // Public interface
  return {
    makeMove(index) {
      if (!gameActive || board[index] !== '') return false;
      
      board[index] = currentPlayer;
      
      if (checkWinner()) {
        gameActive = false;
        return { winner: currentPlayer };
      }
      
      if (!board.includes('')) {
        gameActive = false;
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
      return [...board]; // Return copy
    }
  };
})();