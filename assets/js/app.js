// Global variables
const square = document.createElement('div');
square.id = 'square';
var isGameOn = 0;
var fireAgain = false;
var level = 1;
var lives = 0;
var points = 0;
var squareSpeed = 4;


// Calculate the left and right boundaries of the page
var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
var heightBoundary = Math.floor(viewportHeight * 0.1); // 10% of viewport height

// Grid element
var grid = document.getElementById('grid');
var gridWidth = grid.offsetWidth; // in px
var gridHeight = grid.offsetHeight; // in px

// Grid's top left corner coordinates
var gridTopLeftX = (viewportWidth - gridWidth) / 2;
var gridTopLeftY = (viewportHeight - gridHeight) / 2;

// Grid's edges
var gridLeftBorder = gridTopLeftX;
var gridTopBorder = gridTopLeftY;
var gridRightBorder = gridTopLeftX + gridWidth;
var gridBottomBorder = gridTopLeftY + gridHeight;

// console.log('viewportHeight: ' + viewportHeight);
// console.log('viewportWidth: ' + viewportWidth);
// console.log('gridLeft: ' + gridLeftBorder);
// console.log('gridTop: ' + gridTopBorder);
// console.log('gridRight: ' + gridRightBorder);
// console.log('gridBottom: ' + gridBottomBorder);


// Display edges - FOR TESTING PURPOSES ONLY
// test2 = document.createElement('div')
// test2.style.width = gridWidth + 'px';
// test2.style.height = gridHeight + 'px';
// test2.style.border = '1px solid black';
// grid.appendChild(test2);
// console.log(test2.offsetWidth);
// console.log(test2.offsetHeight);


// Resize grid and viewport variables upon resizing of the screen
window.addEventListener('resize', () => {
  // Calculate the left and right boundaries of the page
  viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  heightBoundary = Math.floor(viewportHeight * 0.1); // 10% of viewport height

  // Grid element
  grid = document.getElementById('grid');
  gridWidth = grid.offsetWidth; // in px
  gridHeight = grid.offsetHeight; // in px

  // Grid's top left corner coordinates
  gridTopLeftX = (viewportWidth - gridWidth) / 2;
  gridTopLeftY = (viewportHeight - gridHeight) / 2;

  // Grid's edges
  gridLeftBorder = gridTopLeftX;
  gridTopBorder = gridTopLeftY;
  gridRightBorder = gridTopLeftX + gridWidth;
  gridBottomBorder = gridTopLeftY + gridHeight;

  // Display edges - FOR TESTING PURPOSES ONLY
  grid.removeChild(test2)
  test2 = document.createElement('div')
  test2.style.width = gridWidth + 'px';
  test2.style.height = gridHeight + 'px';
  test2.style.border = '1px solid black';
  grid.appendChild(test2);

})


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
  // Instructions
  document.querySelector('#instructions').innerHTML = "Destroy the little squares by clicking on them while they're within the boundaries of the grid.<br>Don't let any escape!";
  // Grid
  grid.style.width = '40vh';
  grid.style.height = '40vh';
  // Global variables
  isGameOn = 1;
  fireAgain = false;
  level = 1;
  lives = 5;
  points = 0;
  squareSpeed = 4;
  // Title
  document.querySelector('.title').style.color = '#e65252';
  // Containers
  const livesContainer = document.querySelector('.lives');
  const scoreContainer = document.querySelector('.score');
  const levelContainer = document.querySelector('.level');
  // Lives
  livesContainer.innerHTML = 'Lives: ';
  livesContainer.style.display = 'flex';
  for (let i = 0; i < lives; i++) { // append X number of life squares
    const life = document.createElement('div');
    life.className = 'life';
    livesContainer.appendChild(life);
  };
  // Score
  scoreContainer.innerHTML = 'Score: ' + points;
  scoreContainer.style.display = 'flex';
  // Level
  levelContainer.innerHTML = 'Level: ' + level;
  levelContainer.style.display = 'flex';

  fireSquare();
};


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
  document.querySelector('.title').style.color = 'rgb(118, 118, 118)';
};


// When the user clicks the square while it's within bounds, score a point, remove the square and fire off another
function scorePoint() {
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
      fireAgain = true;
    };
  levelUp();
};


// Level up based on points
function levelUp() {
  if (points % 5 === 0) {
    level += 1;
    squareSpeed +=1;
    document.querySelector('.level').innerHTML = 'Level: ' + level;
  }
};


// Lose a life if you miss a square and check if game over
function loseLife() {

  console.log(square.style.left);
  console.log(square.style.top);

  lives -= 1;
  document.querySelector('.lives').removeChild(document.querySelector('.lives').lastChild);
  document.body.removeChild(square);
  if (lives === 0) {
    isGameOn = 0;
    endGame();
  }
};


// Function that initialises the square and its initial position coordinates and direction, and displays it
function fireSquare() {
  fireAgain = false;
  // Style the square
  // square.style.borderRadius = '20%';
  // square.style.width = '2vw'; // Set the width of the square element to 2% of the viewport width
  // square.style.height = '2vw'; // Set the height of the square element to 2% of the viewport width
  // square.style.zIndex = '1'; // Set the z-index of the square element
  // square.style.backgroundColor = '#e65252'; // Set the background color of the square element to red
  // square.style.position = 'absolute'; // Set the position of the square element to absolute

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
  //square = document.getElementById('square');
  var currentPosX = parseFloat(square.style.left); // Get the current left position of the square element as a floating-point number
  var currentPosY = parseFloat(square.style.top); // Get the current top position of the square element as a floating-point number

  // Update the square's position
  var newPosX = currentPosX + animationParameters.directionX * squareSpeed; // Calculate the new left position by adding the direction multiplied by squareSpeed to the current left position
  var newPosY = currentPosY + animationParameters.directionY * squareSpeed; // Calculate the new top position by adding the direction multiplied by squareSpeed to the current top position
  square.style.left = newPosX + 'px'; // Set the left position of the square element to the new left position
  square.style.top = newPosY + 'px'; // Set the top position of the square element to the new top position

  if (fireAgain) {
    document.body.removeChild(square);
    fireSquare();
  } else if (
    square &&
    (newPosX < 0 ||
    newPosX + square.offsetWidth > viewportWidth || // Check if the right edge of the square is outside the viewport width
    newPosY < 0 ||
    newPosY + square.offsetHeight > viewportHeight) // Check if the bottom edge of the square is outside the viewport height
    ) {
      loseLife();
      if (isGameOn === 1) {
        fireSquare();
      };
    } else {
      requestAnimationFrame(() => animateSquare(animationParameters));
    };
  };

