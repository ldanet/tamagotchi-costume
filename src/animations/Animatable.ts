import { FrameCoordinates } from "./Sprite";

export type DirectionY = "up" | "down";

export type DirectionX = "left" | "right";

type MoveImageOptions = {
  ms?: number;
} & (
  | {
      moveXBy: number;
      moveYBy?: undefined;
      directionX: DirectionX;
      directionY?: undefined;
    }
  | {
      moveXBy?: undefined;
      moveYBy: number;
      directionX?: undefined;
      directionY: DirectionY;
    }
  | {
      moveXBy: number;
      moveYBy: number;
      directionX: DirectionX;
      directionY: DirectionY;
    }
);

export type AnimationDef = {
  frames: FrameCoordinates[];
  image: HTMLImageElement;
  width: number;
  height: number;
  columns: number;
  rows: number;
  center: number;
  count: number;
  frameWidth: number;
  frameHeight: number;
};

abstract class Animatable {
  context: CanvasRenderingContext2D | null;
  standardFrameWidth: number;
  initialPositionX: number;
  initialPositionY: number;
  positionX: number;
  positionY: number;
  ms: number;

  abstract animations: { [key: string]: AnimationDef };

  constructor(
    canvas: HTMLCanvasElement,
    standardFrameWidth = 120,
    standardFrameHeight = 120,
    ms = 300
  ) {
    this.context = canvas.getContext("2d");
    this.standardFrameWidth = standardFrameWidth;
    this.initialPositionX = this.center(canvas.width, standardFrameWidth);
    this.initialPositionY = canvas.height - standardFrameHeight;

    this.positionX = this.initialPositionX;
    this.positionY = this.initialPositionY;
    this.ms = ms;

    this.clear = this.clear.bind(this, canvas.width, canvas.height);
    this.center = this.center.bind(this);
    this.delay = this.delay.bind(this);
    this.reset = this.reset.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
    this.moveImage = this.moveImage.bind(this);
  }

  clear(canvasWidth: number, canvasHeight: number) {
    this.context?.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  center(canvasWidth: number, frameWidth: number) {
    return canvasWidth / 2 - frameWidth / 2;
  }

  delay(ms: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  drawFrame(
    image: HTMLImageElement,
    frame: FrameCoordinates = [0, 0],
    width: number,
    height: number,
    ms = this.ms,
    positionX = this.positionX,
    positionY = this.positionY
  ) {
    const { clear, delay } = this;

    const draw = () =>
      requestAnimationFrame(() => {
        this.context?.drawImage(
          image,
          ...frame,
          width,
          height,
          positionX,
          positionY,
          width,
          height
        );
      });

    function* animation() {
      yield clear;
      yield draw;
      yield delay(ms);
    }

    return animation.call(this);
  }

  moveImage(
    draw: (ms: number, x: number, y: number) => any,
    options: MoveImageOptions
  ) {
    const moveTo = {
      right: 30,
      left: -30,
      up: -30,
      down: 30,
    };

    let incrementX = 0;
    let incrementY = 0;
    const { ms = 40, moveXBy = 0, moveYBy = 0 } = options;

    if (options.directionX && options.directionY) {
      const { directionX, directionY } = options;
      incrementX = directionX && moveTo[directionX];
      incrementY = directionY && moveTo[directionY];
    } else if (options.directionX) {
      incrementX = moveTo[options.directionX];
    } else {
      incrementY = moveTo[options.directionY];
    }

    const x = this.positionX;
    const y = this.positionY;
    const boundaryX = x + moveXBy * incrementX;
    const boundaryY = y + moveYBy * incrementY;

    function* animation(this: Animatable) {
      while (true) {
        if (
          (incrementX && this.positionX === boundaryX) ||
          (incrementY && this.positionY === boundaryY)
        ) {
          return;
        }

        yield* draw(ms, this.positionX, this.positionY);

        if (moveXBy) this.positionX += incrementX;
        if (moveYBy) this.positionY += incrementY;
      }
    }

    return animation.call(this);
  }

  move(action: string, frame: number) {
    let draw = this.frame(this.animations[action]);
    draw = draw.bind(null, frame);

    return (options: MoveImageOptions) => this.moveImage(draw, options);
  }

  frame(
    animation: AnimationDef
  ): (
    frame: number,
    ms?: number,
    positionX?: number,
    positionY?: number
  ) => any {
    const { image, frames, frameWidth, frameHeight } = animation;

    return (frame, ...args) => {
      return this.drawFrame(
        image,
        frames[frame],
        frameWidth,
        frameHeight,
        ...args
      );
    };
  }

  reset() {
    this.positionX = this.initialPositionX;
    this.positionY = this.initialPositionY;
  }
}

export default Animatable;
