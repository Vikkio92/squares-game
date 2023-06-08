// Global variables
var isGameOn = 0;
var fireAgain = 0;
// TO DO
var level = 1;
var lives = 0;
var points = 0;
var squareSpeed = 4;


// Initialise button to start the game
const startButton = document.getElementById('button-start');

// When start button is pressed, the game starts
startButton.addEventListener('click', () => {
  // Hide the startButton
  startButton.style.display = "none";
  // Initialise game
  startGame();
});


// Initialise game
function startGame() {
  isGameOn = 1;
  level = 1;
  lives = 2;
  const livesContainer = document.querySelector('.lives');
  const scoreContainer = document.querySelector('.score');
  const levelContainer = document.querySelector('.level');
  // Lives
  livesContainer.innerHTML = 'Lives: ';
  //livesContainer.appendChild(livesParagraph); // append new paragraph to container
  for (let i = 0; i < lives; i++) { // append X number of life squares
    const life = document.createElement('div');
    life.className = 'life';
    livesContainer.appendChild(life);
  };
  livesContainer.style.cssText  = 'display: flex; justify-content: center; font-size: 1vw; z-index: inherit;';
  // Score
  scoreContainer.innerHTML = 'Score: ' + points;
  scoreContainer.style.cssText  = 'display: flex; justify-content: center; font-size: 1vw; z-index: inherit;';
  // Level
  levelContainer.innerHTML = 'Level: ' + level;
  levelContainer.style.cssText  = 'display: flex; justify-content: center; font-size: 1vw; z-index: inherit;';

  fireSquare();
};


// TO DO
// End the game when lives reach zero
function endGame() {
  document.querySelector('#instructions').innerHTML = 'Game over! Play again?';
  document.querySelector('.lives').style.display = 'none';
  document.querySelector('.score').style.display = 'none';
  document.querySelector('.level').style.display = 'none';
  const startButton = document.getElementById('button-start');
  startButton.style.display  = 'block';
  startButton.style.position = 'absolute';
  startButton.style.left = '50%';
  startButton.style.transform = 'translateX(-50%)';
}


// When the user clicks the square while it's within bounds, score a point, remove the square and fire off another
function scorePoint() {
  var square = document.querySelector('#square');
  var squareLeft = parseInt(square.style.left);
  var squareTop = parseInt(square.style.top);
  if (
    squareLeft <= gridRightBorder &&
    squareLeft >= gridLeftBorder &&
    squareTop >= gridTopBorder &&
    squareTop <= gridBottomBorder
    ) {
      points += 1;
      document.querySelector('.score').innerHTML = 'Score: ' + points;
      fireAgain = 1;
    }
  updateLevel();
};


// Update level based on points
function updateLevel() {
  if (points % 5 === 0) {
    level += 1;
    document.querySelector('.level').innerHTML = 'Level: ' + level;
  }
}


// Lose a life if you miss a square and check if game over
function loseLife() {
  lives -= 1;
  document.querySelector('.lives').removeChild(document.querySelector('.lives').lastChild);
  if (lives === 0) {
    isGameOn = 0;
    endGame();
  }
}


// Calculate the left and right boundaries of the page
var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
var heightBoundary = Math.floor(viewportHeight * 0.1); // 10% of viewport height

// Grid element
var grid = document.getElementById('grid');
var gridWidth = grid.offsetWidth;
var gridHeight = grid.offsetHeight;

// Grid's top left corner coordinates
var gridTopLeftX = (viewportWidth - gridWidth) / 2;
var gridTopLeftY = (viewportHeight - gridHeight) / 2;

// Grid's edges
var gridLeftBorder = gridTopLeftX;
var gridTopBorder = gridTopLeftY;
var gridRightBorder = gridTopLeftX + viewportWidth;
var gridBottomBorder = gridTopLeftY + viewportHeight;


// Function that initialises the square and its initial position coordinates and direction, and displays it
function fireSquare() {
  fireAgain = 0;
  // Create a colored square element
  var square = document.createElement('div');
  square.style.borderRadius = '20%';
  square.style.width = '2vw'; // Set the width of the square element to 2% of the viewport width
  square.style.height = '2vw'; // Set the height of the square element to 2% of the viewport width
  square.style.zIndex = '1'; // Set the z-index of the square element
  square.style.backgroundColor = 'red'; // Set the background color of the square element to red
  square.style.position = 'absolute'; // Set the position of the square element to absolute

  // Initalise position variables
  var startPosX;
  var startPosY;

  // starting position X can fluctuate anywhere between 0% and 100% of the screen width
  startPosX = Math.floor(Math.random() * viewportWidth);

  // If starting position X > 10% and < 90% of screen width, then Y must be < 10% or > 90% of screen height
  if (startPosX > 0.1 * viewportWidth && startPosX < 0.9 * viewportWidth) {
    startPosY = (Math.floor(Math.random() * heightBoundary) + (Math.random() < 0.5) * 0.9 * viewportHeight)
  } else {
    startPosY = Math.floor(Math.random() * viewportHeight)
  };

  // Set initial X and Y position for the square to be spawned
  square.style.left = startPosX + 'px'; // Set the left position of the square element to the random x-coordinate
  square.style.top = startPosY + 'px'; // Set the top position of the square element to the random y-coordinate

  // Add the square element to the page
  document.body.appendChild(square);
  square.id = "square"
  square.addEventListener('click', scorePoint); // If the square is clicked while within the grid's bounds, score a point

  // Initialise direction variables
  var directionX;
  var directionY;

  // Set target at the center of the screen
  var targetX = document.documentElement.clientWidth * 0.5;
  var targetY = document.documentElement.clientHeight * 0.5;

  // Calculate the X and Y distance between the starting point of the square and the center of the screen
  var deltaX = targetX - startPosX;
  var deltaY = targetY - startPosY;

  // Calculate the angle between the point where the square has spawned and the center of the screen
  var angle = Math.atan2(deltaY, deltaX);

  // Calculate the direction
  var directionX = Math.cos(angle) + Math.random() * 0.3 - 0.2; // add a random value between -0.2 and 0.2
  var directionY = Math.sin(angle) + Math.random() * 0.3 - 0.2;

  // Normalize the direction vector
  var magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
  directionX /= magnitude;
  directionY /= magnitude;

  // direction parameters for animation
  var animationParameters = {directionX:directionX, directionY:directionY};

  animateSquare(animationParameters);
};

// Animate the square
function animateSquare(animationParameters) {
  square = document.getElementById('square');
  var currentPosX = parseFloat(square.style.left); // Get the current left position of the square element as a floating-point number
  var currentPosY = parseFloat(square.style.top); // Get the current top position of the square element as a floating-point number

  // Update the square's position
  var newPosX = currentPosX + animationParameters.directionX * squareSpeed; // Calculate the new left position by adding the direction multiplied by squareSpeed to the current left position
  var newPosY = currentPosY + animationParameters.directionY * squareSpeed; // Calculate the new top position by adding the direction multiplied by squareSpeed to the current top position
  square.style.left = newPosX + 'px'; // Set the left position of the square element to the new left position
  square.style.top = newPosY + 'px'; // Set the top position of the square element to the new top position

  // Check if the square is still within the viewport
  if (
    square &&
    (newPosX < 0 ||
    newPosX + square.offsetWidth > viewportWidth || // Check if the right edge of the square is outside the viewport width
    newPosY < 0 ||
    newPosY + square.offsetHeight > viewportHeight) // Check if the bottom edge of the square is outside the viewport height
  ) {
    // If the square is out of bounds, remove it from the page and lose a life
    document.body.removeChild(square);
    loseLife();
    // after removing the out of bounds square, check if the game is still going. If so, fire off a new square
    if (isGameOn === 1) {
      fireSquare();
    }
  } else if (fireAgain === 1) {
    document.body.removeChild(square);
    fireSquare();
  } else {
    // Otherwise, continue animating
    requestAnimationFrame(() => animateSquare(animationParameters));
  }
}

