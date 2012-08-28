package {
  import flash.display.Sprite;
  
  import net.user1.reactor.ConnectionManagerEvent;
  import net.user1.reactor.Reactor;
  import net.user1.reactor.ReactorEvent;
  import net.user1.reactor.Room;
  import net.user1.reactor.ModuleType;
  import net.user1.reactor.RoomModules;
  import net.user1.reactor.RoomSettings;
  
  /**
   * The pong application's main class.
   */  
  public class UnionPong extends Sprite {
// =============================================================================
// VARIABLES
// =============================================================================
    // The core Reactor object that connects to Union Server
    protected var reactor:Reactor;
    // Accepts keyboard input
    protected var keyboardController:KeyboardController;
    // Controls game flow logic and physics simulation
    protected var gameManager:GameManager;
    // The playing field graphics
    protected var court:Court;
    // Heads-up display, including scores and status messages
    protected var hud:HUD;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================
    public function UnionPong () {
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
    protected function beginConnectListener (e:ConnectionManagerEvent):void  {
      var connectAttemptCount:int = 
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
    protected function readyListener (e:ReactorEvent):void  {
      initGame();
    }
    
// =============================================================================
// GAME SETUP
// =============================================================================
    // Performs game setup
    protected function initGame ():void {
      // Give the keyboard controller a reference to the current 
      // client (reactor.self()), which it uses to send user input to the server
      keyboardController.setClient(PongClient(reactor.self()));
      // Specify the server side room module for the pong room
      var modules:RoomModules = new RoomModules();
      modules.addModule("net.user1.union.example.pong.PongRoomModule", 
                        ModuleType.CLASS);
      // Set the room-occupant limit to two, and make the game room permanent
      var settings:RoomSettings = new RoomSettings();
      settings.maxClients = 2;
      settings.removeOnEmpty = false;
      // Create the game room
      var room:Room = reactor.getRoomManager().createRoom(Settings.GAME_ROOMID, 
                                                          settings,
                                                          null,
                                                          modules);
      // Give the game manager a reference to the game room, which supplies
      // game-state updates from the server
      gameManager.setRoom(room);
    }
  }
}