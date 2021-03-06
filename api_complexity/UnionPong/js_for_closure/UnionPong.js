/**
 * The pong application's main class.
 */  
// =============================================================================
// VARIABLES
// =============================================================================
// The core Reactor object that connects to Union Server
var reactor;
// Accepts keyboard input
var keyboardController;
// Controls game flow logic and physics simulation
var gameManager;
// The playing field graphics
var court;
// Heads-up display, including scores and status messages
var hud;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================
function UnionPong () {
    // Make the keyboard controller
    keyboardController = new KeyboardController(stage);
      
    // Make the Reactor object and connect to Union Server
    reactor = new Reactor("config.xml");
    reactor.addEventListener(ReactorEvent.READY, readyListener);
    reactor.getConnectionManager().addEventListener(
						    ConnectionManagerEvent.BEGIN_CONNECT,
						    beginConnectListener);
      
    // Tell Reactor to use PongClient as the class for clients in this app
    reactor.getClientManager().setDefaultClientClass(PongClient);
      
    // Make the heads-up display
    hud = new HUD();
    addChild(hud);
      
    // Make the playing field graphic
    court = new Court();
    addChild(court);
      
    // Make the game manager
    gameManager = new GameManager(court, hud);
}
    
// =============================================================================
// CONNECTION MANAGER EVENT LISTENERS
// =============================================================================
// Triggered when the client begins a connection attempt
function beginConnectListener (e)  {
    var connectAttemptCount = 
	reactor.getConnectionManager().getConnectAttemptCount();
    if (reactor.getConnectionManager().getReadyCount() == 0) {
        // The client has never connected before
        if (connectAttemptCount == 1) {
	    hud.setStatus("Connecting to Union...");
        } else {
	    hud.setStatus("Connection attempt failed. Trying again (attempt "
			  + connectAttemptCount + ")...");
        }
    } else {
        // The client has connected before, so this is a reconnection attempt
        if (connectAttemptCount == 1) {
	    hud.setStatus("Disconnected from Union. Reconnecting...");
        } else {
	    hud.setStatus("Reconnection attempt failed. Trying again (attempt "
			  + connectAttemptCount + ")...");
        }
    }
    gameManager.reset();
}
    
// =============================================================================
// REACTOR EVENT LISTENERS
// =============================================================================
// Triggered when the connection is established and ready for use
function readyListener (e)  {
    initGame();
}
    
// =============================================================================
// GAME SETUP
// =============================================================================
// Performs game setup
function initGame () {
    // Give the keyboard controller a reference to the current 
    // client (reactor.self()), which it uses to send user input to the server
    keyboardController.setClient(PongClient(reactor.self()));
    // Specify the server side room module for the pong room
    var modules = new RoomModules();
    modules.addModule("net.user1.union.example.pong.PongRoomModule", 
		      ModuleType.CLASS);
    // Set the room-occupant limit to two, and make the game room permanent
    var settings = new RoomSettings();
    settings.maxClients = 2;
    settings.removeOnEmpty = false;
    // Create the game room
    var room = reactor.getRoomManager().createRoom(Settings.GAME_ROOMID, 
						   settings,
						   null,
						   modules);
    // Give the game manager a reference to the game room, which supplies
    // game-state updates from the server
    gameManager.setRoom(room);
}
