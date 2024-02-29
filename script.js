// Tic-Tac-Toe code
const cells = document.querySelectorAll('.cell');
const playerX = 'X';
const playerO = 'O';
let currentPlayer = playerX;
let board = ['', '', '', '', '', '', '', '', ''];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = Array.from(cells).indexOf(clickedCell);

    if (board[cellIndex] === '' && !checkWinner()) {
        board[cellIndex] = currentPlayer;
        renderBoard();
        if (checkWinner()) {
            alert(`Player ${currentPlayer} wins!`);
            resetTicTacToe();
        } else if (board.every(cell => cell !== '')) {
            alert('It\'s a tie!');
            resetTicTacToe();
        } else {
            switchPlayer();
        }
    }
}

function renderBoard() {
    cells.forEach((cell, index) => {
        cell.innerText = board[index];
    });
}

function switchPlayer() {
    currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    return false;
}

function resetTicTacToe() {
    board = ['', '', '', '', '', '', '', '', ''];
    renderBoard();
    currentPlayer = playerX;
}

document.getElementById('ticTacToeStopBtn').addEventListener('click', resetTicTacToe);


// Pong code with AI
const pongCanvas = document.getElementById('pongCanvas');
const pongCtx = pongCanvas.getContext('2d');
let paddleHeight = 60;
let paddleWidth = 10;
let paddleSpeed = 5;
let paddleLeftY = (pongCanvas.height - paddleHeight) / 2;
let paddleRightY = (pongCanvas.height - paddleHeight) / 2;
let ballX = pongCanvas.width / 2;
let ballY = pongCanvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let gameActivePong = false;
let scoreLeft = 0;
let scoreRight = 0;

function initializePong() {
    document.getElementById('pongStartBtn').addEventListener('click', startPong);
    document.getElementById('pongStopBtn').addEventListener('click', stopPong);
    pongCanvas.addEventListener('mousemove', (e) => handleMouseMove(e));
    setInterval(() => {
        if (gameActivePong) {
            movePaddle();
            moveBall();
            drawPong();
        }
    }, 20);
}

function startPong() {
    gameActivePong = true;
    resetPong();
}

function stopPong() {
    gameActivePong = false;
}

function handleMouseMove(e) {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top - paddleHeight / 2;
    paddleLeftY = mouseY;

   
    if (paddleLeftY < 0) {
        paddleLeftY = 0;
    } else if (paddleLeftY > pongCanvas.height - paddleHeight) {
        paddleLeftY = pongCanvas.height - paddleHeight;
    }
}

function movePaddle() {
    // AI controlled paddle
    if (paddleRightY + paddleHeight / 2 < ballY - 35) {
        paddleRightY += paddleSpeed;
    } else if (paddleRightY + paddleHeight / 2 > ballY + 35) {
        paddleRightY -= paddleSpeed;
    }

    // Ensure the paddle stays within the canvas
    if (paddleRightY < 0) {
        paddleRightY = 0;
    } else if (paddleRightY > pongCanvas.height - paddleHeight) {
        paddleRightY = pongCanvas.height - paddleHeight;
    }
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collisions with top and bottom walls
    if (ballY < 0 || ballY > pongCanvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collisions with paddles
    if (ballX < 0) {
        if (ballY > paddleLeftY && ballY < paddleLeftY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            // Player on the left misses the ball
            scoreRight++;
            resetPong();
        }
    }

    if (ballX > pongCanvas.width) {
        if (ballY > paddleRightY && ballY < paddleRightY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            // Player on the right misses the ball
            scoreLeft++;
            resetPong();
        }
    }
}

function drawPong() {
    pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);

    // Draw paddles
    pongCtx.fillStyle = '#fff';
    pongCtx.fillRect(0, paddleLeftY, paddleWidth, paddleHeight);
    pongCtx.fillRect(pongCanvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);

    // Draw ball
    pongCtx.beginPath();
    pongCtx.arc(ballX, ballY, 5, 0, Math.PI * 2);
    pongCtx.fillStyle = '#fff';
    pongCtx.fill();
    pongCtx.closePath();

    // Draw scores
    pongCtx.font = '20px Arial';
    pongCtx.fillStyle = '#fff';
    pongCtx.fillText('Player Left: ' + scoreLeft, 20, 30);
    pongCtx.fillText('Player Right: ' + scoreRight, pongCanvas.width - 200, 30);
}

function resetPong() {
    ballX = pongCanvas.width / 2;
    ballY = pongCanvas.height / 2;
    paddleLeftY = (pongCanvas.height - paddleHeight) / 2;
    paddleRightY = (pongCanvas.height - paddleHeight) / 2;

    // Reset ball direction randomly
    const direction = Math.random() < 0.5 ? 1 : -1;
    ballSpeedX = 5 * direction;
    ballSpeedY = 5;
}

initializePong();

// Snake code
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = 'right';
let gameActiveSnake = false;

function initializeSnake() {
    document.getElementById('snakeStartBtn').addEventListener('click', startSnake);
    document.getElementById('snakeStopBtn').addEventListener('click', stopSnake);
    snakeCanvas.addEventListener('mousemove', (e) => handleMouseMoveSnake(e));
    setInterval(() => {
        if (gameActiveSnake) {
            moveSnake();
            drawSnake();
            drawFood();
        }
    }, 1000 / 8); // Adjust the speed of the game

    setInterval(() => {
        if (gameActiveSnake) {
            generateFood();
        }
    }, 5000); // Adjust the interval for food spawning
}

function startSnake() {
    gameActiveSnake = true;
    resetSnake();
}

function stopSnake() {
    gameActiveSnake = false;
}

function handleMouseMoveSnake(e) {
    const rect = snakeCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const head = snake[0];
    const deltaX = mouseX - (head.x * snakeSize + snakeSize / 2);
    const deltaY = mouseY - (head.y * snakeSize + snakeSize / 2);

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = (deltaX > 0) ? 'right' : 'left';
    } else {
        direction = (deltaY > 0) ? 'down' : 'up';
    }
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        generateFood();
    } else {
        snake.pop();
    }

    checkCollision();
}

function drawSnake() {
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    snakeCtx.fillStyle = '#fff';
    snake.forEach(segment => {
        snakeCtx.fillRect(segment.x * snakeSize, segment.y * snakeSize, snakeSize, snakeSize);
    });
}

function drawFood() {
    snakeCtx.fillStyle = '#ffcc00';
    snakeCtx.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (snakeCanvas.width / snakeSize)),
        y: Math.floor(Math.random() * (snakeCanvas.height / snakeSize))
    };
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= snakeCanvas.width / snakeSize || head.y >= snakeCanvas.height / snakeSize) {
        resetSnake();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetSnake();
        }
    }
}

function resetSnake() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
}

initializeSnake();
