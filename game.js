const SIZE = 3;
let board = [], currentPlayer = 'red', gameOver = false;
let scores = { player: 0, cpu: 0, draw: 0 }; // 'draw' toegevoegd

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu-overlay').style.display = 'none';
    document.getElementById('label-opponent').innerText = (mode === 'cpu') ? "CPU" : "Geel";
    init();
}

function showMenu() { document.getElementById('menu-overlay').style.display = 'flex'; }
function resetScores() {
    scores = { player: 0, cpu: 0, draw: 0 };
    document.getElementById('score-player').innerText = "0";
    document.getElementById('score-cpu').innerText = "0";
    document.getElementById('score-draw').innerText = "0"; // Reset de teller in de UI
}

function init() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    board = Array(SIZE * SIZE).fill(null);
    gameOver = false;
    
    // Willekeurig bepalen wie begint
    currentPlayer = Math.random() < 0.5 ? 'red' : 'yellow';
    
    for (let i = 0; i < SIZE * SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.onclick = () => play(i);
        boardDiv.appendChild(cell);
    }
    
    updateStatusLabel();

    // Als de computer (yellow) willekeurig is gekozen om te beginnen:
    if (gameMode === 'cpu' && currentPlayer === 'yellow') {
        setTimeout(makeComputerMove, 600);
    }
}

function play(index) {
    if (gameOver || board[index] || (gameMode === 'cpu' && currentPlayer === 'yellow')) return;
    makeMove(index, currentPlayer);
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.getElementById(`cell-${index}`);
    const token = document.createElement('div');
    token.className = `token ${player}`;
    cell.appendChild(token);

    if (checkWin(player)) {
        gameOver = true;
        player === 'red' ? scores.player++ : scores.cpu++;
        document.getElementById('score-player').innerText = scores.player;
        document.getElementById('score-cpu').innerText = scores.cpu;
        setTimeout(() => alert((player === 'red' ? "Rood (X)" : "Geel (O)") + " wint!"), 100);
    } else if (board.every(cell => cell !== null)) {
        gameOver = true;
        setTimeout(() => alert("Gelijkspel!"), 100);
    } else if (board.every(cell => cell !== null)) {
        gameOver = true;
        scores.draw++; // Verhoog de teller
        document.getElementById('score-draw').innerText = scores.draw; // Update de UI
        setTimeout(() => alert("Gelijkspel!"), 100);
    } else {
    }
}

function makeComputerMove() {
    if (gameOver) return;
    let move = getBestMove();
    if (move !== null) makeMove(move, 'yellow');
}

function getBestMove() {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    
    // 1. Win
    for (let p of winPatterns) {
        const [a,b,c] = p;
        if (board[a]==='yellow' && board[b]==='yellow' && !board[c]) return c;
        if (board[a]==='yellow' && board[c]==='yellow' && !board[b]) return b;
        if (board[b]==='yellow' && board[c]==='yellow' && !board[a]) return a;
    }
    // 2. Blokkeer speler
    for (let p of winPatterns) {
        const [a,b,c] = p;
        if (board[a]==='red' && board[b]==='red' && !board[c]) return c;
        if (board[a]==='red' && board[c]==='red' && !board[b]) return b;
        if (board[b]==='red' && board[c]==='red' && !board[a]) return a;
    }
    // 3. Midden of random
    if (!board[4]) return 4;
    let avail = board.map((v,i) => v===null ? i : null).filter(v => v!==null);
    return avail[Math.floor(Math.random() * avail.length)];
}

function checkWin(p) {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return winPatterns.some(pattern => pattern.every(i => board[i] === p));
}

function updateStatusLabel() {
    const l = document.getElementById('player-label');
    // We halen de handmatige (X) en (O) weg uit de tekst, de CSS voegt nu het icoontje toe
    l.innerText = (currentPlayer === 'red') 
        ? "Rood is aan de beurt" 
        : (gameMode === 'cpu' ? "Computer denkt..." : "Geel is aan de beurt");
    l.className = currentPlayer;
}

document.getElementById('reset-btn').onclick = init;