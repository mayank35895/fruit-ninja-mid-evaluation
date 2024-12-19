const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
canvas.width = 1196;
canvas.height = 735;
let fruits = [];
let isSlicing = false;
let mouseX, mouseY;
const fruitTypes = ['apple', 'banana', 'pineapple', 'litchi'];
const fruitImages = {
    apple: new Image(),
    banana: new Image(),
    pineapple: new Image(),
    litchi: new Image()
};

//fruit images
fruitImages.apple.src = 'apple.png';
fruitImages.banana.src = 'banana.png';
fruitImages.pineapple.src = 'pineapple.png';
fruitImages.litchi.src = 'litchi.png';

// Fruit class
class Fruit {
    constructor() {
        this.type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
        this.image = fruitImages[this.type];
        this.x = Math.random() * canvas.width;//x axis position
        this.y = canvas.height;
        this.speed_Y = -Math.random() * 1.8 -2.5; 
        this.speed_X = Math.random() * 3 - 1.5;
        this.size = 100 + Math.random() * 30;
        this.hit = false;
        this.upwardDistance = 0;
    }

    update() {
        if (!this.hit) {
            // fruit is moveing only 75 % of height
            if (this.upwardDistance < canvas.height * 0.75) {
                this.y += this.speed_Y;
                this.upwardDistance += Math.abs(this.speed_Y);
            } else {//after moving 75% of heoght now moves downward
                this.speed_Y = Math.abs(this.speed_Y);
                this.y += this.speed_Y;
            }//moves fruit in x direction
            this.x += this.speed_X;
            //restricted boundaries condition
            if (this.x < 0 || this.x > canvas.width) {
                this.speed_X = -this.speed_X;
            }
        }

        const imageWidth = this.size;
        const imageHeight = this.size;
        ctx.drawImage(this.image, this.x - imageWidth / 2, this.y - imageHeight / 2, imageWidth, imageHeight);
    }
}

function generateFruits() {
    if (Math.random() < 0.02) { //random no. of fruit with condition
        fruits.push(new Fruit());
    }
}
// Knife settings
let knifeWidth = 60, knifeHeight = 20;
//draw knife in triangular shape
function drawKnife() {
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(mouseX - knifeWidth / 2, mouseY - knifeHeight / 2);
    ctx.lineTo(mouseX + knifeWidth / 2, mouseY - knifeHeight / 2); 
    ctx.lineTo(mouseX, mouseY + knifeHeight / 2); // Create a triangle (<> shape)
    ctx.closePath();
    ctx.fill();
}
//funtion for slice detection
function detectSlice() {
    fruits.forEach((fruit, index) => {
        const distance = Math.sqrt(
            (mouseX - fruit.x) ** 2 + (mouseY - fruit.y) ** 2
        );

        if (
            distance <= fruit.size / 2 &&
            !fruit.hit
        ) {
            fruit.hit = true;
            score += 1;
            fruits.splice(index, 1);
        }
    });
}

function gameOver() {
    if (lives <= 0) {
        alert("Game Over! Your Score: " + score);
        resetGame();
    }
}

function resetGame() {
    score = 0;
    lives = 3;
    fruits = [];
    isSlicing = false;
    document.getElementById('score').textContent = "Score: 0";
    document.getElementById('lives').textContent = "Lives: 3";
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateFruits();
    fruits.forEach(fruit => fruit.update());
    drawKnife();
    detectSlice();

    document.getElementById('score').textContent = "Score: " + score;
    document.getElementById('lives').textContent = "Lives: " + lives;

    fruits.forEach((fruit, index) => {
        if (fruit.y > canvas.height) {
            lives--;
            fruits.splice(index, 1);
        }
    });

    gameOver();
    requestAnimationFrame(gameLoop);
}

// Event listeners for mouse and restart button
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

canvas.addEventListener("mousedown", () => {
    isSlicing = true;
});

canvas.addEventListener("mouseup", () => {
    isSlicing = false;
});

document.getElementById("restartButton").addEventListener("click", resetGame);

// Start the game loop
gameLoop();