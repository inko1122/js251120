// DOM 요소 가져오기
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');

const playerNameInput = document.getElementById('player-name-input');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

const playerNameDisplay = document.getElementById('player-name-display');
const scoreDisplay = document.getElementById('score-display');
const finalPlayerName = document.getElementById('final-player-name');
const finalScore = document.getElementById('final-score');

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 게임 상태 변수
let playerName = '';
let score = 0;
let blocks = [];
let gameInterval;
let spawnInterval;
let isGameOver = false;

const blockWidth = 40;
const blockHeight = 40;

// --- 화면 전환 함수 ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// --- 게임 로직 ---
function startGame() {
    // 상태 초기화
    playerName = playerNameInput.value || '플레이어';
    score = 0;
    blocks = [];
    isGameOver = false;

    // UI 업데이트
    playerNameDisplay.textContent = playerName;
    scoreDisplay.textContent = `점수: ${score}`;

    // 화면 전환
    showScreen('game-screen');

    // 게임 루프 및 블록 생성 시작
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    spawnInterval = setInterval(spawnBlock, 1000); // 1초마다 블록 생성
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    // 최종 점수 표시 (1~1000점 사이로 변환)
    const displayScore = Math.max(1, Math.min(1000, score));
    finalPlayerName.textContent = playerName;
    finalScore.textContent = displayScore;
    
    showScreen('game-over-screen');
}

function restartGame() {
    playerNameInput.value = '';
    showScreen('start-screen');
}

function gameLoop() {
    if (isGameOver) return;

    // 캔버스 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 블록 이동 및 그리기
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        block.y += block.speed;

        // 바닥에 닿았는지 확인
        if (block.y > canvas.height) {
            endGame();
            return;
        }

        // 블록 그리기
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
    }
}

function spawnBlock() {
    if (isGameOver) return;

    const x = Math.random() * (canvas.width - blockWidth);
    const speed = 2 + Math.random() * 2; // 다양한 속도
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    blocks.push({ x, y: 0, speed, color });
}

// --- 이벤트 리스너 ---
startButton.addEventListener('click', () => {
    if (playerNameInput.value.trim() === '') {
        alert('이름을 입력해주세요!');
        return;
    }
    startGame();
});

restartButton.addEventListener('click', restartGame);

canvas.addEventListener('click', (event) => {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // 클릭된 블록 찾기
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (
            clickX >= block.x &&
            clickX <= block.x + blockWidth &&
            clickY >= block.y &&
            clickY <= block.y + blockHeight
        ) {
            // 블록 제거 및 점수 증가
            blocks.splice(i, 1);
            score += 50; // 블록 당 50점
            scoreDisplay.textContent = `점수: ${score}`;
            break; // 한 번에 하나의 블록만 제거
        }
    }
});

// 초기 화면 표시
showScreen('start-screen');
