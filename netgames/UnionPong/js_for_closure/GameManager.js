/**
 * Manages game flow logic and physics simulation.
 */
// =============================================================================
// VARIABLES
// =============================================================================
// Playing-field simulation objects
var leftPlayer;
var rightPlayer;
var ball;
    
// Dependencies
var room;
var court;
var hud;
    
// Game tick
var lastUpdate;
var updateTimer;
    
// Current game state
var state;
    
// Join-game timer (used when the game is full)
var joinTimer;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================
function GameManager (court, hud) {
    this.court = court;
    this.hud = hud;
      
    // Make the simulated ball
    ball = new PongObject();
    ball.width = Settings.BALL_SIZE;
      
    // Make the game-tick timer
    updateTimer = new Timer(Settings.GAME_UPDATE_INTERVAL);
    updateTimer.addEventListener(TimerEvent.TIMER, timerListener);
    updateTimer.start();
      
    // Make the join-game timer
    joinTimer = new Timer(5000, 1);
    joinTimer.addEventListener(TimerEvent.TIMER, joinTimerListener);
}
    
// =============================================================================
// DEPENDENCIES
// =============================================================================
    
// Supplies this game manager with a Room object representing the 
// server-side pong game room
function setRoom (room) {
    // Remove event listeners and message listeners from the old 
    // Room object (if there is one)
    if (this.room != null) {
        removeRoomListeners();
    }
    // Store the room reference
    this.room = room;
    // Add event listeners and message listeners to the supplied Room object
    if (room != null) {
        addRoomListeners();
    }
    // Join the game
    room.join();
    // Display status on screen
    hud.setStatus("Joining game...");
}
    
function addRoomListeners () {
    room.addEventListener(RoomEvent.JOIN, roomJoinListener);
    room.addEventListener(RoomEvent.JOIN_RESULT, roomJoinResultListener);
    room.addEventListener(AttributeEvent.UPDATE, roomAttributeUpdateListener);
    room.addEventListener(RoomEvent.UPDATE_CLIENT_ATTRIBUTE, clientAttributeUpdateListener);
    room.addEventListener(RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);
      
    room.addMessageListener(RoomMessages.START_GAME, startGameListener);
    room.addMessageListener(RoomMessages.STOP_GAME, stopGameListener);
}
    
function removeRoomListeners () {
    room.removeEventListener(RoomEvent.JOIN, roomJoinListener);
    room.removeEventListener(RoomEvent.JOIN_RESULT, roomJoinResultListener);
    room.removeEventListener(AttributeEvent.UPDATE, roomAttributeUpdateListener);
    room.removeEventListener(RoomEvent.UPDATE_CLIENT_ATTRIBUTE, clientAttributeUpdateListener);
    room.removeEventListener(RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);
      
    room.removeMessageListener(RoomMessages.START_GAME, startGameListener);
    room.removeMessageListener(RoomMessages.STOP_GAME, stopGameListener);
}

// =============================================================================
// ROOM EVENT LISTENERS
// =============================================================================
    
// Triggered when the current client successfully joins the game room
function roomJoinListener (e) {
    state = GameStates.WAITING_FOR_OPPONENT;
    hud.setStatus("Waiting for opponent...");
    initPlayers();
}
    
// Triggered when the server reports the result of an attempt
// to join the game room
function roomJoinResultListener (e) {
    // If there are already two people playing, wait 5 seconds, then
    // attempt to join the game again (hoping that someone has left)
    if (e.getStatus() == Status.ROOM_FULL) {
        hud.setStatus("Game full. Next join attempt in 5 seconds.");
        joinTimer.start();
    }
}
    
// Triggered when one of the room's attributes changes. This method
// handles ball and score updates sent by the server.
function roomAttributeUpdateListener (e) {
    var scores;
      
    switch (e.getChangedAttr().name) {
        // When the "ball" attribute changes, synchronize the ball
    case RoomAttributes.BALL:
	deserializeBall(e.getChangedAttr().value);
	break;
        
        // When the "score" attribute changes, update player scores
    case RoomAttributes.SCORE:
	scores = e.getChangedAttr().value.split(",");
	hud.setLeftPlayerScore(scores[0]);
	hud.setRightPlayerScore(scores[1]);
	break;
    }
}
    
// Triggered when a room occupant's attribute changes. This method
// handles changes in player status.
function clientAttributeUpdateListener (e) {
    // If the client is now ready (i.e., the "status" attribute's value is
    // now "ready"), add the client to the game simulation
    if (e.getChangedAttr().name == ClientAttributes.STATUS
	&& e.getChangedAttr().scope == Settings.GAME_ROOMID
	&& e.getChangedAttr().value == PongClient.STATUS_READY) {
        addPlayer(PongClient(e.getClient()));
    }
}
    
// Triggered when a client leaves the room. This method responds to players 
// leaving the game.
function removeOccupantListener (e) {
    state = GameStates.WAITING_FOR_OPPONENT;
    hud.setStatus("Opponent left the game");
    removePlayer(PongClient(e.getClient()));
}

// =============================================================================
// ROOM MESSAGE LISTENERS
// =============================================================================
    
// Triggered when the server sends a START_GAME message
function startGameListener (fromClient) {
    lastUpdate = getTimer();
    hud.setStatus("");
    resetBall();
    court.showBall();
    hud.resetScores();
    state = GameStates.IN_GAME;
}
    
// Triggered when the server sends a STOP_GAME message
function stopGameListener (fromClient) {
    court.hideBall();
}

// =============================================================================
// JOIN-GAME TIMER LISTENER
// =============================================================================
    
// Triggered every five seconds when the game room is full
function joinTimerListener (e) {
    hud.setStatus("Joining game...");
    room.join();
}
    
// =============================================================================
// GAME TICK
// =============================================================================
    
// Triggered every 20 milliseconds. Updates the playing-field simulation.
function timerListener (e) {
    var now = getTimer();
    var elapsed = now - lastUpdate;
    lastUpdate = now;
      
    // If the game is not in progress, update the players only
    var s = getTimer();
    switch (state) {
    case GameStates.WAITING_FOR_OPPONENT:
	updatePlayer(leftPlayer, elapsed);
	updatePlayer(rightPlayer, elapsed);
	break;

        // If the game is in progress, update the players and the ball
    case GameStates.IN_GAME:
	updatePlayer(leftPlayer, elapsed);
	updatePlayer(rightPlayer, elapsed);
	updateBall(elapsed);
	break;
    }
}
    
// =============================================================================
// PLAYER MANAGEMENT
// =============================================================================
    
// Adds all "ready" players to the game simulation. Invoked when the 
// current client joins the game room.
function initPlayers () {
    for (player in room.getOccupants()) {
	    if (player.getAttribute(ClientAttributes.STATUS, Settings.GAME_ROOMID)
		== PongClient.STATUS_READY) {
		addPlayer(player);
	    }
	}
}
    
// Adds a new "ready" player to the game simulation. Invoked when a foreign
// client becomes ready after the current client is already in the game room.
function addPlayer (player) {
    if (player.getSide() == PongClient.SIDE_LEFT) {
        leftPlayer = player;
        court.setLeftPaddlePosition(player.getPaddle().x, player.getPaddle().y);
        court.showLeftPaddle();
    } else if (player.getSide() == PongClient.SIDE_RIGHT) {
        rightPlayer = player;
        court.setRightPaddlePosition(player.getPaddle().x, player.getPaddle().y);
        court.showRightPaddle();
    }
}
    
// Removes a player from the game simulation. Invoked whenever a client
// leaves the game room.
function removePlayer (player) {
    if (player.getSide() == PongClient.SIDE_LEFT) {
        leftPlayer = null;
        court.hideLeftPaddle();
    } else if (player.getSide() == PongClient.SIDE_RIGHT) {
        rightPlayer = null;
        court.hideRightPaddle();
    }
}
    
// =============================================================================
// WORLD SIMULATION/PHYSICS
// =============================================================================
    
// Places the ball in the middle of the court
function resetBall () {
    ball.x = Settings.COURT_WIDTH/2 - Settings.BALL_SIZE/2;
    ball.y = Settings.COURT_HEIGHT/2 - Settings.BALL_SIZE/2;
    ball.speed = 0;
    court.setBallPosition(ball.x, ball.y);
}
    
// Updates the specified player's paddle position based on its most recent
// known speed and direction
function updatePlayer (player, elapsed) {
    var newPaddleY;
    if (player != null) {
        // Calculate new paddle position
        newPaddleY = player.getPaddle().y 
	    + Math.sin(-player.getPaddle().direction)
	    * player.getPaddle().speed * elapsed/1000;
          
        player.getPaddle().y = clamp(newPaddleY, 
				     0 + Settings.WALL_HEIGHT, 
				     Settings.COURT_HEIGHT - Settings.PADDLE_HEIGHT - Settings.WALL_HEIGHT);
        
        // Reposition appropriate paddle graphic
        if (player.getSide() == PongClient.SIDE_LEFT) {
	    court.setLeftPaddlePosition(0, player.getPaddle().y);
        } else if (player.getSide() == PongClient.SIDE_RIGHT) {
	    court.setRightPaddlePosition(Settings.COURT_WIDTH - Settings.PADDLE_WIDTH,
					 player.getPaddle().y);
        }
    }
}
    
// Updates the ball's paddle position based on its most recent
// known speed and direction
function updateBall (elapsed) {
    // Calculate the position the ball would be in if there were 
    // no walls and no paddles
    var ballX = ball.x + Math.cos(ball.direction)*ball.speed*elapsed/1000;
    var ballY = ball.y - Math.sin(ball.direction)*ball.speed*elapsed/1000;
    ball.x = ballX;
    ball.y = ballY;
      
    // Adjust the ball's position if it hits a paddle this tick
    if (ballX < Settings.PADDLE_WIDTH) {
        if (ballY + Settings.BALL_SIZE > leftPlayer.getPaddle().y 
            && ballY < (leftPlayer.getPaddle().y + Settings.PADDLE_HEIGHT)) {
	    ball.x = 2*Settings.PADDLE_WIDTH - ballX;
	    bounceBall(ball.direction >  Math.PI ? 3*Math.PI/2 :  Math.PI/2);
	    ball.speed += Settings.BALL_SPEEDUP;
        }
    } else if (ballX > (Settings.COURT_WIDTH-Settings.PADDLE_WIDTH-Settings.BALL_SIZE)) {
        if (ballY + Settings.BALL_SIZE > rightPlayer.getPaddle().y 
            && ballY < (rightPlayer.getPaddle().y + Settings.PADDLE_HEIGHT)) {
	    ball.x = 2*(Settings.COURT_WIDTH - Settings.PADDLE_WIDTH - Settings.BALL_SIZE) - ballX;
	    bounceBall(ball.direction >  3*Math.PI/2 ?  3*Math.PI/2 :  Math.PI/2);
	    ball.speed += Settings.BALL_SPEEDUP;
        } 
    }
      
    // Adjust the ball's position if it hits a wall this tick
    if (ballY < Settings.WALL_HEIGHT) {
        ball.y = 2*Settings.WALL_HEIGHT-ballY;
        bounceBall(ball.direction > Math.PI/2 ? Math.PI : 2*Math.PI);
    } else if (ballY + Settings.BALL_SIZE > Settings.COURT_HEIGHT - Settings.WALL_HEIGHT) {
        ball.y = 2*(Settings.COURT_HEIGHT-Settings.WALL_HEIGHT-Settings.BALL_SIZE)-ballY;
        bounceBall(ball.direction > 3*Math.PI/2 ? 2*Math.PI : Math.PI);
    }
      
    // Reposition the ball graphic
    court.setBallPosition(ball.x, ball.y);
}
    
// Helper function to perform "bounce" calculations
function bounceBall (bounceAxis) {
    ball.direction = ((2*bounceAxis-ball.direction)+(2*Math.PI))%(2*Math.PI);
}
    
// =============================================================================
// SYSTEM RESET
// =============================================================================
    
// Returns the entire game manager to its default state. This method is
// invoked each time the current client attempts to connect to the server.
function reset () {
    state = GameStates.INITIALIZING;
    joinTimer.stop();
    hud.resetScores();
    court.hideBall();
    court.hideRightPaddle();
    court.hideLeftPaddle();
    leftPlayer = null;
    rightPlayer = null;
}
    
// =============================================================================    
// DATA DESERIALIZATION    
// =============================================================================
    
// Converts a serialized string representation of the ball to actual ball
// object variable values. Invoked when the current client receives a
// ball update from the server.
function deserializeBall (value) {
    var values = value.split(",");
    ball.x         = parseInt(values[0]);
    ball.y         = parseInt(values[1]),
	ball.speed     = parseInt(values[2]),
	ball.direction = parseFloat(values[3]);
}
