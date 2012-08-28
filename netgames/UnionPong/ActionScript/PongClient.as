package {
  import net.user1.reactor.AttributeEvent;
  import net.user1.reactor.CustomClient;
  
  /**
   * Represents a client (player) in the pong room. 
   */  
  public class PongClient extends CustomClient {
// =============================================================================
// VARIABLES
// =============================================================================
    // Player-related constants
    public static const STATUS_READY:String = "ready";
    public static const SIDE_RIGHT:String = "right";
    public static const SIDE_LEFT:String = "left";
    // The player's simulated paddle
    protected var paddle:PongObject;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================
    public function PongClient () {
      paddle = new PongObject();
      paddle.height = Settings.PADDLE_HEIGHT;
      paddle.width  = Settings.PADDLE_WIDTH;
    }
    
// =============================================================================
// INITIALIZATION
// =============================================================================
    override public function init ():void {
      addEventListener(AttributeEvent.UPDATE, updateAttributeListener);
      var paddleData:String = getAttribute(ClientAttributes.PADDLE, Settings.GAME_ROOMID);
      if (paddleData != null) {
        deserializePaddle(paddleData);
      } else {
        paddle.y = Settings.COURT_HEIGHT/2 - Settings.PADDLE_HEIGHT/2;
      }
    }
    
// =============================================================================
// DATA ACCESS
// =============================================================================
    public function getPaddle ():PongObject {
      return paddle;
    }
    
    public function getSide ():String {
      return getAttribute(ClientAttributes.SIDE, Settings.GAME_ROOMID);
    }
    
// =============================================================================
// CLIENT-TO-SERVER COMMUNICATION
// =============================================================================
    // Sends the current client's paddle information to the server by setting
    // a client attribute name "paddle"
    public function commit ():void {
      setAttribute(ClientAttributes.PADDLE, 
                   paddle.x + "," + paddle.y + "," + paddle.speed + "," + paddle.direction,
                   Settings.GAME_ROOMID);
    }
    
// =============================================================================
// SERVER-TO-CLIENT COMMUNICATION
// =============================================================================
    // Triggered when one of this client's attributes changes
    public function updateAttributeListener (e:AttributeEvent):void {
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
    protected function deserializePaddle (value:String):void {
      var values:Array = value.split(",");
      paddle.x = parseInt(values[0]);
      paddle.y = parseInt(values[1]);
      paddle.speed = parseInt(values[2]);
      paddle.direction = parseFloat(values[3]);
    }
  }
}











