/**
 * Represents a client (player) in the pong room. 
 */  
// =============================================================================
// VARIABLES
// =============================================================================
// Player-related varants
var STATUS_READY = "ready";
var SIDE_RIGHT = "right";
var SIDE_LEFT = "left";
// The player's simulated paddle
var paddle;
    
// =============================================================================
// VARRUCTOR
// =============================================================================
function PongClient () {
    paddle = new PongObject();
    paddle.height = Settings.PADDLE_HEIGHT;
    paddle.width  = Settings.PADDLE_WIDTH;
}
    
// =============================================================================
// INITIALIZATION
// =============================================================================
function init () {
    addEventListener(AttributeEvent.UPDATE, updateAttributeListener);
    var paddleData = getAttribute(ClientAttributes.PADDLE, Settings.GAME_ROOMID);
    if (paddleData != null) {
        deserializePaddle(paddleData);
    } else {
        paddle.y = Settings.COURT_HEIGHT/2 - Settings.PADDLE_HEIGHT/2;
    }
}
    
// =============================================================================
// DATA ACCESS
// =============================================================================
function getPaddle () {
    return paddle;
}
    
function getSide () {
    return getAttribute(ClientAttributes.SIDE, Settings.GAME_ROOMID);
}
    
// =============================================================================
// CLIENT-TO-SERVER COMMUNICATION
// =============================================================================
// Sends the current client's paddle information to the server by setting
// a client attribute name "paddle"
function commit () {
    setAttribute(ClientAttributes.PADDLE, 
		 paddle.x + "," + paddle.y + "," + paddle.speed + "," + paddle.direction,
		 Settings.GAME_ROOMID);
}
    
// =============================================================================
// SERVER-TO-CLIENT COMMUNICATION
// =============================================================================
// Triggered when one of this client's attributes changes
function updateAttributeListener (e) {
    // If the "paddle" attribute changes, update this client's paddle
    if (e.getChangedAttr().name == ClientAttributes.PADDLE
	&& e.getChangedAttr().scope == Settings.GAME_ROOMID
	&& e.getChangedAttr().byClient == null) {
        deserializePaddle(e.getChangedAttr().value);
    }
}
    
// =============================================================================    
// DATA DESERIALIZATION    
// =============================================================================    
// Converts a serialized string representation of the paddle to actual 
// paddle object variable values. Invoked when this client receives a
// paddle update from the server.
function deserializePaddle (value) {
    var values = value.split(",");
    paddle.x = parseInt(values[0]);
    paddle.y = parseInt(values[1]);
    paddle.speed = parseInt(values[2]);
    paddle.direction = parseFloat(values[3]);
}
  












