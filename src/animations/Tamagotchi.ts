// Evolution reference: https://3.bp.blogspot.com/-S1LCMlHy4hY/V2568iPlQ3I/AAAAAAAAAOg/h1onugXX5UobkJqVAsLuUiIiaPPh3WukgCLcB/s1600/v1%2BGC.png

import Animatable, { AnimationDef, DirectionX } from "./Animatable";
import { capitalize } from "./helpers";
import Sprite from "./Sprite";
import idleSprite from "./sprites/babytchi_g.png";
import eatSprite from "./sprites/Eat.png";
import otherSprites from "./sprites/Other.png";

type TamagotchiAnimations = {
  dislike: AnimationDef;
  jumpRight: AnimationDef;
  jumpLeft: AnimationDef;
  meal: AnimationDef;
  snack: AnimationDef;
  bounce: AnimationDef;
};

class Tamagotchi extends Animatable {
  animations: TamagotchiAnimations;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    const idle = new Sprite(idleSprite, 64, 32, 2, 1);
    const eat = new Sprite(eatSprite, 640, 240, 4, 2);
    const other = new Sprite(otherSprites, 240, 360, 2, 3);

    this.animations = {
      dislike: other.get(2),
      jumpRight: other.get(0),
      jumpLeft: other.get(1),
      meal: eat.get(1),
      snack: eat.get(0),
      bounce: idle.get(),
    };

    this.idle = this.idle.bind(this);
    this.feed = this.feed.bind(this);
    this.dislike = this.dislike.bind(this);
    this.eat = this.eat.bind(this);
    this.jump = this.jump.bind(this);
    this.frame = this.frame.bind(this);
    this.move = this.move.bind(this);
    this.bounce = this.bounce.bind(this);
  }

  idle() {
    const { bounce } = this;
    const move = this.move("bounce", 0);

    function* animation() {
      // yield* this.jump('right');
      // yield* move('left', 25);
      // yield* this.jump('left');
      // yield* move('right', 25);
      yield* bounce();
      yield* move({ directionX: "right", moveXBy: 25 });
      yield* move({ directionX: "left", moveXBy: 50 });
      yield* bounce();
      yield* move({ directionX: "right", moveXBy: 25 });
    }

    return animation();
  }

  feed(food: keyof TamagotchiAnimations) {
    const { delay, eat } = this;

    function* animation(this: Tamagotchi) {
      yield* eat(food);

      yield delay(300);
    }

    return animation.call(this);
  }

  dislike() {
    const frame = this.frame(this.animations.dislike);

    function* animation() {
      yield* frame(0);
      yield* frame(1);
    }

    return animation.call(this);
  }

  eat(food: keyof TamagotchiAnimations) {
    const frame = this.frame(this.animations[food]);

    function* animation() {
      yield* frame(0);
      yield* frame(1);
      yield* frame(2);
      yield* frame(3);
    }

    return animation.call(this);
  }

  jump(direction: DirectionX) {
    const { delay } = this;
    const jumpTo = `jump${capitalize(direction)}` as "jumpLeft" | "jumpRight";
    const move = this.move(jumpTo, 0);
    const frame = this.frame(this.animations[jumpTo]);

    function* animation() {
      yield* move({
        directionX: direction,
        directionY: "up",
        moveXBy: 30,
        moveYBy: 40,
        ms: 40,
      });
      yield* move({ directionY: "down", moveYBy: 30, ms: 20 });
      yield* frame(1);
      yield delay(300);
    }

    return animation.call(this);
  }

  bounce() {
    const frame = this.frame(this.animations.bounce);

    function* animation() {
      yield* frame(0);
      yield* frame(1);
    }

    return animation.call(this);
  }
}

export default Tamagotchi;
