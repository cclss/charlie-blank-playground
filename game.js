// =============================================================================
// Tetris Game Engine
// =============================================================================
// Entry point: call TetrisGame.init('mainCanvas', 'nextCanvas') with canvas IDs.
// DOM access is limited to the init function. All rendering uses cached refs.
// =============================================================================

const TetrisGame = (() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  const COLS = 10;
  const ROWS = 20;
  const CELL_SIZE = 30;
  const NEXT_CELL_SIZE = 24;
  const HIDDEN_ROWS = 2; // rows above visible area for spawn

  const LOCK_DELAY_MS = 500;
  const DAS_DELAY_MS = 170;  // delayed auto-shift initial delay
  const DAS_REPEAT_MS = 50;  // delayed auto-shift repeat rate

  const POINTS = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
  };

  const LEVEL_LINES = 10; // lines per level

  // Gravity speeds (ms per row drop) indexed by level, capped at index 20
  const GRAVITY = [
    800, 720, 630, 550, 470, 380, 300, 220, 140, 100,
    80,  80,  80,  70,  70,  70,  50,  50,  50,  30,
    30,
  ];

  // Tetromino definitions: each shape is an array of 4 rotations,
  // each rotation is an array of [row, col] offsets from the pivot.
  const TETROMINOES = {
    I: {
      rotations: [
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,0],[1,0],[2,0],[3,0]],
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,0],[1,0],[2,0],[3,0]],
      ],
      color: '#00f0f0', // cyan
    },
    O: {
      rotations: [
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
      ],
      color: '#f0f000', // yellow
    },
    T: {
      rotations: [
        [[0,0],[0,1],[0,2],[1,1]],
        [[0,0],[1,0],[2,0],[1,1]],
        [[1,0],[1,1],[1,2],[0,1]],
        [[0,0],[1,0],[2,0],[1,-1]],
      ],
      color: '#a000f0', // purple
    },
    S: {
      rotations: [
        [[0,1],[0,2],[1,0],[1,1]],
        [[0,0],[1,0],[1,1],[2,1]],
        [[0,1],[0,2],[1,0],[1,1]],
        [[0,0],[1,0],[1,1],[2,1]],
      ],
      color: '#00f000', // green
    },
    Z: {
      rotations: [
        [[0,0],[0,1],[1,1],[1,2]],
        [[0,1],[1,0],[1,1],[2,0]],
        [[0,0],[0,1],[1,1],[1,2]],
        [[0,1],[1,0],[1,1],[2,0]],
      ],
      color: '#f00000', // red
    },
    J: {
      rotations: [
        [[0,0],[1,0],[1,1],[1,2]],
        [[0,0],[0,1],[1,0],[2,0]],
        [[0,0],[0,1],[0,2],[1,2]],
        [[0,0],[1,0],[2,0],[2,-1]],
      ],
      color: '#0000f0', // blue
    },
    L: {
      rotations: [
        [[0,2],[1,0],[1,1],[1,2]],
        [[0,0],[1,0],[2,0],[2,1]],
        [[0,0],[0,1],[0,2],[1,0]],
        [[0,0],[0,1],[1,1],[2,1]],
      ],
      color: '#f0a000', // orange
    },
  };

  const PIECE_NAMES = Object.keys(TETROMINOES); // I, O, T, S, Z, J, L

  // Wall kick data (SRS-like simplified):
  // Offsets to try when a rotation collides, indexed [fromRotation]
  const WALL_KICKS = [
    [[0,0],[-1,0],[+1,0],[0,-1]],
    [[0,0],[-1,0],[+1,0],[0,+1]],
    [[0,0],[-1,0],[+1,0],[0,+1]],
    [[0,0],[-1,0],[+1,0],[0,-1]],
  ];

  const I_WALL_KICKS = [
    [[0,0],[-2,0],[+1,0],[-2,-1],[+1,+2]],
    [[0,0],[+2,0],[-1,0],[+2,+1],[-1,-2]],
    [[0,0],[-2,0],[+1,0],[-2,-1],[+1,+2]],
    [[0,0],[+2,0],[-1,0],[+2,+1],[-1,-2]],
  ];

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  let mainCanvas, mainCtx;
  let nextCanvas, nextCtx;
  let scoreEl, levelEl, linesEl;

  let board;         // 2D array [ROWS + HIDDEN_ROWS][COLS], null or color string
  let currentPiece;  // { type, rotation, row, col }
  let nextPiece;     // { type }
  let bag;           // remaining pieces in the current 7-bag

  let score, level, totalLines;
  let gameOver;
  let paused;

  let dropTimer;     // setTimeout id for gravity
  let lastDropTime;  // timestamp of last gravity drop
  let lockTimer;     // setTimeout id for lock delay
  let animFrameId;   // requestAnimationFrame id

  // DAS (Delayed Auto Shift) state
  let dasDirection;  // 'left' | 'right' | null
  let dasTimer;      // setTimeout id
  let dasActive;     // whether auto-repeat is active

  // Soft drop state
  let softDropping;

  // ---------------------------------------------------------------------------
  // Board helpers
  // ---------------------------------------------------------------------------

  function createBoard() {
    const totalRows = ROWS + HIDDEN_ROWS;
    const b = [];
    for (let r = 0; r < totalRows; r++) {
      b.push(new Array(COLS).fill(null));
    }
    return b;
  }

  function isInBounds(row, col) {
    return row >= 0 && row < ROWS + HIDDEN_ROWS && col >= 0 && col < COLS;
  }

  function isCellFree(row, col) {
    return isInBounds(row, col) && board[row][col] === null;
  }

  // ---------------------------------------------------------------------------
  // Piece helpers
  // ---------------------------------------------------------------------------

  function getPieceCells(piece) {
    const def = TETROMINOES[piece.type];
    const offsets = def.rotations[piece.rotation];
    return offsets.map(([dr, dc]) => [piece.row + dr, piece.col + dc]);
  }

  function canPlace(piece) {
    return getPieceCells(piece).every(([r, c]) => isCellFree(r, c));
  }

  function getGhostRow(piece) {
    let testRow = piece.row;
    while (true) {
      const ghost = { ...piece, row: testRow + 1 };
      if (!canPlace(ghost)) break;
      testRow++;
    }
    return testRow;
  }

  // ---------------------------------------------------------------------------
  // 7-Bag Random Generator
  // ---------------------------------------------------------------------------

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function refillBag() {
    bag = shuffleArray([...PIECE_NAMES]);
  }

  function drawFromBag() {
    if (bag.length === 0) refillBag();
    return bag.pop();
  }

  // ---------------------------------------------------------------------------
  // Piece spawning
  // ---------------------------------------------------------------------------

  function spawnPiece(type) {
    return {
      type: type,
      rotation: 0,
      row: 0,              // top of hidden area
      col: Math.floor((COLS - 3) / 2), // roughly centered
    };
  }

  function spawnNext() {
    const type = nextPiece ? nextPiece.type : drawFromBag();
    currentPiece = spawnPiece(type);
    nextPiece = { type: drawFromBag() };

    if (!canPlace(currentPiece)) {
      // Try nudging down one row (piece might start partially off-board)
      currentPiece.row = 1;
      if (!canPlace(currentPiece)) {
        endGame();
        return false;
      }
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // Movement & Rotation
  // ---------------------------------------------------------------------------

  function movePiece(dRow, dCol) {
    if (gameOver || paused || !currentPiece) return false;
    const test = { ...currentPiece, row: currentPiece.row + dRow, col: currentPiece.col + dCol };
    if (canPlace(test)) {
      currentPiece = test;
      if (dRow === 0) resetLockDelay(); // horizontal movement resets lock delay
      return true;
    }
    return false;
  }

  function rotatePiece(direction) {
    // direction: 1 = clockwise, -1 = counter-clockwise
    if (gameOver || paused || !currentPiece) return false;

    const fromRotation = currentPiece.rotation;
    const toRotation = (fromRotation + direction + 4) % 4;
    const kicks = currentPiece.type === 'I' ? I_WALL_KICKS[fromRotation] : WALL_KICKS[fromRotation];

    for (const [dc, dr] of kicks) {
      const test = {
        ...currentPiece,
        rotation: toRotation,
        row: currentPiece.row + dr,
        col: currentPiece.col + dc,
      };
      if (canPlace(test)) {
        currentPiece = test;
        resetLockDelay();
        return true;
      }
    }
    return false;
  }

  function hardDrop() {
    if (gameOver || paused || !currentPiece) return;
    const ghostRow = getGhostRow(currentPiece);
    const distance = ghostRow - currentPiece.row;
    score += distance * 2;
    currentPiece.row = ghostRow;
    lockPiece();
  }

  // ---------------------------------------------------------------------------
  // Locking & Line clearing
  // ---------------------------------------------------------------------------

  function lockPiece() {
    clearTimeout(lockTimer);
    lockTimer = null;

    const cells = getPieceCells(currentPiece);
    const color = TETROMINOES[currentPiece.type].color;

    for (const [r, c] of cells) {
      if (r >= 0 && r < ROWS + HIDDEN_ROWS && c >= 0 && c < COLS) {
        board[r][c] = color;
      }
    }

    // Check if any locked cell is in the hidden area (game over condition)
    const inHidden = cells.some(([r]) => r < HIDDEN_ROWS);
    if (inHidden) {
      endGame();
      return;
    }

    clearLines();
    currentPiece = null;
    spawnNext();
    scheduleGravity();
  }

  function clearLines() {
    const totalRows = ROWS + HIDDEN_ROWS;
    let cleared = 0;

    for (let r = totalRows - 1; r >= 0; r--) {
      if (board[r].every(cell => cell !== null)) {
        board.splice(r, 1);
        board.unshift(new Array(COLS).fill(null));
        cleared++;
        r++; // re-check this row index since rows shifted down
      }
    }

    if (cleared > 0) {
      const basePoints = POINTS[Math.min(cleared, 4)] || POINTS[4];
      score += basePoints * (level + 1);
      totalLines += cleared;
      const newLevel = Math.floor(totalLines / LEVEL_LINES);
      if (newLevel > level) {
        level = newLevel;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Lock delay
  // ---------------------------------------------------------------------------

  function isOnGround(piece) {
    if (!piece) return false;
    const test = { ...piece, row: piece.row + 1 };
    return !canPlace(test);
  }

  function resetLockDelay() {
    if (lockTimer !== null) {
      clearTimeout(lockTimer);
      lockTimer = null;
    }
    if (isOnGround(currentPiece)) {
      lockTimer = setTimeout(() => {
        if (currentPiece && isOnGround(currentPiece)) {
          lockPiece();
        }
        lockTimer = null;
      }, LOCK_DELAY_MS);
    }
  }

  // ---------------------------------------------------------------------------
  // Gravity
  // ---------------------------------------------------------------------------

  function getGravityInterval() {
    const idx = Math.min(level, GRAVITY.length - 1);
    return GRAVITY[idx];
  }

  function scheduleGravity() {
    clearTimeout(dropTimer);
    const interval = softDropping ? Math.min(getGravityInterval(), 50) : getGravityInterval();
    lastDropTime = performance.now();
    dropTimer = setTimeout(gravityTick, interval);
  }

  function gravityTick() {
    if (gameOver || paused || !currentPiece) return;

    const moved = movePiece(1, 0);
    if (moved) {
      if (softDropping) score += 1;
      scheduleGravity();
    } else {
      // Piece is on the ground — start lock delay if not already running
      if (lockTimer === null) {
        resetLockDelay();
      }
      // Still schedule gravity for when piece might move off ground
      scheduleGravity();
    }
  }

  // ---------------------------------------------------------------------------
  // DAS (Delayed Auto Shift)
  // ---------------------------------------------------------------------------

  function startDAS(direction) {
    if (dasDirection === direction) return;
    stopDAS();
    dasDirection = direction;
    dasActive = false;

    // Immediate first move
    const dc = direction === 'left' ? -1 : 1;
    movePiece(0, dc);

    dasTimer = setTimeout(() => {
      dasActive = true;
      dasRepeat();
    }, DAS_DELAY_MS);
  }

  function dasRepeat() {
    if (!dasDirection || gameOver || paused) return;
    const dc = dasDirection === 'left' ? -1 : 1;
    movePiece(0, dc);
    dasTimer = setTimeout(dasRepeat, DAS_REPEAT_MS);
  }

  function stopDAS(direction) {
    if (direction && dasDirection !== direction) return;
    dasDirection = null;
    dasActive = false;
    clearTimeout(dasTimer);
    dasTimer = null;
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  function render() {
    renderBoard();
    renderNext();
    updateHUD();
    if (!gameOver) {
      animFrameId = requestAnimationFrame(render);
    }
  }

  function renderBoard() {
    const width = COLS * CELL_SIZE;
    const height = ROWS * CELL_SIZE;
    mainCtx.clearRect(0, 0, width, height);

    // Draw grid background
    mainCtx.fillStyle = '#111';
    mainCtx.fillRect(0, 0, width, height);

    // Draw locked cells
    for (let r = HIDDEN_ROWS; r < ROWS + HIDDEN_ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          drawCell(mainCtx, c, r - HIDDEN_ROWS, CELL_SIZE, board[r][c]);
        }
      }
    }

    // Draw ghost piece
    if (currentPiece && !gameOver) {
      const ghostRow = getGhostRow(currentPiece);
      const ghostPiece = { ...currentPiece, row: ghostRow };
      const ghostCells = getPieceCells(ghostPiece);
      const color = TETROMINOES[currentPiece.type].color;

      for (const [r, c] of ghostCells) {
        const visRow = r - HIDDEN_ROWS;
        if (visRow >= 0) {
          drawGhostCell(mainCtx, c, visRow, CELL_SIZE, color);
        }
      }
    }

    // Draw current piece
    if (currentPiece && !gameOver) {
      const cells = getPieceCells(currentPiece);
      const color = TETROMINOES[currentPiece.type].color;
      for (const [r, c] of cells) {
        const visRow = r - HIDDEN_ROWS;
        if (visRow >= 0) {
          drawCell(mainCtx, c, visRow, CELL_SIZE, color);
        }
      }
    }

    // Draw grid lines
    mainCtx.strokeStyle = 'rgba(255,255,255,0.05)';
    mainCtx.lineWidth = 1;
    for (let r = 0; r <= ROWS; r++) {
      mainCtx.beginPath();
      mainCtx.moveTo(0, r * CELL_SIZE + 0.5);
      mainCtx.lineTo(width, r * CELL_SIZE + 0.5);
      mainCtx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      mainCtx.beginPath();
      mainCtx.moveTo(c * CELL_SIZE + 0.5, 0);
      mainCtx.lineTo(c * CELL_SIZE + 0.5, height);
      mainCtx.stroke();
    }

    // Game over overlay
    if (gameOver) {
      mainCtx.fillStyle = 'rgba(0,0,0,0.7)';
      mainCtx.fillRect(0, 0, width, height);
      mainCtx.fillStyle = '#fff';
      mainCtx.font = 'bold 28px sans-serif';
      mainCtx.textAlign = 'center';
      mainCtx.textBaseline = 'middle';
      mainCtx.fillText('GAME OVER', width / 2, height / 2 - 20);
      mainCtx.font = '16px sans-serif';
      mainCtx.fillText('Press R to restart', width / 2, height / 2 + 20);
    }
  }

  function renderNext() {
    if (!nextCanvas || !nextCtx) return;

    const previewSize = 5; // 5x5 grid for preview
    const canvasSize = previewSize * NEXT_CELL_SIZE;
    nextCtx.clearRect(0, 0, canvasSize, canvasSize);
    nextCtx.fillStyle = '#111';
    nextCtx.fillRect(0, 0, canvasSize, canvasSize);

    if (!nextPiece) return;

    const def = TETROMINOES[nextPiece.type];
    const cells = def.rotations[0]; // always show rotation 0

    // Calculate bounding box for centering
    let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
    for (const [r, c] of cells) {
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    }
    const pieceH = maxR - minR + 1;
    const pieceW = maxC - minC + 1;
    const offsetR = Math.floor((previewSize - pieceH) / 2) - minR;
    const offsetC = Math.floor((previewSize - pieceW) / 2) - minC;

    for (const [r, c] of cells) {
      drawCell(nextCtx, c + offsetC, r + offsetR, NEXT_CELL_SIZE, def.color);
    }
  }

  function drawCell(ctx, col, row, size, color) {
    const x = col * size;
    const y = row * size;
    const inset = 1;

    // Main fill
    ctx.fillStyle = color;
    ctx.fillRect(x + inset, y + inset, size - inset * 2, size - inset * 2);

    // Highlight (top-left bevel)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + inset, y + inset, size - inset * 2, 2);
    ctx.fillRect(x + inset, y + inset, 2, size - inset * 2);

    // Shadow (bottom-right bevel)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + inset, y + size - inset - 2, size - inset * 2, 2);
    ctx.fillRect(x + size - inset - 2, y + inset, 2, size - inset * 2);
  }

  function drawGhostCell(ctx, col, row, size, color) {
    const x = col * size;
    const y = row * size;
    const inset = 2;

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + inset, y + inset, size - inset * 2, size - inset * 2);
    ctx.globalAlpha = 1.0;
  }

  function updateHUD() {
    if (scoreEl) scoreEl.textContent = score;
    if (levelEl) levelEl.textContent = level;
    if (linesEl) linesEl.textContent = totalLines;
  }

  // ---------------------------------------------------------------------------
  // Input handling
  // ---------------------------------------------------------------------------

  function onKeyDown(e) {
    if (gameOver) {
      if (e.key === 'r' || e.key === 'R') {
        restartGame();
      }
      return;
    }

    if (e.key === 'p' || e.key === 'P') {
      togglePause();
      return;
    }

    if (paused) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        startDAS('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        startDAS('right');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!softDropping) {
          softDropping = true;
          scheduleGravity();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotatePiece(1); // clockwise
        break;
      case 'z':
      case 'Z':
        rotatePiece(-1); // counter-clockwise
        break;
      case ' ':
        e.preventDefault();
        hardDrop();
        break;
    }
  }

  function onKeyUp(e) {
    switch (e.key) {
      case 'ArrowLeft':
        stopDAS('left');
        break;
      case 'ArrowRight':
        stopDAS('right');
        break;
      case 'ArrowDown':
        softDropping = false;
        if (!gameOver && !paused) scheduleGravity();
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Game lifecycle
  // ---------------------------------------------------------------------------

  function togglePause() {
    if (gameOver) return;
    paused = !paused;
    if (!paused) {
      scheduleGravity();
      animFrameId = requestAnimationFrame(render);
    } else {
      clearTimeout(dropTimer);
      cancelAnimationFrame(animFrameId);
      // Draw pause overlay
      const width = COLS * CELL_SIZE;
      const height = ROWS * CELL_SIZE;
      mainCtx.fillStyle = 'rgba(0,0,0,0.6)';
      mainCtx.fillRect(0, 0, width, height);
      mainCtx.fillStyle = '#fff';
      mainCtx.font = 'bold 24px sans-serif';
      mainCtx.textAlign = 'center';
      mainCtx.textBaseline = 'middle';
      mainCtx.fillText('PAUSED', width / 2, height / 2);
    }
  }

  function endGame() {
    gameOver = true;
    clearTimeout(dropTimer);
    clearTimeout(lockTimer);
    clearTimeout(dasTimer);
    cancelAnimationFrame(animFrameId);
    // Final render to show game over overlay
    renderBoard();
    renderNext();
    updateHUD();
  }

  function resetState() {
    board = createBoard();
    bag = [];
    refillBag();
    currentPiece = null;
    nextPiece = null;
    score = 0;
    level = 0;
    totalLines = 0;
    gameOver = false;
    paused = false;
    softDropping = false;
    dasDirection = null;
    dasActive = false;
    clearTimeout(dropTimer);
    clearTimeout(lockTimer);
    clearTimeout(dasTimer);
    cancelAnimationFrame(animFrameId);
    dropTimer = null;
    lockTimer = null;
    dasTimer = null;
    animFrameId = null;
  }

  function startGame() {
    resetState();
    spawnNext();
    scheduleGravity();
    animFrameId = requestAnimationFrame(render);
  }

  function restartGame() {
    startGame();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  function init(mainCanvasId, nextCanvasId) {
    // Acquire DOM references — this is the only place DOM access occurs
    mainCanvas = document.getElementById(mainCanvasId);
    if (!mainCanvas) throw new Error(`Canvas element "${mainCanvasId}" not found`);
    mainCtx = mainCanvas.getContext('2d');
    mainCanvas.width = COLS * CELL_SIZE;
    mainCanvas.height = ROWS * CELL_SIZE;

    if (nextCanvasId) {
      nextCanvas = document.getElementById(nextCanvasId);
      if (nextCanvas) {
        nextCtx = nextCanvas.getContext('2d');
        const previewSize = 5 * NEXT_CELL_SIZE;
        nextCanvas.width = previewSize;
        nextCanvas.height = previewSize;
      }
    }

    scoreEl = document.getElementById('score');
    levelEl = document.getElementById('level');
    linesEl = document.getElementById('lines');

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    startGame();
  }

  return { init };
})();
