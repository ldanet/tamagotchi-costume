import { useCallback, useEffect, useRef } from "react";
import { Animation, AnimationFrame } from "./animations";
import Sprite from "./Sprite";
import gridImage from "./sprites/grid-overlay.png";

const grid = new Sprite(gridImage, 544, 272, 1, 1).get(0, 0).image;

const pixelSize = 17;

const defaultFrameDurationMs = 500;

const delay = (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const clear = (ctx: CanvasRenderingContext2D | null) =>
  ctx?.clearRect(0, 0, 544, 272);

export const fill = (ctx: CanvasRenderingContext2D | null) =>
  ctx?.fillRect(0, 0, 544, 272);

export function drawFrame(
  ctx: CanvasRenderingContext2D | null,
  frame: AnimationFrame,
  lightsOff: boolean = false
) {
  if (!ctx) return;
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      lightsOff ? fill(ctx) : clear(ctx);
      frame.sprites.forEach((frameSprite) => {
        const { sprite, x, y, frame } = frameSprite;
        const source = sprite.get(...frame);
        const { coord, frameWidth, frameHeight } = source;
        ctx.drawImage(
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
      ctx.drawImage(grid, 0, 0);
      resolve();
    });
  });
}

export async function animate(
  context: CanvasRenderingContext2D | null,
  animation: Animation,
  lightsOff: boolean = false
) {
  if (!context) return;
  for (let index = 0; index < animation.length; index++) {
    const frame = animation[index];
    await drawFrame(context, frame, lightsOff);
    await delay(frame.ms ?? defaultFrameDurationMs);
  }
}

export const useAnimationLoop = (
  ctx: CanvasRenderingContext2D | null,
  loopingAnimation: Animation,
  lightsOff: boolean,
  pauseLoop: boolean
) => {
  const animationQueue = useRef<Animation>([...loopingAnimation]);
  const currentFrame = useRef<AnimationFrame>();

  const setAnimation = useCallback((animation: Animation) => {
    animationQueue.current = [...animation];
  }, []);

  useEffect(() => {
    let run = true;

    async function loop() {
      while (!pauseLoop && run && ctx) {
        if (!animationQueue.current.length) {
          setAnimation(loopingAnimation);
        }
        const frame = animationQueue.current.shift();
        currentFrame.current = frame;
        if (frame) {
          await drawFrame(ctx, frame, lightsOff);
          await delay(frame.ms ?? defaultFrameDurationMs);
        }
      }
    }

    if (!pauseLoop) loop();

    return () => {
      run = false;
    };
  }, [loopingAnimation, setAnimation, ctx, lightsOff, pauseLoop]);

  return { setAnimation, currentFrame };
};
