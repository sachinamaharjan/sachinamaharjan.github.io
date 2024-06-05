const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let timerSeconds = 180;
let timerInterval;
let score = 0;
let isGameRunning = false;
let isGamePaused = false;

// const wormImage = new Image();
const WORM_STAGE_1 = 1;
const WORM_STAGE_2 = 2;
const WORM_STAGE_3 = 3;
const WORM_STAGE_4 = 4;
const characterImage = new Image();
const backgroundImage = new Image();

// Selected game duration (default: 180 seconds)
let selectedTime = 180;


characterImage.src = 'character.png';
backgroundImage.src = 'background.jpg';

// Load background audio and game sounds
const backgroundAudio = new Audio('background.mp3');
backgroundAudio.loop = true;

const startSound = new Audio('Start.wav');
const gameOverSound = new Audio('Gameover.wav');
const pauseSound = new Audio('Pause.mp3');
const catchSound = new Audio('catch.mp3'); 

// Ensure images are loaded before starting the game
let imagesLoaded = 0;
const totalImages = 2;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        console.log('All images loaded. Starting game...');
        updateGameState();
    }
}

characterImage.onload = checkImagesLoaded;
backgroundImage.onload = checkImagesLoaded;

// Handle time selection button click
function handleTimeSelection(event) {
    if (!isGameRunning) {
        selectedTime = parseInt(event.target.dataset.time); 
        document.querySelectorAll('.timeButton').forEach(button => {
            button.style.backgroundColor = 'blue'; // Reset all time selection buttons to blue
        });
        event.target.style.backgroundColor = 'green'; // Highlight selected time button in green
        timerSeconds = selectedTime; // Set the game timer to the selected time
    }
}

// Character and worms data
const character = { x: canvas.width / 2, y: canvas.height / 2, width: 80, height: 80, direction: 'right', speed: 4 };
const worms = Array.from({ length: 10 }, () => createWorm());

function createWorm() {
    return {
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height - 40) + 20,
        stage: WORM_STAGE_1, // Initialize worm stage
        radius: 10, // Initial radius
        speed: Math.random() * 2 + 1, // Random speed
        directionX: Math.random() < 0.5 ? -1 : 1, // Random direction X
        directionY: Math.random() < 0.5 ? -1 : 1, // Random direction Y
        caught: false,
    };
}

// Draw functions
function drawCharacter() {
    ctx.save();
    ctx.translate(character.x, character.y);
    if (character.direction === 'left') {
        ctx.scale(-1, 1);
    }
    ctx.drawImage(characterImage, -character.width / 2, -character.height / 2, character.width, character.height);
    ctx.restore();
}

function drawWorm(worm) {
    switch (worm.stage) {
        case WORM_STAGE_1:
            // Draw small sand-colored semi-circle
            ctx.beginPath();
            ctx.fillStyle = '#deb887'; // Sand color
            ctx.arc(worm.x, worm.y, worm.radius, 0, Math.PI, true);
            ctx.fill();
            break;
        case WORM_STAGE_2:
        case WORM_STAGE_3:
            // Draw growing/shrinking semi-circle
            ctx.beginPath();
            ctx.fillStyle = '#deb887'; // Sand color
            ctx.arc(worm.x, worm.y, worm.radius, 0, Math.PI, true);
            ctx.fill();
            break;
        case WORM_STAGE_4:
            // Skip drawing for Stage 4 (worm disappears)
            break;
        default:
            break;
    }
    
    // If worm stage is Stage 4, relocate worm to a random location on canvas
    if (worm.stage === WORM_STAGE_4) {
        worm.x = Math.random() * canvas.width;
        worm.y = Math.random() * canvas.height;
        worm.stage = WORM_STAGE_1; // Restart life cycle
    }    
}

function updateGameState() {
    console.log('Updating game state');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // Draw worms and character
    worms.forEach(worm => {
        drawWorm(worm);
    });
    drawCharacter();
    console.log('Character position:', character.x, character.y);
}

function gameLoop() {
    gameInterval = setInterval(() => {
        // Update character position
        updateCharacterPosition();

        // Move worms and update game state
        moveWorms();
        updateGameState();
    }, 1000 / 20); // Update the game approximately 30 times per second
}

window.addEventListener('load', () => {
    // Assets are loaded, start the game loop
    gameLoop();
});

function moveWorms() {
    worms.forEach(worm => {
        switch (worm.stage) {
            case WORM_STAGE_1:
                // Random movement with radius increase
                worm.x += worm.speed * worm.directionX;
                worm.y += worm.speed * worm.directionY;

                // Ensure worm stays within canvas boundaries
                worm.x = Math.max(worm.radius, Math.min(worm.x, canvas.width - worm.radius));
                worm.y = Math.max(worm.radius, Math.min(worm.y, canvas.height - worm.radius));

                // Update direction if worm hits the canvas boundaries
                if (worm.x <= worm.radius || worm.x >= canvas.width - worm.radius) {
                    worm.directionX *= -1;
                }
                if (worm.y <= worm.radius || worm.y >= canvas.height - worm.radius) {
                    worm.directionY *= -1;
                }

                // Check if worm has reached stage 2
                if (worm.radius >= 40) {
                    worm.stage = WORM_STAGE_2;
                } else {
                    worm.radius += 0.1;
                }
                break;

            case WORM_STAGE_2:
                // Move randomly with boundary checks
                worm.x += worm.speed * worm.directionX;
                worm.y += worm.speed * worm.directionY;

                worm.x = Math.max(worm.radius, Math.min(worm.x, canvas.width - worm.radius));
                worm.y = Math.max(worm.radius, Math.min(worm.y, canvas.height - worm.radius));

                if (worm.x <= worm.radius || worm.x >= canvas.width - worm.radius) {
                    worm.directionX *= -1;
                }
                if (worm.y <= worm.radius || worm.y >= canvas.height - worm.radius) {
                    worm.directionY *= -1;
                }

                // Shrink radius
                if (worm.radius > 10) {
                    worm.radius -= 0.1;
                } else {
                    worm.stage = WORM_STAGE_3;
                }
                break;

            case WORM_STAGE_3:
                // Worm shrinks until it disappears and relocates
                if (worm.radius > 0) {
                    worm.radius -= 0.1;
                } else {
                    worm.stage = WORM_STAGE_4;
                }
                break;

            case WORM_STAGE_4:
                // Relocate worm to a random location on canvas
                worm.x = Math.random() * canvas.width;
                worm.y = Math.random() * canvas.height;
                worm.radius = 10; // Reset radius
                worm.directionX = Math.random() < 0.5 ? -1 : 1;
                worm.directionY = Math.random() < 0.5 ? -1 : 1;
                worm.stage = WORM_STAGE_1; // Restart life cycle
                break;
        }
    });
}
  
// Handle character movement
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
    if (event.key === ' ') handleCatch(); // Handle catch on space bar press
});

document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

function updateCharacterPosition() {
    if (keys['arrowup'] || keys['w']) character.y = Math.max(character.y - character.speed, character.height / 2);
    if (keys['arrowdown'] || keys['s']) character.y = Math.min(character.y + character.speed, canvas.height - character.height / 2);
    if (keys['arrowleft'] || keys['a']) {
        character.x = Math.max(character.x - character.speed, character.width / 2);
        character.direction = 'left';
    }
    if (keys['arrowright'] || keys['d']) {
        character.x = Math.min(character.x + character.speed, canvas.width - character.width / 2);
        character.direction = 'right';
    }
}

function handleCatch() {
    worms.forEach(worm => {
        if (worm.stage === WORM_STAGE_2 && !worm.caught) {
            // Calculate distance between character and worm
            const distance = Math.hypot(character.x - worm.x, character.y - worm.y);

            // Define the catch radius (adjust as needed)
            const catchRadius = character.width / 2 + worm.radius;

            // Check if character is within catch radius of the worm
            if (distance < catchRadius) {
                // If character caught the worm
                worm.caught = true; // Mark the worm as caught
                score++; // Increase the score
                document.getElementById('scoreDisplay').textContent = 'Score: ' + score; // Update score display
                catchSound.play(); // Play catch sound
                animateCatch(worm); // Animate catch effect (if desired)
            }
        }
    });
}

function animateCatch(worm) {
    const animationDuration = 500; // Duration of the catch animation in milliseconds
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = elapsedTime / animationDuration;

        // Interpolate position between worm and character
        const newX = (1 - progress) * worm.x + progress * character.x;
        const newY = (1 - progress) * worm.y + progress * character.y;

        // Draw worm at interpolated position
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        worms.forEach(w => {
            if (!w.caught) {
                drawWorm(w);
            }
        });
        drawCharacter();
        drawCaughtWorm(newX, newY, worm.radius); // Draw the caught worm at interpolated position

        if (elapsedTime < animationDuration) {
            requestAnimationFrame(animate);
        } else {
            // Animation finished, clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            worms.forEach(w => {
                if (!w.caught) {
                    drawWorm(w);
                }
            });
            drawCharacter();
        }
    }

    // Start the animation
    requestAnimationFrame(animate);
}

function drawCaughtWorm(x, y, radius) {
    // Draw the caught worm
    ctx.beginPath();
    ctx.fillStyle = '#deb887'; // Sand color
    ctx.arc(x, y, radius, 0, Math.PI, true);
    ctx.fill();
}

// Update timer
function updateTimer() {
    if (timerSeconds > 0) {
        timerSeconds--;
        document.getElementById('scoreDisplay').textContent = 'Time Left: ' + timerSeconds + 's | Score: ' + score;
    } else {
        gameOver();
    }
}

function gameOver() {
    isGameRunning = false;
    backgroundAudio.pause();
    gameOverSound.play();
    alert('Game Over! Your score is ' + score);
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    document.getElementById('startButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('pauseButton').textContent = 'Pause';
}

// Game controls
function startGame() {
    console.log('Game started');
    backgroundAudio.play();
    gameInterval = setInterval(() => {
        updateCharacterPosition();
        updateGameState();
        moveWorms();
        drawCharacter();
    }, 1000 / 30); // 30 FPS
    timerInterval = setInterval(updateTimer, 1000); // 1 second
    isGameRunning = true;
    isGamePaused = false;
    document.getElementById('startButton').disabled = true;
    document.getElementById('pauseButton').disabled = false;
}

function pauseGame() {
    if (isGameRunning && !isGamePaused) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        backgroundAudio.pause();
        pauseSound.play();
        isGamePaused = true;
        document.getElementById('pauseButton').textContent = 'Resume';
    } else if (isGameRunning && isGamePaused) {
        gameInterval = setInterval(() => {
            updateCharacterPosition();
            updateGameState();
            moveWorms();
        }, 1000 / 30); // 30 FPS
        timerInterval = setInterval(updateTimer, 1000); // 1 second
        backgroundAudio.play();
        isGamePaused = false;
        document.getElementById('pauseButton').textContent = 'Pause';
    }
}

function restartGame() {
    console.log('Game restarted');
    score = 0;
    timerSeconds = selectedTime; // Reset the timer to the selected time
    worms.forEach(worm => {
        worm.caught = false;
        worm.visible = false;
        worm.stage = WORM_STAGE_1; // Reset worm stage
        worm.radius = 10; // Reset worm radius
        worm.speed = Math.random() * 2 + 1; // Reset worm speed
        worm.directionX = Math.random() < 0.5 ? -1 : 1; // Reset worm direction X
        worm.directionY = Math.random() < 0.5 ? -1 : 1; // Reset worm direction Y
    });
    document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startGame();
}

// Event listeners for time selection buttons
document.querySelectorAll('.timeButton').forEach(button => {
    button.addEventListener('click', handleTimeSelection);
});

document.getElementById('startButton').addEventListener('click', () => {
    if (!isGameRunning) {
        startGame();
    }
});

document.getElementById('pauseButton').addEventListener('click', () => {
    if (isGameRunning) {
        pauseGame();
    }
});

document.getElementById('restartButton').addEventListener('click', restartGame);

document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
    if (event.key === ' ') handleCatch(); // Handle catch on space bar press
});