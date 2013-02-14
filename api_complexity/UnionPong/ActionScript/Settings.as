package {
  /**
   * An enumeration of application settings.
   */
  public final class Settings {
    // Game room
    public static const GAME_ROOMID:String = "examples.pong";
    
    // Game settings
    public static const GAME_UPDATE_INTERVAL:int = 20;
    public static const PADDLE_WIDTH:int = 10;
    public static const PADDLE_HEIGHT:int = 60;
    public static const PADDLE_SPEED:int = 300;
    public static const BALL_SIZE:int = 10;
    public static const BALL_SPEEDUP:int = 25;
    public static const WALL_HEIGHT:int = 10;
    public static const COURT_WIDTH:int = 640;
    public static const COURT_HEIGHT:int = 480;
    public static const UP:Number = Math.floor((1000*(Math.PI/2)))/1000;
    public static const DOWN:Number = Math.floor((1000*((3*Math.PI)/2)))/1000;
  }
}