import Sprite from "./Sprite";
import foodSprite from "./sprites/food.png";
import kidSprite from "./sprites/kid.png";

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

export const foodAnimation = (type: "meal" | "snack"): Animation => {
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
    {
      sprites: [foodFrame(0), openMouthKid],
    },
    {
      sprites: [foodFrame(1), closedMouthKid],
    },
    {
      sprites: [foodFrame(1), openMouthKid],
    },
    {
      sprites: [foodFrame(2), closedMouthKid],
    },
    {
      sprites: [foodFrame(2), openMouthKid],
    },
    {
      sprites: [closedMouthKid],
    },
    {
      sprites: [openMouthKid],
    },
    {
      sprites: [closedMouthKid],
    },
  ];
};
