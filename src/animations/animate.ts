import { useCallback, useEffect, useRef } from "react";
import { Animation, AnimationFrame } from "./animations";

const pixelSize = 17;

const delay = (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const clear = (ctx: CanvasRenderingContext2D) =>
  ctx.clearRect(0, 0, 544, 272);

export const fill = (ctx: CanvasRenderingContext2D) =>
  ctx.fillRect(0, 0, 544, 272);

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: AnimationFrame,
  lightsOff: boolean
) {
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
      resolve();
    });
  });
}

export const useAnimationLoop = (
  ctx: CanvasRenderingContext2D | null,
  loopingAnimation: Animation,
  lightsOff: boolean,
  setBusy: (busy: boolean) => void
) => {
  const animationQueue = useRef<Animation>([...loopingAnimation]);

  const setAnimation = useCallback((animation: Animation) => {
    animationQueue.current = [...animation];
  }, []);

  useEffect(() => {
    let run = true;
    async function loop() {
      while (run && ctx) {
        if (!animationQueue.current.length) {
          setBusy(false);
          setAnimation(loopingAnimation);
        }
        const frame = animationQueue.current.shift();
        if (frame) {
          await drawFrame(ctx, frame, lightsOff);
          await delay(frame.ms ?? 500);
        }
      }
    }
    loop();
    return () => {
      run = false;
    };
  }, [loopingAnimation, setAnimation, setBusy, ctx, lightsOff]);

  return { setAnimation };
};
