/**
 * A container for the graphics in the pong game.
 */
// =============================================================================
// VARIABLES
// =============================================================================    
var leftPaddleGraphic;
var rightPaddleGraphic;
var topWallGraphic;
var bottomWallGraphic;
var ballGraphic;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================    
function Court () {
    // Create graphics
    leftPaddleGraphic = new Rectangle(Settings.PADDLE_WIDTH, Settings.PADDLE_HEIGHT, 0xFFFFFF);
    rightPaddleGraphic = new Rectangle(Settings.PADDLE_WIDTH, Settings.PADDLE_HEIGHT, 0xFFFFFF);
    ballGraphic = new Rectangle(Settings.BALL_SIZE, Settings.BALL_SIZE, 0xFFFFFF);
    topWallGraphic = new Rectangle(Settings.COURT_WIDTH, Settings.WALL_HEIGHT, 0xFFFFFF);
    bottomWallGraphic = new Rectangle(Settings.COURT_WIDTH, Settings.WALL_HEIGHT, 0xFFFFFF);
    bottomWallGraphic.y = Settings.COURT_HEIGHT - Settings.WALL_HEIGHT;
      
    // Add wall graphics to the stage
    addChild(topWallGraphic);
    addChild(bottomWallGraphic);
}
    
function setBallPosition (x, y) {
    ballGraphic.x = x;
    ballGraphic.y = y;
}

function setLeftPaddlePosition (x, y) {
    leftPaddleGraphic.x = x;
    leftPaddleGraphic.y = y;
}

function setRightPaddlePosition (x, y) {
    rightPaddleGraphic.x = x;
    rightPaddleGraphic.y = y;
}
    
function showBall () {
    addChild(ballGraphic);
}
    
function hideBall () {
    if (contains(ballGraphic)) {
        removeChild(ballGraphic);
    }
}
    
function showLeftPaddle () {
    addChild(leftPaddleGraphic);
}
    
function hideLeftPaddle () {
    if (contains(leftPaddleGraphic)) {
        removeChild(leftPaddleGraphic);
    }
}
    
function showRightPaddle () {
    addChild(rightPaddleGraphic);
}
    
function hideRightPaddle () {
    if (contains(rightPaddleGraphic)) {
        removeChild(rightPaddleGraphic);
    }
}











