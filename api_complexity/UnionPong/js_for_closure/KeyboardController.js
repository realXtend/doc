/**
 * Receives keyboard input from the user and sends it to Union Server
 */
// =============================================================================
// VARIABLES
// =============================================================================
// A reference to the current client, used to send paddle 
// updates to Union Server 
var client;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================
function KeyboardController (stage) {
    stage.addEventListener(KeyboardEvent.KEY_UP, keyUpListener);
    stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownListener);
}
    
// =============================================================================
// DEPENDENCIES
// =============================================================================
function setClient (client) {
    this.client = client;
}
    
// =============================================================================
// KEYBOARD LISTENERS
// =============================================================================
function keyDownListener (e) {
    if (client != null) {
        if (e.keyCode == Keyboard.UP) {
	    if (client.getPaddle().direction != Settings.UP
		|| client.getPaddle().speed != Settings.PADDLE_SPEED) {
		client.getPaddle().speed = Settings.PADDLE_SPEED;
		client.getPaddle().direction = Settings.UP;
		// Send the new paddle direction (up) to the server
		client.commit();
	    }
        } else if (e.keyCode == Keyboard.DOWN) {
	    if (client.getPaddle().direction != Settings.DOWN
		|| client.getPaddle().speed != Settings.PADDLE_SPEED) {
		client.getPaddle().speed = Settings.PADDLE_SPEED;
		client.getPaddle().direction = Settings.DOWN;
		// Send the new paddle direction (down) to the server
		client.commit();
	    }
        }
    }
}
    
function keyUpListener (e) {
    if (client != null) {
        if (e.keyCode == Keyboard.UP || e.keyCode == Keyboard.DOWN) {
	    if (client.getPaddle().speed != 0) {
		client.getPaddle().speed = 0;
		// Send the new paddle speed (stopped) to the server
		client.commit();
	    }
        }
    }
}
