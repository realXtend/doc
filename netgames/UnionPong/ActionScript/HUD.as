package {
  import flash.display.Sprite;
  import flash.text.TextField;
  import flash.text.TextFormat;
  import flash.text.TextFormatAlign;

  /**
   * A container for the "heads up display" of the pong game. Contains the
   * players' scores and a status message text field.
   */
  public class HUD extends Sprite {
// =============================================================================
// VARIABLES
// =============================================================================    
    protected var leftPlayerScore:TextField;
    protected var rightPlayerScore:TextField;    
    protected var status:TextField;    
    
// =============================================================================
// CONSTRUCTOR
// =============================================================================        
    public function HUD () {
      var format:TextFormat = new TextFormat("_typewriter", 32, 0xFFFFFF, true);
      leftPlayerScore = new TextField();
      leftPlayerScore.selectable = false;
      leftPlayerScore.defaultTextFormat = format;
      leftPlayerScore.x = 50;
      leftPlayerScore.y = 10;
      setLeftPlayerScore(0);
      addChild(leftPlayerScore);
      
      rightPlayerScore = new TextField();
      rightPlayerScore.selectable = false;
      rightPlayerScore.defaultTextFormat = format;
      rightPlayerScore.x = Settings.COURT_WIDTH - 80;
      rightPlayerScore.y = 10;
      setRightPlayerScore(0);
      addChild(rightPlayerScore);
      
      format = new TextFormat("_typewriter", 16, 0xFFFFFF, true);
      format.align = TextFormatAlign.CENTER;
      status = new TextField();
      status.selectable = false;
      status.defaultTextFormat = format;
      status.width = Settings.COURT_WIDTH;
      status.height = 30;
      status.y = Settings.COURT_HEIGHT - status.height - 10;
      addChild(status);
    }
    
    public function setRightPlayerScore (score:int):void {
      rightPlayerScore.text = String(score);
    }
    
    public function setLeftPlayerScore (score:int):void {
      leftPlayerScore.text = String(score);
    }
    
    public function resetScores ():void {
      setRightPlayerScore(0);
      setLeftPlayerScore(0);
    }
    
    public function setStatus (msg:String):void {
      status.text = msg;
    }
  }
}