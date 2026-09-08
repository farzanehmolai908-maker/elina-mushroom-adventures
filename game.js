/* ==================================================
   🍄 ELINA MUSHROOM ADVENTURE
   🎮 COMPLETE GAME ENGINE
================================================== */

const game = document.getElementById("game");
const world = document.getElementById("world");
const player = document.getElementById("player");

const livesText = document.getElementById("lives");
const coinsText = document.getElementById("coins");
const scoreText = document.getElementById("score");

const worldNumberText = document.getElementById("worldNumber");
const levelNumberText = document.getElementById("levelNumber");

const message = document.getElementById("message");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const shootBtn = document.getElementById("shootBtn");


/* ==================================================
   GAME DATA
================================================== */

const WORLD_NAMES = [
    "جنگل",
    "برف",
    "آب",
    "آتش"
];

const LEVELS_PER_WORLD = 10;

let currentWorld = 1;
let currentLevel = 1;

let lives = 3;
let coins = 0;
let score = 0;

let playerX = 100;
let playerY = 100;

let velocityY = 0;

const gravity = 0.75;
const moveSpeed = 5.5;
const jumpPower = 15;

let movingLeft = false;
let movingRight = false;

let facing = 1;

let onGround = true;

let gameRunning = true;

let invincible = false;

let cameraX = 0;

let objects = [];

let levelWidth = 5000;


/* ==================================================
   LEVEL SETTINGS
================================================== */

const worldSettings = {

    1: {
        className: "forest",
        sky:
            "linear-gradient(to bottom,#52baff 0%,#a5e8ff 55%,#d9f7ff 100%)"
    },

    2: {
        className: "snow",
        sky:
            "linear-gradient(to bottom,#6ec7ff 0%,#e9f8ff 60%,#ffffff 100%)"
    },

    3: {
        className: "water",
        sky:
            "linear-gradient(to bottom,#2499e8 0%,#83dcff 60%,#4fc3e8 100%)"
    },

    4: {
        className: "fire",
        sky:
            "linear-gradient(to bottom,#42132a 0%,#b72d23 55%,#ff701d 100%)"
    }

};


/* ==================================================
   UTILITY
================================================== */

function createElement(className) {

    const element = document.createElement("div");

    element.className = className;

    world.appendChild(element);

    return element;
}


function clearLevel() {

    objects.forEach(object => {

        if (object.element) {

            object.element.remove();

        }

    });

    objects = [];

}


/* ==================================================
   GROUND
================================================== */

function createGround() {

    const ground = createElement("ground");

    ground.style.left = "0px";
    ground.style.width = levelWidth + "px";

    objects.push({
        type: "ground",
        element: ground,
        x: 0,
        y: 0,
        width: levelWidth,
        height: 100
    });

}


/* ==================================================
   PLATFORM
================================================== */

function createPlatform(x, y, width) {

    const element = createElement("platform");

    element.style.left = x + "px";
    element.style.bottom = y + "px";
    element.style.width = width + "px";

    objects.push({

        type: "platform",

        element: element,

        x: x,
        y: y,
        width: width,
        height: 28

    });

}


/* ==================================================
   COIN
================================================== */

function createCoin(x, y) {

    const element = createElement("coin");

    element.style.left = x + "px";
    element.style.bottom = y + "px";

    objects.push({

        type: "coin",

        element: element,

        x: x,
        y: y,

        width: 30,
        height: 30,

        collected: false

    });

}


/* ==================================================
   ENEMY
================================================== */

function createEnemy(x, y, type) {

    const element = createElement("enemy " + type);

    element.style.left = x + "px";
    element.style.bottom = y + "px";

    objects.push({

        type: "enemy",

        enemyType: type,

        element: element,

        x: x,
        y: y,

        width: 50,
        height: 45,

        direction: -1,

        startX: x,

        minX: x - 100,

        maxX: x + 100,

        alive: true

    });

}


/* ==================================================
   FLAG
================================================== */

function createFlag(x) {

    const element = createElement("flag");

    element.style.left = x + "px";
    element.style.bottom = "100px";

    objects.push({

        type: "flag",

        element: element,

        x: x,
        y: 100,

        width: 70,
        height: 100

    });

}


/* ==================================================
   BOSS
================================================== */

function createBoss(x) {

    const element = createElement("boss");

    element.style.left = x + "px";
    element.style.bottom = "100px";

    objects.push({

        type: "boss",

        element: element,

        x: x,
        y: 100,

        width: 110,
        height: 100,

        health: 5,

        direction: -1,

        startX: x,

        alive: true

    });

}


/* ==================================================
   FATHER + CAGE
================================================== */

function createFather(x) {

    const cage = createElement("cage");

    cage.style.left = x + "px";
    cage.style.bottom = "100px";

    const father = document.createElement("div");

    father.className = "father";

    cage.appendChild(father);

    objects.push({

        type: "cage",

        element: cage,

        x: x,

        y: 100,

        width: 100,

        height: 120

    });

}


/* ==================================================
   BUILD LEVEL
================================================== */

function buildLevel() {

    clearLevel();

    levelWidth = 5000;

    world.style.width = levelWidth + "px";

    createGround();

    /* -----------------------------
       پلتفرم‌ها
    ----------------------------- */

    for (let i = 0; i < 12; i++) {

        const x = 400 + i * 350;

        const y =
            160 +
            (i % 3) * 60;

        createPlatform(
            x,
            y,
            160
        );

    }


    /* -----------------------------
       سکه‌ها
    ----------------------------- */

    for (let i = 0; i < 25; i++) {

        const x =
            250 +
            i * 180;

        const y =
            140 +
            (i % 4) * 55;

        createCoin(
            x,
            y
        );

    }


    /* -----------------------------
       دشمن‌ها
    ----------------------------- */

    const enemyType =
        worldSettings[currentWorld].className;

    for (let i = 0; i < 12; i++) {

        createEnemy(
            600 + i * 330,
            100,
            enemyType
        );

    }


    /* -----------------------------
       پرچم
    ----------------------------- */

    createFlag(
        levelWidth - 400
    );


    /* -----------------------------
       باس
    ----------------------------- */

    if (currentLevel === 10) {

        createBoss(
            levelWidth - 700
        );

        createFather(
            levelWidth - 180
        );

    }


    /* -----------------------------
       موقعیت بازیکن
    ----------------------------- */

    playerX = 100;
    playerY = 100;

    velocityY = 0;

    onGround = true;

    cameraX = 0;

    updatePlayer();

    updateHUD();

    setWorldBackground();

}


/* ==================================================
   WORLD BACKGROUND
================================================== */

function setWorldBackground() {

    const sky =
        document.getElementById("sky");

    sky.style.background =
        worldSettings[currentWorld].sky;

}


/* ==================================================
   PLAYER
================================================== */

function updatePlayer() {

    player.style.left =
        playerX + "px";

    player.style.bottom =
        playerY + "px";

    if (facing === -1) {

        player.style.transform =
            "scaleX(-1)";

    } else {

        player.style.transform =
            "scaleX(1)";

    }

}


/* ==================================================
   PLAYER RECT
================================================== */

function playerRect() {

    return {

        left: playerX,

        right:
            playerX +
            player.offsetWidth,

        bottom: playerY,

        top:
            playerY +
            player.offsetHeight

    };

}


/* ==================================================
   COLLISION
================================================== */

function isColliding(a, b) {

    return (

        a.left < b.right &&
        a.right > b.left &&
        a.bottom < b.top &&
        a.top > b.bottom

    );

}


/* ==================================================
   MOVE PLAYER
================================================== */

function movePlayer() {

    if (!gameRunning)
        return;


    if (movingLeft) {

        playerX -= moveSpeed;

        facing = -1;

    }


    if (movingRight) {

        playerX += moveSpeed;

        facing = 1;

    }


    if (playerX < 0) {

        playerX = 0;

    }


    if (playerX >
        levelWidth -
        player.offsetWidth) {

        playerX =
            levelWidth -
            player.offsetWidth;

    }


    updatePlayer();

}


/* ==================================================
   GRAVITY
================================================== */

function applyGravity() {

    if (onGround)
        return;


    velocityY -= gravity;

    playerY += velocityY;


    if (playerY <= 100) {

        playerY = 100;

        velocityY = 0;

        onGround = true;

    }


    /* برخورد با پلتفرم */

    const pRect = playerRect();

    for (const obj of objects) {

        if (
            obj.type !== "platform"
        )
            continue;


        const platformRect = {

            left: obj.x,

            right:
                obj.x +
                obj.width,

            bottom: obj.y,

            top:
                obj.y +
                obj.height

        };


        if (

            pRect.right >
            platformRect.left &&

            pRect.left <
            platformRect.right &&

            pRect.bottom <=
            platformRect.top + 15 &&

            pRect.bottom >=
            platformRect.bottom &&

            velocityY <= 0

        ) {

            playerY =
                platformRect.top;

            velocityY = 0;

            onGround = true;

        }

    }


    updatePlayer();

}


/* ==================================================
   JUMP
================================================== */

function jump() {

    if (!gameRunning)
        return;

    if (!onGround)
        return;


    velocityY =
        jumpPower;

    onGround = false;

}


/* ==================================================
   COINS
================================================== */

function checkCoins() {

    const p = playerRect();

    for (const obj of objects) {

        if (
            obj.type !== "coin" ||
            obj.collected
        )
            continue;


        const c = {

            left: obj.x,

            right:
                obj.x +
                obj.width,

            bottom: obj.y,

            top:
                obj.y +
                obj.height

        };


        if (isColliding(p, c)) {

            obj.collected = true;

            obj.element.remove();

            coins++;

            score += 100;

            updateHUD();

        }

    }

}


/* ==================================================
   ENEMY MOVEMENT
================================================== */

function moveEnemies() {

    for (const obj of objects) {

        if (
            obj.type !== "enemy" ||
            !obj.alive
        )
            continue;


        obj.x +=
            obj.direction * 1.5;


        if (obj.x <= obj.minX) {

            obj.direction = 1;

        }


        if (obj.x >= obj.maxX) {

            obj.direction = -1;

        }


        obj.element.style.left =
            obj.x + "px";

    }

}


/* ==================================================
   ENEMY COLLISION
================================================== */

function checkEnemies() {

    if (invincible)
        return;


    const p =
        playerRect();


    for (const obj of objects) {

        if (
            obj.type !== "enemy" ||
            !obj.alive
        )
            continue;


        const e = {

            left: obj.x,

            right:
                obj.x +
                obj.width,

            bottom: obj.y,

            top:
                obj.y +
                obj.height

        };


        if (isColliding(p, e)) {

            loseLife();

            return;

        }

    }

}


/* ==================================================
   LOSE LIFE
================================================== */

function loseLife() {

    if (invincible)
        return;


    lives--;

    updateHUD();


    invincible = true;

    player.style.opacity =
        "0.45";


    setTimeout(() => {

        invincible = false;

        player.style.opacity =
            "1";

    }, 1500);


    playerX = 100;

    playerY = 100;

    velocityY = 0;

    cameraX = 0;

    updatePlayer();


    if (lives <= 0) {

        gameOver();

    }

}


/* ==================================================
   SHOOT
================================================== */

function shoot() {

    if (!gameRunning)
        return;


    const bullet =
        document.createElement("div");

    bullet.className =
        "bullet";


    let bulletX =
        playerX +
        (facing === 1 ? 45 : -15);

    let bulletY =
        playerY + 40;


    bullet.style.left =
        bulletX + "px";

    bullet.style.bottom =
        bulletY + "px";


    world.appendChild(
        bullet
    );


    const bulletSpeed =
        facing === 1 ? 11 : -11;


    const timer =
        setInterval(() => {

            bulletX +=
                bulletSpeed;


            bullet.style.left =
                bulletX + "px";


            /* برخورد با دشمن */

            for (const obj of objects) {

                if (
                    obj.type === "enemy" &&
                    obj.alive
                ) {

                    if (

                        bulletX <
                        obj.x +
                        obj.width &&

                        bulletX +
                        16 >
                        obj.x

                    ) {

                        obj.alive =
                            false;

                        obj.element.remove();

                        clearInterval(timer);

                        bullet.remove();

                        score += 200;

                        updateHUD();

                        return;

                    }

                }


                /* برخورد با باس */

                if (
                    obj.type === "boss" &&
                    obj.alive
                ) {

                    if (

                        bulletX <
                        obj.x +
                        obj.width &&

                        bulletX +
                        16 >
                        obj.x

                    ) {

                        obj.health--;

                        clearInterval(timer);

                        bullet.remove();


                        if (
                            obj.health <= 0
                        ) {

                            obj.alive =
                                false;

                            obj.element.remove();

                            score += 2000;

                            updateHUD();

                            showMessage(
                                "👑 باس شکست خورد!"
                            );

                        }

                        return;

                    }

                }

            }


            if (
                bulletX < -100 ||
                bulletX > levelWidth + 100
            ) {

                clearInterval(timer);

                bullet.remove();

            }

        }, 20);

}


/* ==================================================
   FLAG / LEVEL END
================================================== */

function checkFlag() {

    const p =
        playerRect();


    for (const obj of objects) {

        if (
            obj.type !== "flag"
        )
            continue;


        const flagRect = {

            left: obj.x,

            right:
                obj.x +
                obj.width,

            bottom: 100,

            top: 200

        };


        if (
            isColliding(
                p,
                flagRect
            )
        ) {


            if (
                currentLevel === 10
            ) {

                const bossAlive =
                    objects.some(
                        o =>
                            o.type === "boss" &&
                            o.alive
                    );


                if (bossAlive) {

                    showMessage(
                        "👑 اول باس را شکست بده!"
                    );

                    return;

                }

            }


            nextLevel();

            return;

        }

    }

}


/* ==================================================
   NEXT LEVEL
================================================== */

function nextLevel() {

    currentLevel++;


    if (
        currentLevel >
        LEVELS_PER_WORLD
    ) {

        currentLevel = 1;

        currentWorld++;


        if (
            currentWorld > 4
        ) {

            winGame();

            return;

        }

    }


    showMessage(
        "مرحله بعدی! 🚩"
    );


    setTimeout(() => {

        buildLevel();

    }, 900);

}


/* ==================================================
   CAMERA
================================================== */

function updateCamera() {

    const screenWidth =
        game.clientWidth;


    const target =
        playerX -
        screenWidth * 0.35;


    cameraX +=
        (target - cameraX) *
        0.12;


    if (cameraX < 0)
        cameraX = 0;


    const maxCamera =
        levelWidth -
        screenWidth;


    if (
        cameraX >
        maxCamera
    ) {

        cameraX =
            maxCamera;

    }


    if (cameraX < 0)
        cameraX = 0;


    world.style.transform =
        `translateX(${-cameraX}px)`;

}


/* ==================================================
   HUD
================================================== */

function updateHUD() {

    livesText.textContent =
        lives;

    coinsText.textContent =
        coins;

    scoreText.textContent =
        score;

    worldNumberText.textContent =
        currentWorld;

    levelNumberText.textContent =
        currentLevel;

}


/* ==================================================
   MESSAGE
================================================== */

function showMessage(text) {

    message.textContent =
        text;


    setTimeout(() => {

        message.textContent =
            "";

    }, 1500);

}


/* ==================================================
   GAME OVER
================================================== */

function gameOver() {

    gameRunning = false;

    message.innerHTML =

        `💔 بازی تمام شد!
        <br>
        <small>امتیاز: ${score}</small>
        <br><br>
        <button onclick="location.reload()">
        دوباره بازی
        </button>`;

}


/* ==================================================
   WIN
================================================== */

function winGame() {

    gameRunning = false;

    message.innerHTML =

        `🏆 تبریک الینا!
        <br>
        🎉 تمام دنیاها را کامل کردی!
        <br>
        👨‍👧 پدرت را نجات دادی!
        <br><br>
        ⭐ امتیاز: ${score}
        <br>
        🪙 سکه: ${coins}`;

}


/* ==================================================
   KEYBOARD
================================================== */

document.addEventListener(
    "keydown",
    event => {

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


        if (
            event.key.toLowerCase() === "f"
        ) {

            shoot();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

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

    }
);


/* ==================================================
   TOUCH CONTROLS
================================================== */

function holdButton(
    button,
    start,
    stop
) {

    button.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            start();

        }
    );


    button.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            stop();

        }
    );


    button.addEventListener(
        "pointercancel",
        stop
    );


    button.addEventListener(
        "pointerleave",
        stop
    );

}


/* حرکت چپ */

holdButton(

    leftBtn,

    () => {
        movingLeft = true;
    },

    () => {
        movingLeft = false;
    }

);


/* حرکت راست */

holdButton(

    rightBtn,

    () => {
        movingRight = true;
    },

    () => {
        movingRight = false;
    }

);


/* پرش */

jumpBtn.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        jump();

    }
);


/* شلیک */

shootBtn.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        shoot();

    }
);


/* ==================================================
   GAME LOOP
================================================== */

function gameLoop() {

    if (gameRunning) {

        movePlayer();

        applyGravity();

        moveEnemies();

        checkCoins();

        checkEnemies();

        checkFlag();

        updateCamera();

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* ==================================================
   START
================================================== */

buildLevel();

updateHUD();

gameLoop();

console.log(
    "🍄 Elina Mushroom Adventure loaded successfully!"
);
