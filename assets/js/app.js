// Global variables
var isGameOn = 0;
var fireAgain = 0;
// TO DO
var level = 1;
var lives = 0;
var points = 0;

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
  lives = 5;
  const livesParagraph = document.createElement('p');
  livesParagraph.innerHTML = 'Lives: ';
  document.querySelector('.lives').appendChild(livesParagraph);
  for (let i = 0; i < lives; i++) {
    const life = document.createElement('div');
    life.className = 'life';
    document.querySelector('.lives').appendChild(life);
  };
  fireSquare();
};


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
      fireAgain = 1;
      console.log(points);
    }
};

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


// Function that initialises the square and its initial position coordinates, direction, and speed, and displays it
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

  // If the square starts in the left hand side of the screen, direction right, else direction left
  startPosX <= (0.5 * viewportWidth) ? directionX = Math.random() : directionX = -Math.random();

  // If the square starts in the top side of the screen, direction down, else direction up
  startPosY <= (0.5 * viewportHeight) ? directionY = Math.random() : directionY = -Math.random();

  // Normalize the direction vector
  var magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
  directionX /= magnitude;
  directionY /= magnitude;

  // Initialise square's speed variable
  var squareSpeed = 2;

  var animationParameters = {directionX:directionX, directionY:directionY, speed:squareSpeed};

  animateSquare(animationParameters);
};

// Animate the square
function animateSquare(animationParameters) {
  square = document.getElementById('square');
  var currentPosX = parseFloat(square.style.left); // Get the current left position of the square element as a floating-point number
  var currentPosY = parseFloat(square.style.top); // Get the current top position of the square element as a floating-point number

  // Update the square's position
  var newPosX = currentPosX + animationParameters.directionX * animationParameters.speed; // Calculate the new left position by adding the direction multiplied by squareSpeed to the current left position
  var newPosY = currentPosY + animationParameters.directionY * animationParameters.speed; // Calculate the new top position by adding the direction multiplied by squareSpeed to the current top position
  square.style.left = newPosX + 'px'; // Set the left position of the square element to the new left position
  square.style.top = newPosY + 'px'; // Set the top position of the square element to the new top position

  // Check if the square is still within the viewport
  if (
    newPosX < 0 ||
    newPosX + square.offsetWidth > viewportWidth || // Check if the right edge of the square is outside the viewport width
    newPosY < 0 ||
    newPosY + square.offsetHeight > viewportHeight // Check if the bottom edge of the square is outside the viewport height
    || fireAgain === 1
  ) {
    // If the square is out of bounds, remove it from the page
    document.body.removeChild(square);
    // after removing the out of bounds square, check if the game is still going. If so, fire off a new square
    if (isGameOn === 1) {
      fireSquare();
    }
  } else {
    // Otherwise, continue animating
    requestAnimationFrame(() => animateSquare(animationParameters));
  }
}

