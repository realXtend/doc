package {
  import flash.display.Sprite;

  /**
   * A container for the graphics in the pong game.
   */
  public class Court extends Sprite {
// =============================================================================
// VARIABLES
// =============================================================================    
    protected var leftPaddleGraphic:Rectangle;
    protected var rightPaddleGraphic:Rectangle;
    protected var topWallGraphic:Rectangle;
    protected var bottomWallGraphic:Rectangle;
    protected var ballGraphic:Rectangle;
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================    
    public function Court () {
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
    
    public function setBallPosition (x:int, y:int):void {
      ballGraphic.x = x;
      ballGraphic.y = y;
    }

    public function setLeftPaddlePosition (x:int, y:int):void {
      leftPaddleGraphic.x = x;
      leftPaddleGraphic.y = y;
    }

    public function setRightPaddlePosition (x:int, y:int):void {
      rightPaddleGraphic.x = x;
      rightPaddleGraphic.y = y;
    }
    
    public function showBall ():void {
      addChild(ballGraphic);
    }
    
    public function hideBall ():void {
      if (contains(ballGraphic)) {
        removeChild(ballGraphic);
      }
    }
    
    public function showLeftPaddle ():void {
      addChild(leftPaddleGraphic);
    }
    
    public function hideLeftPaddle ():void {
      if (contains(leftPaddleGraphic)) {
        removeChild(leftPaddleGraphic);
      }
    }
    
    public function showRightPaddle ():void {
      addChild(rightPaddleGraphic);
    }
    
    public function hideRightPaddle ():void {
      if (contains(rightPaddleGraphic)) {
        removeChild(rightPaddleGraphic);
      }
    }
  }
}










