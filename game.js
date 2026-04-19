// ---------------------------------------------------------------------------
// Tetris — Canvas board & tetromino rendering pipeline
// ---------------------------------------------------------------------------

'use strict';

// ── Constants ──────────────────────────────────────────────────────────────

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 30;                       // px per grid cell
const CANVAS_W = COLS * CELL_SIZE;          // 300
const CANVAS_H = ROWS * CELL_SIZE;          // 600

const BOARD_BG       = '#0f0f1b';          // empty-cell background
const GRID_LINE      = '#1c1c34';          // subtle grid lines
const GHOST_ALPHA    = 0.12;               // faint grid-fill shimmer

// ── Tetromino definitions ──────────────────────────────────────────────────
// Each piece is defined in its spawn orientation as a 2-D boolean matrix.
// Colour values follow the "modern" Tetris guideline palette.

const TETROMINOES = {
  I: { color: '#00f0f0', shape: [[1, 1, 1, 1]] },
  O: { color: '#f0f000', shape: [[1, 1],
                                  [1, 1]] },
  T: { color: '#a000f0', shape: [[0, 1, 0],
                                  [1, 1, 1]] },
  S: { color: '#00f000', shape: [[0, 1, 1],
                                  [1, 1, 0]] },
  Z: { color: '#f00000', shape: [[1, 1, 0],
                                  [0, 1, 1]] },
  J: { color: '#0000f0', shape: [[1, 0, 0],
                                  [1, 1, 1]] },
  L: { color: '#f0a000', shape: [[0, 0, 1],
                                  [1, 1, 1]] },
};

const PIECE_NAMES = Object.keys(TETROMINOES);

// ── Canvas setup ───────────────────────────────────────────────────────────

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;

// ── Board state ────────────────────────────────────────────────────────────
// 2-D array: null → empty, string → colour of locked block.

function createBoard() {
  const board = [];
  for (let r = 0; r < ROWS; r++) {
    board.push(new Array(COLS).fill(null));
  }
  return board;
}

const board = createBoard();

// ── Active piece state ─────────────────────────────────────────────────────

/**
 * Represents the currently falling tetromino.
 * @typedef {Object} ActivePiece
 * @property {string}     type  – key into TETROMINOES
 * @property {number[][]} shape – 2-D matrix (row-major)
 * @property {string}     color
 * @property {number}     row   – grid row of the shape's top-left corner
 * @property {number}     col   – grid col of the shape's top-left corner
 */
let activePiece = null;

// ── Piece spawning ─────────────────────────────────────────────────────────

function randomPieceType() {
  return PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
}

/**
 * Spawn a new piece centred at the top of the board.
 * The piece's top-left col is set so the shape is horizontally centred.
 */
function spawnPiece() {
  const type  = randomPieceType();
  const def   = TETROMINOES[type];
  const shape = def.shape.map(row => [...row]);   // defensive copy
  const col   = Math.floor((COLS - shape[0].length) / 2);

  activePiece = { type, shape, color: def.color, row: 0, col };
}

// ── Rendering helpers ──────────────────────────────────────────────────────

/** Fill a single cell with colour + subtle highlight/shadow for depth. */
function drawCell(col, row, color) {
  const x = col * CELL_SIZE;
  const y = row * CELL_SIZE;
  const inset = 1;

  // Main fill
  ctx.fillStyle = color;
  ctx.fillRect(x + inset, y + inset, CELL_SIZE - inset * 2, CELL_SIZE - inset * 2);

  // Top-left highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillRect(x + inset, y + inset, CELL_SIZE - inset * 2, 3);
  ctx.fillRect(x + inset, y + inset, 3, CELL_SIZE - inset * 2);

  // Bottom-right shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(x + inset, y + CELL_SIZE - inset - 3, CELL_SIZE - inset * 2, 3);
  ctx.fillRect(x + CELL_SIZE - inset - 3, y + inset, 3, CELL_SIZE - inset * 2);
}

/** Draw the static background grid (empty cells). */
function drawBackground() {
  // Solid board fill
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Grid lines
  ctx.strokeStyle = GRID_LINE;
  ctx.lineWidth = 0.5;

  for (let c = 1; c < COLS; c++) {
    const x = c * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }

  for (let r = 1; r < ROWS; r++) {
    const y = r * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }
}

/** Draw all locked blocks on the board. */
function drawBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawCell(c, r, board[r][c]);
      }
    }
  }
}

/** Draw the active (falling) tetromino. */
function drawActivePiece() {
  if (!activePiece) return;

  const { shape, color, row: pieceRow, col: pieceCol } = activePiece;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        drawCell(pieceCol + c, pieceRow + r, color);
      }
    }
  }
}

// ── Game loop ──────────────────────────────────────────────────────────────

function gameLoop() {
  drawBackground();
  drawBoard();
  drawActivePiece();
  requestAnimationFrame(gameLoop);
}

// ── Initialise ─────────────────────────────────────────────────────────────

spawnPiece();
requestAnimationFrame(gameLoop);
