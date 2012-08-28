package {
  import flash.display.Sprite;

  /**
   * An on-screen rectangle graphic.
   */
  public class Rectangle extends Sprite {
    public function Rectangle (width:int, height:int, color:uint) {
      graphics.beginFill(color);
      graphics.drawRect(0, 0, width, height);
    }
  }
}

