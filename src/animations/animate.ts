import { Animation, AnimationFrame } from "./animations";

const pixelSize = 17;

const delay = (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const clear = (context: CanvasRenderingContext2D) =>
  context.clearRect(0, 0, 544, 272);

export const fill = (context: CanvasRenderingContext2D) =>
  context.fillRect(0, 0, 544, 272);

function drawFrame(
  context: CanvasRenderingContext2D,
  frame: AnimationFrame,
  lightsOff: boolean
) {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      lightsOff ? fill(context) : clear(context);
      frame.sprites.forEach((frameSprite) => {
        const { sprite, x, y, frame } = frameSprite;
        const source = sprite.get(...frame);
        const { coord, frameWidth, frameHeight } = source;
        context.drawImage(
          source.image,
          coord.x,
          coord.y,
          frameWidth,
          frameHeight,
          x * pixelSize,
          y * pixelSize,
          frameWidth * pixelSize,
          frameHeight * pixelSize
        );
      });
      resolve();
    });
  });
}

export async function animate(
  context: CanvasRenderingContext2D | null,
  animation: Animation,
  lightsOff: boolean
) {
  if (!context) return;
  for (let index = 0; index < animation.length; index++) {
    const frame = animation[index];
    await drawFrame(context, frame, lightsOff);
    await delay(frame.ms ?? 500);
  }
  if (lightsOff) {
    fill(context);
  } else {
    clear(context);
  }
}
