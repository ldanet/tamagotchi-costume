import Sprite from "./Sprite";
import foodSprite from "./sprites/food.png";
import kidSprite from "./sprites/kid.png";
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
const kid = new Sprite(kidSprite, 56, 8, 7, 1);
const icons = new Sprite(iconsSprite, 32, 32, 4, 4);
const foodSelection = new Sprite(foodSelectionSprite, 32, 16, 1, 1);

export type FoodOption = "meal" | "snack";

export const foodAnimation = (type: FoodOption): Animation => {
  const foodRow = type === "meal" ? 0 : 1;
  const openMouthKid: FrameSprite = { sprite: kid, frame: [3, 0], x: 16, y: 7 };
  const closedMouthKid: FrameSprite = {
    sprite: kid,
    frame: [1, 0],
    x: 16,
    y: 8,
  };

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
        openMouthKid,
      ],
    },
    { sprites: [foodFrame(0), openMouthKid] },
    { sprites: [foodFrame(1), closedMouthKid] },
    { sprites: [foodFrame(1), openMouthKid] },
    { sprites: [foodFrame(2), closedMouthKid] },
    { sprites: [foodFrame(2), openMouthKid] },
    { sprites: [closedMouthKid] },
    { sprites: [openMouthKid] },
    { sprites: [closedMouthKid] },
  ];
};

export const idleAnimation: Animation = [
  { sprites: [{ sprite: kid, frame: [0, 0], x: 12, y: 7 }] },
  { sprites: [{ sprite: kid, frame: [0, 0], x: 9, y: 7 }] },
  { sprites: [{ sprite: kid, frame: [1, 0], x: 6, y: 8 }] },
  { sprites: [{ sprite: kid, frame: [1, 0], x: 9, y: 8 }] },
  { sprites: [{ sprite: kid, frame: [0, 0], x: 7, y: 7 }] },
  { sprites: [{ sprite: kid, frame: [0, 0], x: 10, y: 7 }] },
  { sprites: [{ sprite: kid, frame: [1, 0], x: 14, y: 8 }] },
  { sprites: [{ sprite: kid, frame: [1, 0], x: 18, y: 8 }] },
  { sprites: [{ sprite: kid, frame: [0, 0], x: 14, y: 7 }] },
];

export const foodScreen = (type: FoodOption): AnimationFrame => ({
  sprites: [
    { sprite: foodSelection, frame: [0, 0], x: 0, y: 0 },
    { sprite: icons, frame: [3, 1], x: 1, y: type === "meal" ? 0 : 8 },
  ],
});
