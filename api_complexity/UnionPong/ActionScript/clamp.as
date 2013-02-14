package {
  /**
   * Forces a value into a certain range. For example, given
   * the range 7-10, the value 5 would return 7, the value 8 would return 8,
   * and the value 145 would return 10.
   */ 
  public function clamp (value:Number, min:Number, max:Number):Number {
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
  }
}