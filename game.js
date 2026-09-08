// ==========================================
// 🍄 ELINA MUSHROOM ADVENTURE
// 🎮 GAME.JS - VERSION 1
// ==========================================

const game = document.getElementById("game");
const player = document.getElementById("player");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const shootBtn = document.getElementById("shootBtn");

const livesText = document.getElementById("lives");
const coinsText = document.getElementById("coins");
const scoreText = document.getElementById("score");

// ==========================================
// وضعیت بازی
// ==========================================

let playerX = 80;
let playerY = 80;

let velocityY = 0;

const speed = 5;
const jumpPower = 14;
const gravity = 0.7;

let movingLeft = false;
let movingRight = false;

let onGround = true;

let lives = 3;
let coins = 0;
let score = 0;

let gameOver = false;

// ==========================================
// تنظیم اولیه بازیکن
// ==========================================

function updatePlayer() {
    player.style.left = playerX + "px";
    player.style.bottom = playerY + "px";
}

// ==========================================
// حرکت بازیکن
// ==========================================

function movePlayer() {

    if (movingLeft) {
        playerX -= speed;
    }

    if (movingRight) {
        playerX += speed;
    }

    // جلوگیری از خروج بازیکن از صفحه
    const maxX = game.clientWidth - player.offsetWidth;

    if (playerX < 0) {
        playerX = 0;
    }

    if (playerX > maxX) {
        playerX = maxX;
    }

    updatePlayer();
}

// ==========================================
// پرش
// ==========================================

function jump() {

    if (!onGround || gameOver) {
        return;
    }

    velocityY = jumpPower;
    onGround = false;
}

// ==========================================
// گرانش
// ==========================================

function applyGravity() {

    if (onGround) {
        return;
    }

    velocityY -= gravity;
    playerY += velocityY;

    // برخورد با زمین
    if (playerY <= 80) {
        playerY = 80;
        velocityY = 0;
        onGround = true;
    }

    updatePlayer();
}

// ==========================================
// کنترل دکمه چپ
// ==========================================

function leftStart(event) {
    if (event) event.preventDefault();
    movingLeft = true;
}

function leftStop(event) {
    if (event) event.preventDefault();
    movingLeft = false;
}

leftBtn.addEventListener("mousedown", leftStart);
leftBtn.addEventListener("mouseup", leftStop);
leftBtn.addEventListener("mouseleave", leftStop);

leftBtn.addEventListener("touchstart", leftStart, {
    passive: false
});

leftBtn.addEventListener("touchend", leftStop, {
    passive: false
});

// ==========================================
// کنترل دکمه راست
// ==========================================

function rightStart(event) {
    if (event) event.preventDefault();
    movingRight = true;
}

function rightStop(event) {
    if (event) event.preventDefault();
    movingRight = false;
}

rightBtn.addEventListener("mousedown", rightStart);
rightBtn.addEventListener("mouseup", rightStop);
rightBtn.addEventListener("mouseleave", rightStop);

rightBtn.addEventListener("touchstart", rightStart, {
    passive: false
});

rightBtn.addEventListener("touchend", rightStop, {
    passive: false
});

// ==========================================
// دکمه پرش
// ==========================================

jumpBtn.addEventListener("click", jump);

jumpBtn.addEventListener("touchstart", function(event) {
    event.preventDefault();
    jump();
}, {
    passive: false
});

// ==========================================
// کنترل کیبورد
// ==========================================

document.addEventListener("keydown", function(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        movingLeft = true;
    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        movingRight = true;
    }

    if (
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.key.toLowerCase() === "w"
    ) {
        jump();
    }
});

document.addEventListener("keyup", function(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        movingLeft = false;
    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        movingRight = false;
    }
});

// ==========================================
// سکه
// ==========================================

const coin = document.createElement("div");

coin.style.position = "absolute";
coin.style.width = "25px";
coin.style.height = "25px";
coin.style.borderRadius = "50%";
coin.style.background = "gold";
coin.style.border = "3px solid #d99b00";
coin.style.left = "300px";
coin.style.bottom = "100px";
coin.style.zIndex = "30";

game.appendChild(coin);

// ==========================================
// جمع کردن سکه
// ==========================================

function collectCoin() {

    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    if (
        playerRect.left < coinRect.right &&
        playerRect.right > coinRect.left &&
        playerRect.top < coinRect.bottom &&
        playerRect.bottom > coinRect.top
    ) {

        coin.remove();

        coins++;
        score += 100;

        updateHUD();
    }
}

// ==========================================
// دشمن
// ==========================================

const enemy = document.createElement("div");

enemy.style.position = "absolute";
enemy.style.width = "45px";
enemy.style.height = "40px";
enemy.style.left = "550px";
enemy.style.bottom = "80px";
enemy.style.background = "#6b4b2a";
enemy.style.borderRadius = "50% 50% 35% 35%";
enemy.style.border = "3px solid #3e2918";
enemy.style.zIndex = "30";

game.appendChild(enemy);

let enemyDirection = -1;
let enemyX = 550;

// ==========================================
// حرکت دشمن
// ==========================================

function moveEnemy() {

    enemyX += enemyDirection * 2;

    if (enemyX <= 400) {
        enemyDirection = 1;
    }

    if (enemyX >= 650) {
        enemyDirection = -1;
    }

    enemy.style.left = enemyX + "px";
}

// ==========================================
// برخورد با دشمن
// ==========================================

function checkEnemyCollision() {

    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
        playerRect.left < enemyRect.right &&
        playerRect.right > enemyRect.left &&
        playerRect.top < enemyRect.bottom &&
        playerRect.bottom > enemyRect.top
    ) {

        lives--;

        score = Math.max(0, score - 50);

        playerX = 80;
        playerY = 80;

        updateHUD();

        if (lives <= 0) {
            endGame();
        }
    }
}

// ==========================================
// شلیک
// ==========================================

function shoot() {

    if (gameOver) {
        return;
    }

    const bullet = document.createElement("div");

    bullet.style.position = "absolute";
    bullet.style.width = "14px";
    bullet.style.height = "7px";
    bullet.style.background = "white";
    bullet.style.borderRadius = "10px";
    bullet.style.left = (playerX + 45) + "px";
    bullet.style.bottom = (playerY + 25) + "px";
    bullet.style.zIndex = "40";

    game.appendChild(bullet);

    let bulletX = playerX + 45;

    const bulletTimer = setInterval(function() {

        bulletX += 9;

        bullet.style.left = bulletX + "px";

        // برخورد تیر با دشمن
        const bulletRect = bullet.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (
            bulletRect.left < enemyRect.right &&
            bulletRect.right > enemyRect.left &&
            bulletRect.top < enemyRect.bottom &&
            bulletRect.bottom > enemyRect.top
        ) {

            clearInterval(bulletTimer);

            bullet.remove();

            enemyX = 700;
            score += 200;

            updateHUD();
        }

        // خروج تیر از صفحه
        if (bulletX > game.clientWidth) {

            clearInterval(bulletTimer);

            bullet.remove();
        }

    }, 20);
}

shootBtn.addEventListener("click", shoot);

shootBtn.addEventListener("touchstart", function(event) {
    event.preventDefault();
    shoot();
}, {
    passive: false
});

// ==========================================
// HUD
// ==========================================

function updateHUD() {

    livesText.textContent = lives;
    coinsText.textContent = coins;
    scoreText.textContent = score;
}

// ==========================================
// پایان بازی
// ==========================================

function endGame() {

    gameOver = true;

    const message = document.createElement("div");

    message.id = "gameOverMessage";

    message.style.position = "absolute";
    message.style.left = "50%";
    message.style.top = "50%";
    message.style.transform = "translate(-50%, -50%)";

    message.style.padding = "25px 35px";

    message.style.background = "rgba(0,0,0,0.85)";
    message.style.color = "white";

    message.style.borderRadius = "20px";

    message.style.textAlign = "center";
    message.style.fontSize = "24px";
    message.style.fontWeight = "bold";

    message.style.zIndex = "500";

    message.innerHTML = `
        💔 بازی تمام شد!
        <br>
        <small>امتیاز: ${score}</small>
        <br><br>
        <button onclick="location.reload()"
        style="
        padding:10px 20px;
        border:none;
        border-radius:10px;
        font-size:18px;
        cursor:pointer;
        ">
        دوباره بازی
        </button>
    `;

    game.appendChild(message);
}

// ==========================================
// حلقه اصلی بازی
// ==========================================

function gameLoop() {

    if (!gameOver) {

        movePlayer();
        applyGravity();

        moveEnemy();

        collectCoin();

        checkEnemyCollision();
    }

    requestAnimationFrame(gameLoop);
}

// ==========================================
// شروع بازی
// ==========================================

updatePlayer();
updateHUD();

gameLoop();

console.log("🍄 Elina Mushroom Adventure is running!");
