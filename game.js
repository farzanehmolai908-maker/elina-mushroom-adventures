// ======================================
// 🍄 ELINA MUSHROOM ADVENTURE
// 🎮 Game Engine - Version 1
// ======================================

// ---------- عناصر بازی ----------
const game = document.getElementById("game");
const player = document.getElementById("player");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const shootBtn = document.getElementById("shootBtn");

const livesText = document.getElementById("lives");
const coinsText = document.getElementById("coins");
const scoreText = document.getElementById("score");

// ---------- وضعیت بازی ----------
const state = {
    x: 80,
    y: 80,

    velocityX: 0,
    velocityY: 0,

    speed: 5,
    jumpPower: 14,
    gravity: 0.7,

    onGround: true,

    lives: 3,
    coins: 0,
    score: 0,

    movingLeft: false,
    movingRight: false
};

// ---------- اندازه زمین ----------
const groundHeight = 80;

// ---------- کنترل حرکت ----------

function startLeft() {
    state.movingLeft = true;
}

function stopLeft() {
    state.movingLeft = false;
}

function startRight() {
    state.movingRight = true;
}

function stopRight() {
    state.movingRight = false;
}

// ---------- حرکت چپ ----------
leftBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    startLeft();
});

leftBtn.addEventListener("touchend", (event) => {
    event.preventDefault();
    stopLeft();
});

leftBtn.addEventListener("mousedown", startLeft);
leftBtn.addEventListener("mouseup", stopLeft);
leftBtn.addEventListener("mouseleave", stopLeft);

// ---------- حرکت راست ----------
rightBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    startRight();
});

rightBtn.addEventListener("touchend", (event) => {
    event.preventDefault();
    stopRight();
});

rightBtn.addEventListener("mousedown", startRight);
rightBtn.addEventListener("mouseup", stopRight);
rightBtn.addEventListener("mouseleave", stopRight);

// ---------- کیبورد ----------
document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        state.movingLeft = true;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        state.movingRight = true;
    }

    if (
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.key.toLowerCase() === "w"
    ) {
        jump();
    }
});

document.addEventListener("keyup", (event) => {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        state.movingLeft = false;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        state.movingRight = false;
    }
});

// ---------- پرش ----------
function jump() {

    if (state.onGround) {
        state.velocityY = state.jumpPower;
        state.onGround = false;
    }
}

jumpBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    jump();
});

jumpBtn.addEventListener("click", jump);

// ---------- شلیک فعلاً ----------
shootBtn.addEventListener("click", () => {
    console.log("🔫 Shoot button pressed!");
});

// ---------- به‌روزرسانی موقعیت ----------
function updatePlayer() {

    // حرکت افقی
    if (state.movingLeft) {
        state.velocityX = -state.speed;
    } 
    else if (state.movingRight) {
        state.velocityX = state.speed;
    } 
    else {
        state.velocityX = 0;
    }

    state.x += state.velocityX;

    // محدود کردن حرکت به صفحه
    const maxX = game.clientWidth - player.offsetWidth;

    if (state.x < 0) {
        state.x = 0;
    }

    if (state.x > maxX) {
        state.x = maxX;
    }

    // گرانش
    state.velocityY -= state.gravity;

    state.y -= state.velocityY;

    // برخورد با زمین
    const groundY = groundHeight;

    if (state.y <= groundY) {
        state.y = groundY;
        state.velocityY = 0;
        state.onGround = true;
    }

    // نمایش بازیکن
    player.style.left = state.x + "px";
    player.style.bottom = state.y + "px";
}

// ---------- HUD ----------
function updateHUD() {
    livesText.textContent = state.lives;
    coinsText.textContent = state.coins;
    scoreText.textContent = state.score;
}

// ---------- حلقه اصلی بازی ----------
function gameLoop() {

    updatePlayer();
    updateHUD();

    requestAnimationFrame(gameLoop);
}

// ---------- شروع بازی ----------
updateHUD();
gameLoop();

console.log("🍄 Elina Mushroom Adventure started!");
