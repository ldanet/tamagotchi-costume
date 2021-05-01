import Sprite, { FrameSelection } from "./Sprite";
import foodSprite from "./sprites/food.png";
import girlSprite from "./sprites/girl.png";
import boySprite from "./sprites/boy.png";
import iconsSprite from "./sprites/icons.png";
import statusSprite from "./sprites/status.png";
import foodSelectionSprite from "./sprites/foodSelection.png";
import waveSprite from "./sprites/wave.png";
import poopSprite from "./sprites/poop.png";
import numbersSprite from "./sprites/numbers.png";

type FrameSprite = {
  sprite: Sprite;
  frame: FrameSelection;
  x: number;
  y: number;
  mirror?: "horizontal" | "vertical";
};

export type AnimationFrame = {
  ms?: number;
  sprites: FrameSprite[];
};

export type Animation = AnimationFrame[];

const babyFrameMap = {
  neutral: [0, 0] as FrameSelection,
  flat: [1, 0] as FrameSelection,
  left: [2, 0] as FrameSelection,
  eat: [3, 0] as FrameSelection,
  smile: [4, 0] as FrameSelection,
  angry: [5, 0] as FrameSelection,
  sleepy: [6, 0] as FrameSelection,
  right: [7, 0] as FrameSelection,
};

const food = new Sprite(foodSprite, 24, 16, 3, 2);
const girl = new Sprite(girlSprite, 64, 8, 8, 1, babyFrameMap);
const boy = new Sprite(boySprite, 64, 8, 8, 1, babyFrameMap);
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
  pound: [1, 3],
  gram: [2, 3],
  versus: [3, 3],
});
const foodSelection = new Sprite(foodSelectionSprite, 32, 16, 1, 1);
const wave = new Sprite(waveSprite, 6, 16, 1, 1);
const poop = new Sprite(poopSprite, 9, 16, 1, 2);

export type FoodOption = "meal" | "snack";
export type Gender = "boy" | "girl";

const getBabySprite = (gender: Gender) => (gender === "girl" ? girl : boy);

const translateAnimationFrame = (
  animationFrame: AnimationFrame,
  translateX: number
): AnimationFrame => ({
  ...animationFrame,
  sprites: animationFrame.sprites.map((sprite) => ({
    ...sprite,
    x: sprite.x + translateX,
  })),
});

const poopSprites: FrameSprite[] = [
  { sprite: poop, frame: [0, 0], x: 23, y: 8 },
  { sprite: poop, frame: [0, 1], x: 23, y: 8 },
];

const injectPoop = (frame: AnimationFrame, index: number): AnimationFrame => {
  const poopIndex = Math.floor((index % 4) / 2);
  console.log("poopIndex: ", poopIndex);
  return {
    ...frame,
    sprites: [...frame.sprites, poopSprites[poopIndex]],
  };
};

// Animations

export const foodAnimation = (
  gender: Gender,
  type: FoodOption,
  hasPoop: boolean
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
  return [
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
  ].map((frame, index) => (hasPoop ? injectPoop(frame, index + 1) : frame));
};

export const idleAnimation = (gender: Gender, hasPoop: boolean): Animation => {
  const baby = getBabySprite(gender);
  const { flat, neutral } = baby.sprite.frames;
  const animationFrame = (
    frame: FrameSelection,
    x: number
  ): AnimationFrame => ({ sprites: [{ sprite: baby, frame, x, y: 8 }] });
  return [
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
  ].map((frame, index) =>
    hasPoop ? injectPoop(translateAnimationFrame(frame, -2), index) : frame
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

export const denyAnimation = (gender: Gender, hasPoop: boolean): Animation => {
  const baby = getBabySprite(gender);
  const cycle: Animation = [
    { sprites: [{ sprite: baby, frame: [2, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [7, 0], x: 12, y: 8 }] },
  ];
  return [...cycle, ...cycle, ...cycle].map((frame, index) =>
    hasPoop ? injectPoop(frame, index) : frame
  );
};

export const happyAnimation = (gender: Gender, hasPoop: boolean): Animation => {
  const baby = getBabySprite(gender);
  const { happy } = icons.sprite.frames;
  const cycle: Animation = [
    { sprites: [{ sprite: baby, frame: [1, 0], x: 12, y: 8 }] },
    {
      sprites: [
        { sprite: baby, frame: [4, 0], x: 12, y: 8 },
        { sprite: icons, frame: happy, x: 20, y: 8 },
      ],
    },
  ];
  return [...cycle, ...cycle, ...cycle].map((frame, index) =>
    hasPoop ? injectPoop(translateAnimationFrame(frame, -6), index) : frame
  );
};

export const angryAnimation = (gender: Gender, hasPoop: boolean): Animation => {
  const baby = getBabySprite(gender);
  const { angry1, angry2 } = icons.sprite.frames;
  const cycle: Animation = [
    {
      sprites: [
        { sprite: baby, frame: [1, 0], x: 12, y: 8 },
        { sprite: icons, frame: angry1, x: 20, y: 8 },
      ],
    },
    {
      sprites: [
        { sprite: baby, frame: [5, 0], x: 12, y: 8 },
        { sprite: icons, frame: angry2, x: 20, y: 8 },
      ],
    },
  ];
  return [...cycle, ...cycle, ...cycle].map((frame, index) =>
    hasPoop ? injectPoop(translateAnimationFrame(frame, -6), index) : frame
  );
};

export const gameStartAnimation = (
  gender: Gender,
  hasPoop: boolean
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

export const gameWaitAnimation = (gender: Gender, hasPoop: boolean) => {
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
  return [...cycle, ...cycle].map((frame, index) =>
    hasPoop ? injectPoop(frame, index) : frame
  );
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
