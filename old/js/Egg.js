class Egg extends Animatable {
  constructor(canvas) {
    super(canvas, 32);
    const egg = new Sprite('img/sprites/Egg.png', 192, 32, 6, 1);

    this.animations = {
      egg: egg.get(0),
    }

    this.bounce = this.bounce.bind(this);
    this.break = this.break.bind(this);
    this.hatch = this.hatch.bind(this);
  }

  bounce(max) {
    const frame = this.frame(this.animations.egg);

    function* animation() {
      while (max > 0) {
        yield* frame(0);
        yield* frame(0);
        yield* frame(1);
        yield* frame(1);
        max--;
      }
    };

    return animation.call(this);
  }

  break() {
    const frame = this.frame(this.animations.egg);

    function* animation() {
      yield* frame(2);
      yield* frame(3);
      yield* frame(2);
      yield* frame(3);
      yield* frame(2);
      yield* frame(3);
      yield* frame(5); // only showing girl hatching for now. Should be frame(4) for boy.
    };

    return animation.call(this);
  }

  hatch() {
    function* animation() {
      yield* this.bounce(3); // TODO make this longer when ready.
      yield* this.break();
    };

    return animation.call(this);
  }
}
