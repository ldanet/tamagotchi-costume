import Sprite, { FrameSelection } from "./Sprite";
import foodSprite from "./sprites/food.png";
import girlSprite from "./sprites/girl.png";
import boySprite from "./sprites/boy.png";
import eggGirlSprite from "./sprites/eggGirl.png";
import eggBoySprite from "./sprites/eggBoy.png";
import iconsSprite from "./sprites/icons.png";
import statusSprite from "./sprites/status.png";
import foodSelectionSprite from "./sprites/foodSelection.png";
import waveSprite from "./sprites/wave.png";
import poopSprite from "./sprites/poop.png";
import numbersSprite from "./sprites/numbers.png";
import deathSprite from "./sprites/death.png";

type FrameSprite = {
  sprite: Sprite;
  frame: FrameSelection;
  x: number;
  y: number;
};

export type AnimationFrame = {
  ms?: number;
  sprites: FrameSprite[];
};

export type Animation = AnimationFrame[];

const babyFrameMap = {
  neutral: [0, 0],
  flat: [1, 0],
  left: [2, 0],
  eat: [3, 0],
  smile: [4, 0],
  angry: [5, 0],
  sleepy: [6, 0],
  right: [7, 0],
} as const;

const food = new Sprite(foodSprite, 24, 16, 3, 2);
const girl = new Sprite(girlSprite, 64, 8, 8, 1, babyFrameMap);
const boy = new Sprite(boySprite, 64, 8, 8, 1, babyFrameMap);
const girlEgg = new Sprite(eggGirlSprite, 48, 16, 3, 1);
const boyEgg = new Sprite(eggBoySprite, 48, 16, 3, 1);
const death = new Sprite(deathSprite, 48, 16, 3, 1, {
  obake1: [0, 0],
  obake2: [1, 0],
  tomb: [2, 0],
});
const numbers = new Sprite(numbersSprite, 40, 16, 5, 2, {
  0: [0, 0],
  1: [1, 0],
  2: [2, 0],
  3: [3, 0],
  4: [4, 1],
  5: [0, 1],
  6: [1, 1],
  7: [2, 1],
  8: [3, 1],
  9: [4, 1],
});
const status = new Sprite(statusSprite, 32, 64, 1, 8, {
  hungry: [0, 0],
  happy: [0, 1],
  discipline: [0, 2],
  gaugeEmpty: [0, 3],
  gaugeQuarter: [0, 4],
  gaugeHalf: [0, 5],
  gaugeThreeQuarters: [0, 6],
  gaugeFull: [0, 7],
});
const icons = new Sprite(iconsSprite, 32, 32, 4, 4, {
  angry1: [0, 0],
  angry2: [1, 0],
  happy: [2, 0],
  sick: [3, 0],
  sleep1: [0, 1],
  sleep2: [1, 1],
  arrowLeft: [2, 1],
  arrowRight: [3, 1],
  fullHeart: [0, 2],
  emptyHeart: [1, 2],
  scale: [2, 2],
  year: [3, 2],
  ounce: [0, 3],
  angry1alt: [1, 3],
  angry2alt: [2, 3],
  versus: [3, 3],
});
const foodSelection = new Sprite(foodSelectionSprite, 32, 16, 1, 1);
const wave = new Sprite(waveSprite, 6, 16, 1, 1);
const poop = new Sprite(poopSprite, 9, 16, 1, 2);

export type FoodOption = "meal" | "snack";
export type Gender = "boy" | "girl";

const getEggSprite = (gender: Gender) => (gender === "girl" ? girlEgg : boyEgg);
const getBabySprite = (gender: Gender) => (gender === "girl" ? girl : boy);

const translateAnimationFrame = (
  animationFrame: AnimationFrame,
  translateX: number,
  translateY: number = 0
): AnimationFrame => ({
  ...animationFrame,
  sprites: animationFrame.sprites.map((sprite) => ({
    ...sprite,
    x: sprite.x + translateX,
    y: sprite.y + translateY,
  })),
});

const sickFrameSprite: FrameSprite = {
  sprite: icons,
  frame: icons.sprite.frames.sick,
  x: 24,
  y: 0,
};

const injectSick = (frame: AnimationFrame, index: number): AnimationFrame => {
  const showSick = !Math.floor(((index + 1) % 6) / 3);
  return {
    ...frame,
    sprites: showSick ? [...frame.sprites, sickFrameSprite] : frame.sprites,
  };
};

const poopSprites: FrameSprite[] = [
  { sprite: poop, frame: [0, 0], x: 23, y: 8 },
  { sprite: poop, frame: [0, 1], x: 23, y: 8 },
];

const injectPoop = (frame: AnimationFrame, index: number): AnimationFrame => {
  const poopIndex = Math.floor((index % 6) / 3);
  return {
    ...frame,
    sprites: [...frame.sprites, poopSprites[poopIndex]],
  };
};

const injectStatus = (
  animation: Animation,
  hasPoop: boolean,
  isSick?: boolean,
  translateX: number = 0
) => {
  if (!hasPoop && !isSick) return animation;
  let result = [...animation];
  if (translateX) {
    result = result.map((frame) => translateAnimationFrame(frame, translateX));
  }
  if (hasPoop) {
    result = result.map((frame, index) => injectPoop(frame, index));
  }
  if (isSick) {
    result = result.map((frame, index) => injectSick(frame, index));
  }
  return result;
};

// Animation

export const eggIdleAnimation = (gender: Gender): Animation => {
  const egg = getEggSprite(gender);
  return [
    { sprites: [{ sprite: egg, frame: [0, 0], x: 8, y: 0 }] },
    { sprites: [{ sprite: egg, frame: [1, 0], x: 8, y: 0 }] },
  ];
};

export const eggHatchAnimation = (gender: Gender): Animation => {
  const egg = getEggSprite(gender);
  const cycle: Animation = [
    { sprites: [{ sprite: egg, frame: [1, 0], x: 8, y: 0 }] },
    { sprites: [{ sprite: egg, frame: [1, 0], x: 9, y: 0 }] },
  ];
  return [
    ...cycle,
    ...cycle,
    ...cycle,
    {
      ms: 3000,
      sprites: [{ sprite: egg, frame: [2, 0], x: 8, y: 0 }],
    },
  ];
};

export const foodAnimation = (
  gender: Gender,
  type: FoodOption,
  hasPoop: boolean,
  isSick: boolean
): Animation => {
  const foodRow = type === "meal" ? 0 : 1;
  const baby = getBabySprite(gender);
  const { eat, flat } = baby.sprite.frames;
  const babyFrame = (frame: FrameSelection): FrameSprite => ({
    sprite: baby,
    frame,
    x: 12,
    y: 8,
  });

  const foodFrame = (col: number): FrameSprite => ({
    sprite: food,
    frame: [col, foodRow],
    x: 3,
    y: 8,
  });
  return injectStatus(
    [
      {
        sprites: [
          { sprite: food, frame: [0, foodRow], x: 3, y: 0 } as FrameSprite,
          babyFrame(eat),
        ],
      },
      { sprites: [foodFrame(0), babyFrame(eat)] },
      { sprites: [foodFrame(1), babyFrame(flat)] },
      { sprites: [foodFrame(1), babyFrame(eat)] },
      { sprites: [foodFrame(2), babyFrame(flat)] },
      { sprites: [foodFrame(2), babyFrame(eat)] },
      { sprites: [babyFrame(flat)] },
      { sprites: [babyFrame(eat)] },
      { sprites: [babyFrame(flat)] },
    ],
    hasPoop,
    isSick
  );
};

export const idleAnimation = (
  gender: Gender,
  hasPoop: boolean,
  isSick: boolean
): Animation => {
  const baby = getBabySprite(gender);
  const { flat, neutral } = baby.sprite.frames;
  const animationFrame = (
    frame: FrameSelection,
    x: number
  ): AnimationFrame => ({ sprites: [{ sprite: baby, frame, x, y: 8 }] });
  return injectStatus(
    [
      animationFrame(neutral, 12),
      animationFrame(neutral, 10),
      animationFrame(flat, 8),
      animationFrame(neutral, 6),
      animationFrame(neutral, 8),
      animationFrame(neutral, 10),
      animationFrame(flat, 12),
      animationFrame(flat, 14),
      animationFrame(neutral, 12),
      animationFrame(neutral, 10),
      animationFrame(flat, 12),
      animationFrame(flat, 14),
      animationFrame(neutral, 14),
      animationFrame(neutral, 16),
      animationFrame(flat, 12),
      animationFrame(flat, 10),
      animationFrame(neutral, 8),
      animationFrame(neutral, 6),
      animationFrame(flat, 8),
      animationFrame(flat, 10),
    ],
    hasPoop,
    isSick,
    -2
  );
};

export const foodScreen = (type: FoodOption): AnimationFrame => ({
  sprites: [
    { sprite: foodSelection, frame: [0, 0], x: 0, y: 0 },
    {
      sprite: icons,
      frame: icons.sprite.frames.arrowRight,
      x: 1,
      y: type === "meal" ? 1 : 8,
    },
  ],
});

export const denyAnimation = (
  gender: Gender,
  hasPoop: boolean,
  isSick: boolean
): Animation => {
  const baby = getBabySprite(gender);
  const cycle: Animation = [
    { sprites: [{ sprite: baby, frame: [2, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [7, 0], x: 12, y: 8 }] },
  ];
  return injectStatus([...cycle, ...cycle, ...cycle], hasPoop, isSick);
};

export const happyAnimation = (
  gender: Gender,
  hasPoop: boolean,
  isSick: boolean
): Animation => {
  const baby = getBabySprite(gender);
  const { happy } = icons.sprite.frames;
  const cycle: Animation = [
    { sprites: [{ sprite: baby, frame: [1, 0], x: 12, y: 8 }] },
    {
      sprites: [
        { sprite: baby, frame: [4, 0], x: 12, y: 8 },
        { sprite: icons, frame: happy, x: hasPoop ? 4 : 20, y: 8 },
      ],
    },
  ];
  return injectStatus([...cycle, ...cycle, ...cycle], hasPoop, isSick);
};

export const angryAnimation = (
  gender: Gender,
  hasPoop: boolean,
  isSick: boolean
): Animation => {
  const baby = getBabySprite(gender);
  const { angry1, angry2, angry1alt, angry2alt } = icons.sprite.frames;
  const cycle: Animation = [
    {
      sprites: [
        { sprite: baby, frame: [1, 0], x: 12, y: 8 },
        {
          sprite: icons,
          frame: hasPoop ? angry1alt : angry1,
          x: hasPoop ? 4 : 20,
          y: 8,
        },
      ],
    },
    {
      sprites: [
        { sprite: baby, frame: [5, 0], x: 12, y: 8 },
        {
          sprite: icons,
          frame: hasPoop ? angry2alt : angry2,
          x: hasPoop ? 4 : 20,
          y: 8,
        },
      ],
    },
  ];
  return injectStatus([...cycle, ...cycle, ...cycle], hasPoop, isSick);
};

export const gameStartAnimation = (
  gender: Gender,
  hasPoop: boolean,
  isSick: boolean
): Animation => {
  const baby = getBabySprite(gender);
  const { neutral } = baby.sprite.frames;
  const { emptyHeart, fullHeart } = icons.sprite.frames;
  const animationFrame: AnimationFrame = {
    sprites: [
      { sprite: baby, frame: neutral, x: 12, y: 8 },
      { sprite: icons, frame: emptyHeart, x: 32, y: 8 },
      { sprite: icons, frame: emptyHeart, x: 48, y: 8 },
      { sprite: icons, frame: fullHeart, x: 40, y: 0 },
      { sprite: icons, frame: fullHeart, x: 56, y: 0 },
      ...(hasPoop ? [poopSprites[1]] : []),
      ...(isSick ? [sickFrameSprite] : []),
    ],
  };
  return [
    translateAnimationFrame(animationFrame, -32),
    translateAnimationFrame(animationFrame, -26),
    translateAnimationFrame(animationFrame, -19),
    translateAnimationFrame(animationFrame, -13),
    translateAnimationFrame(animationFrame, -6),
    animationFrame,
  ];
};

export const gameWaitAnimation = (
  gender: Gender,
  hasPoop: boolean,
  isSick: boolean
) => {
  const baby = getBabySprite(gender);
  const { neutral, smile } = baby.sprite.frames;
  const cycle: Animation = [
    {
      sprites: [{ sprite: baby, frame: neutral, x: 12, y: 8 }],
    },
    {
      sprites: [{ sprite: baby, frame: smile, x: 12, y: 8 }],
    },
  ];
  return injectStatus([...cycle, ...cycle], hasPoop, isSick);
};

export const gameActionAnimation = (
  gender: Gender,
  guess: "left" | "right",
  tamaFacing: "left" | "right"
): Animation => {
  const baby = getBabySprite(gender);
  const { left, right } = baby.sprite.frames;
  const { arrowLeft, arrowRight } = icons.sprite.frames;
  const leftArrow: FrameSprite = {
    sprite: icons,
    frame: arrowLeft,
    x: 0,
    y: 8,
  };
  const rightArrow: FrameSprite = {
    sprite: icons,
    frame: arrowRight,
    x: 24,
    y: 8,
  };
  return [
    {
      ms: 2000,
      sprites: [
        guess === "left" ? leftArrow : rightArrow,
        {
          sprite: baby,
          frame: tamaFacing === "left" ? left : right,
          x: 12,
          y: 8,
        },
      ],
    },
  ];
};

export const gameScoreAnimation = (
  gender: Gender,
  wonCount: number,
  lostCount: number
): Animation => {
  const baby = getBabySprite(gender);
  const digits = numbers.sprite.frames;
  const { neutral } = baby.sprite.frames;
  const { emptyHeart, versus } = icons.sprite.frames;
  return [
    {
      ms: 3000,
      sprites: [
        { sprite: baby, frame: neutral, x: 0, y: 0 },
        { sprite: icons, frame: emptyHeart, x: 16, y: 0 },
        {
          sprite: numbers,
          frame: digits[wonCount as keyof typeof digits],
          x: 0,
          y: 8,
        },
        { sprite: icons, frame: versus, x: 8, y: 8 },
        {
          sprite: numbers,
          frame: digits[lostCount as keyof typeof digits],
          x: 16,
          y: 8,
        },
      ],
    },
  ];
};

export const washAnimation = (currentFrame: AnimationFrame): Animation => {
  const washFrame: AnimationFrame = {
    sprites: [
      ...currentFrame.sprites,
      { sprite: wave, frame: [0, 0], x: 32, y: 0 },
    ],
  };
  return [
    translateAnimationFrame(washFrame, -6),
    translateAnimationFrame(washFrame, -14),
    translateAnimationFrame(washFrame, -23),
    translateAnimationFrame(washFrame, -32),
  ];
};

export const poopAnimation = (gender: Gender): Animation => {
  const baby = getBabySprite(gender);
  const { flat, neutral } = baby.sprite.frames;
  const cycle = [
    { ms: 1000, sprites: [{ sprite: baby, frame: flat, x: 12, y: 8 }] },
    { ms: 1000, sprites: [{ sprite: baby, frame: flat, x: 13, y: 8 }] },
  ];
  return [
    ...cycle,
    ...cycle,
    ...cycle,
    {
      sprites: [
        { sprite: baby, frame: neutral, x: 12, y: 8 },
        { sprite: poop, frame: [0, 1], x: 20, y: 8 },
      ],
    },
  ];
};

export const statusScreen = (
  gender: Gender,
  hungryLevel: number,
  happyLevel: number
): AnimationFrame[] => {
  const baby = getBabySprite(gender);
  const { neutral } = baby.sprite.frames;
  const { scale, ounce, year, emptyHeart, fullHeart } = icons.sprite.frames;
  const { hungry, happy, discipline, gaugeEmpty } = status.sprite.frames;
  const digits = numbers.sprite.frames;
  return [
    {
      sprites: [
        { sprite: baby, frame: neutral, x: 0, y: 0 },
        { sprite: numbers, frame: digits[0], x: 16, y: 0 },
        { sprite: icons, frame: year, x: 24, y: 0 },
        { sprite: icons, frame: scale, x: 0, y: 8 },
        { sprite: numbers, frame: digits[5], x: 16, y: 8 },
        { sprite: icons, frame: ounce, x: 24, y: 8 },
      ],
    },
    {
      sprites: [
        { sprite: status, frame: discipline, x: 0, y: 0 },
        { sprite: status, frame: gaugeEmpty, x: 0, y: 8 },
      ],
    },
    {
      sprites: [
        { sprite: status, frame: hungry, x: 0, y: 0 },
        {
          sprite: icons,
          frame: hungryLevel > 0 ? fullHeart : emptyHeart,
          x: 0,
          y: 8,
        },
        {
          sprite: icons,
          frame: hungryLevel > 1 ? fullHeart : emptyHeart,
          x: 8,
          y: 8,
        },
        {
          sprite: icons,
          frame: hungryLevel > 2 ? fullHeart : emptyHeart,
          x: 16,
          y: 8,
        },
        {
          sprite: icons,
          frame: hungryLevel > 3 ? fullHeart : emptyHeart,
          x: 24,
          y: 8,
        },
      ],
    },
    {
      sprites: [
        { sprite: status, frame: happy, x: 0, y: 0 },
        {
          sprite: icons,
          frame: happyLevel > 0 ? fullHeart : emptyHeart,
          x: 0,
          y: 8,
        },
        {
          sprite: icons,
          frame: happyLevel > 1 ? fullHeart : emptyHeart,
          x: 8,
          y: 8,
        },
        {
          sprite: icons,
          frame: happyLevel > 2 ? fullHeart : emptyHeart,
          x: 16,
          y: 8,
        },
        {
          sprite: icons,
          frame: happyLevel > 3 ? fullHeart : emptyHeart,
          x: 24,
          y: 8,
        },
      ],
    },
  ];
};

export const dyingAnimation = (gender: Gender): Animation => {
  const baby = getBabySprite(gender);
  const { smile, neutral, flat, sleepy } = baby.sprite.frames;
  const { obake2, tomb } = death.sprite.frames;
  const lastFrame = {
    sprites: [
      { sprite: baby, frame: sleepy, x: 12, y: 8 },
      { sprite: death, frame: obake2, x: 0, y: -16 },
      { sprite: death, frame: tomb, x: 16, y: -16 },
    ],
  };
  return [
    { ms: 1000, sprites: [{ sprite: baby, frame: smile, x: 12, y: 8 }] },
    { ms: 1000, sprites: [{ sprite: baby, frame: neutral, x: 12, y: 8 }] },
    { ms: 1000, sprites: [{ sprite: baby, frame: flat, x: 12, y: 8 }] },
    { ms: 1500, ...lastFrame },
    translateAnimationFrame(lastFrame, 0, 4),
    translateAnimationFrame(lastFrame, 0, 8),
    translateAnimationFrame(lastFrame, 0, 12),
    translateAnimationFrame(lastFrame, 0, 16),
  ];
};

export const deadAnimation = (): Animation => {
  const { obake1, obake2, tomb } = death.sprite.frames;
  return [
    {
      sprites: [
        { sprite: death, frame: obake1, x: 0, y: 0 },
        { sprite: death, frame: tomb, x: 16, y: 0 },
      ],
    },
    {
      sprites: [
        { sprite: death, frame: obake2, x: 0, y: 0 },
        { sprite: death, frame: tomb, x: 16, y: 0 },
      ],
    },
  ];
};
