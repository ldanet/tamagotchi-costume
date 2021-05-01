import Sprite from "./Sprite";
import foodSprite from "./sprites/food.png";
import girlSprite from "./sprites/girl.png";
import boySprite from "./sprites/boy.png";
import iconsSprite from "./sprites/icons.png";
import foodSelectionSprite from "./sprites/foodSelection.png";

type FrameSprite = {
  sprite: Sprite;
  frame: [number, number];
  x: number;
  y: number;
  mirror?: "horizontal" | "vertical";
};

export type AnimationFrame = {
  ms?: number;
  sprites: FrameSprite[];
};

export type Animation = AnimationFrame[];

const food = new Sprite(foodSprite, 24, 16, 3, 2);
const girl = new Sprite(girlSprite, 64, 8, 8, 1);
const boy = new Sprite(boySprite, 64, 8, 8, 1);
const icons = new Sprite(iconsSprite, 32, 32, 4, 4);
const foodSelection = new Sprite(foodSelectionSprite, 32, 16, 1, 1);

export type FoodOption = "meal" | "snack";
export type Gender = "boy" | "girl";

export const foodAnimation = (gender: Gender, type: FoodOption): Animation => {
  const foodRow = type === "meal" ? 0 : 1;
  const baby = gender === "girl" ? girl : boy;
  const babyFrame = (open: boolean): FrameSprite => ({
    sprite: baby,
    frame: [open ? 3 : 1, 0],
    x: 16,
    y: 8,
  });

  const foodFrame = (col: number): FrameSprite => ({
    sprite: food,
    frame: [col, foodRow],
    x: 6,
    y: 8,
  });
  return [
    {
      sprites: [
        { sprite: food, frame: [0, foodRow], x: 6, y: 0 },
        babyFrame(true),
      ],
    },
    { sprites: [foodFrame(0), babyFrame(true)] },
    { sprites: [foodFrame(1), babyFrame(false)] },
    { sprites: [foodFrame(1), babyFrame(true)] },
    { sprites: [foodFrame(2), babyFrame(false)] },
    { sprites: [foodFrame(2), babyFrame(true)] },
    { sprites: [babyFrame(false)] },
    { sprites: [babyFrame(true)] },
    { sprites: [babyFrame(false)] },
  ];
};

export const idleAnimation = (gender: Gender): Animation => {
  const baby = gender === "girl" ? girl : boy;
  return [
    { sprites: [{ sprite: baby, frame: [0, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 10, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 8, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 6, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 8, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 10, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 14, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 10, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 14, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 14, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 16, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 12, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 8, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [0, 0], x: 6, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 8, y: 8 }] },
    { sprites: [{ sprite: baby, frame: [1, 0], x: 10, y: 8 }] },
  ];
};

export const foodScreen = (type: FoodOption): AnimationFrame => ({
  sprites: [
    { sprite: foodSelection, frame: [0, 0], x: 0, y: 0 },
    { sprite: icons, frame: [3, 1], x: 1, y: type === "meal" ? 0 : 8 },
  ],
});
