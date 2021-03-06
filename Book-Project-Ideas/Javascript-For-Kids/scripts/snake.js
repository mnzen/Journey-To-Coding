// Defines the Canvas
var canvas = document.querySelector("#canvas"),
  ctx = canvas.getContext("2d"),
  // Gets the width and height of canvas
  width = canvas.width,
  height = canvas.height,
  // Width and Height in Blocks
  blockSize = 10,
  widthInBlocks = width / blockSize,
  heightInBlocks = height / blockSize,
  // Sets Score to 0
  score = 0;
// Creates a border around the game
var drawBorder = () => {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
  },
  // Updates the Score
  drawScore = () => {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
  },
  // Ends the game if player loses
  gameOver = () => {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
  },
  // Draw a circle (Apple)
  circle = (x, y, radius, fillCircle) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };
// Block Constructor
const Block = function(col, row) {
  this.col = col;
  this.row = row;
};
// Snake Constructor
const Snake = function() {
  this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
  this.direction = "right";
  this.nextDirection = "right";
};
// Apple Constuctor
const Apple = function() {
  this.position = new Block(10, 10);
};
// Draw Square Method
Block.prototype.drawSquare = function(color) {
  var x = this.col * blockSize,
    y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};
// Draw Circle Method
Block.prototype.drawCircle = function(color) {
  var centerX = this.col * blockSize + blockSize / 2,
    centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};
// Equal Method
Block.prototype.equal = function(otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};
// Drawing a square for each segment of snakes body
Snake.prototype.draw = function() {
  for (var i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare("Purple");
  }
};
// Creates a new head and adds to beginning of snake
Snake.prototype.move = function() {
  var head = this.segments[0],
    newHead;
  this.direction = this.nextDirection;
  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }
  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }
  this.segments.unshift(newHead);
  if (newHead.equal(apple.position)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};
// Check Collision Method
Snake.prototype.checkCollision = function(head) {
  var leftCollision = head.col === 0,
    topCollision = head.row === 0,
    rightCollision = head.col === widthInBlocks - 1,
    bottomCollision = head.col === heightInBlocks - 1;
  var wallCollision =
    leftCollision || topCollision || rightCollision || bottomCollision;
  var selfCollision = false;
  for (var i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }
  return wallCollision || selfCollision;
};
//Set Direction Method
Snake.prototype.setDirection = function(newDirection) {
  if (this.direction === "up" && newDirection === "down") {
    return;
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  } else if (this.direction === "down" && newDirection === "up") {
    return;
  } else if (this.direction === "left" && newDirection === "right") {
    return;
  }
  this.nextDirection = newDirection;
};
// Drawing the apple
Apple.prototype.draw = function() {
  this.position.drawCircle("Red");
};
// Moving the apple to a random location
Apple.prototype.move = function() {
  var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1,
    randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
  this.position = new Block(randomCol, randomRow);
};
// Create the snake and apple objects
var snake = new Snake(),
  apple = new Apple();
// Pass animation function on Interval
var intervalId = setInterval(function() {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
}, 100);
// Coverts Key Codes to words
var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};
// Function to lisen for Key Presses
window.addEventListener("keydown",function(e){
  console.log(e.keyCode);
    var newDirection = directions[e.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});
