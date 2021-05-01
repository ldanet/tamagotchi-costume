import React, { useCallback, useEffect, useRef, useState } from "react";

import foodIcon from "./icons/food.png";
import lightIcon from "./icons/light.png";
import gameIcon from "./icons/game.png";
import medicineIcon from "./icons/medicine.png";
import bathroomIcon from "./icons/bathroom.png";
import statusIcon from "./icons/status.png";
import disciplineIcon from "./icons/discipline.png";
import attentionIcon from "./icons/attention.png";

import gridOverlay from "./grid-overlay.png";

import "./App.css";
import {
  animate,
  clear,
  drawFrame,
  fill,
  useAnimationLoop,
} from "./animations/animate";
import {
  angryAnimation,
  denyAnimation,
  foodAnimation,
  FoodOption,
  foodScreen,
  Gender,
  idleAnimation,
  washAnimation,
} from "./animations/animations";

type Mode = "idle" | "food" | "game" | "status" | "egg";

const options = [
  "food",
  "light",
  "game",
  "medicine",
  "bathroom",
  "status",
  "discipline",
] as const;

const genders: Gender[] = ["girl", "boy"];

const maxNeedLevel = 4;

const getRandomGender = (): Gender =>
  genders[Math.floor(Math.random() * 10) % 2];

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  // General
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [activeOption, setActiveOption] = useState<number>(-1);

  const activeIcon = options[activeOption];

  // Character
  const [gender, setGender] = useState<Gender>(getRandomGender());
  const [hasPoop, setHasPoop] = useState<boolean>(false);
  const [hungryLevel, setHungryLevel] = useState<number>(0);
  const [happyLevel, setHappyLevel] = useState<number>(0);

  const needsAttention = mode !== "egg" && (!hungryLevel || !happyLevel);

  // Lights
  const [lightsOff, setlightsOff] = useState(false);

  // Food
  const [foodOption, setFoodOption] = useState<FoodOption>("meal");

  // Animation
  const [animationLoop, setAnimationLoop] = useState(idleAnimation(gender));
  const [pauseLoop, setPauseLoop] = useState(false);

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      if (ctx.current) ctx.current.imageSmoothingEnabled = false;
    }
  }, []);

  const { setAnimation, currentFrame } = useAnimationLoop(
    ctx.current,
    animationLoop,
    lightsOff,
    setBusy,
    pauseLoop
  );

  const handleA = useCallback(() => {
    if (busy) return;
    switch (mode) {
      case "idle": {
        setActiveOption((curr) => (curr + 1) % options.length);
        break;
      }
      case "food": {
        if (!lightsOff) {
          const newOption: FoodOption =
            foodOption === "meal" ? "snack" : "meal";
          setFoodOption(newOption);
          drawFrame(ctx.current, foodScreen(newOption), lightsOff);
        }
      }
    }
  }, [mode, busy, foodOption, lightsOff]);

  const handleB = useCallback(async () => {
    if (busy) return;
    switch (mode) {
      case "idle": {
        switch (activeIcon) {
          case "food": {
            if (!lightsOff) {
              setFoodOption("meal");
              setMode("food");
              setPauseLoop(true);
              setAnimation([]);
              drawFrame(ctx.current, foodScreen("meal"), lightsOff);
            }
            break;
          }
          case "light": {
            lightsOff ? clear(ctx.current) : fill(ctx.current);
            setlightsOff((current) => !current);
            break;
          }
          case "discipline": {
            setPauseLoop(true);
            setAnimation([]);
            setBusy(true);
            await animate(ctx.current, angryAnimation(gender));
            setBusy(false);
            setPauseLoop(false);
            break;
          }
          case "bathroom": {
            if (currentFrame.current) {
              setPauseLoop(true);
              setAnimation([]);
              setHasPoop(false);
              setBusy(true);
              await animate(ctx.current, washAnimation(currentFrame.current));
              setBusy(false);
              setPauseLoop(false);
            }
            break;
          }
          default: {
            if (activeIcon) {
              setPauseLoop(true);
              setAnimation([]);
              setBusy(true);
              await animate(ctx.current, denyAnimation(gender));
              setBusy(false);
              setPauseLoop(false);
            }
          }
        }
        break;
      }
      case "food": {
        setBusy(true);
        if (foodOption === "snack" || hungryLevel < maxNeedLevel) {
          await animate(
            ctx.current,
            foodAnimation(gender, foodOption),
            lightsOff
          );
          if (foodOption === "meal") {
            setHungryLevel(hungryLevel + 1);
          } else {
            setHappyLevel((level) => Math.min(level + 1, maxNeedLevel));
          }
        } else {
          await animate(ctx.current, denyAnimation(gender));
        }
        setBusy(false);
        drawFrame(ctx.current, foodScreen(foodOption), lightsOff);
      }
    }
  }, [
    mode,
    activeIcon,
    busy,
    lightsOff,
    setAnimation,
    foodOption,
    gender,
    currentFrame,
    hungryLevel,
  ]);

  const handleC = useCallback(() => {
    if (busy || mode === "idle") return;
    setAnimation([]);
    setAnimationLoop(idleAnimation(gender));
    setMode("idle");
    setPauseLoop(false);
  }, [busy, setAnimation, mode, gender]);

  return (
    <div className="App">
      <div className="screen">
        <div className="icon-bar icons-top">
          <div
            className={`icon${activeIcon === "food" ? " active" : ""}`}
            style={{ backgroundImage: `url("${foodIcon}")` }}
          />
          <div
            className={`icon${activeIcon === "light" ? " active" : ""}`}
            style={{ backgroundImage: `url("${lightIcon}")` }}
          />
          <div
            className={`icon${activeIcon === "game" ? " active" : ""}`}
            style={{ backgroundImage: `url("${gameIcon}")` }}
          />
          <div
            className={`icon${activeIcon === "medicine" ? " active" : ""}`}
            style={{ backgroundImage: `url("${medicineIcon}")` }}
          />
        </div>
        <canvas ref={canvas} width={544} height={272} />
        <img className="grid-overlay" src={gridOverlay} alt="" />
        <div className="icon-bar icons-bottom">
          <div
            className={`icon${activeIcon === "bathroom" ? " active" : ""}`}
            style={{ backgroundImage: `url("${bathroomIcon}")` }}
          />
          <div
            className={`icon${activeIcon === "status" ? " active" : ""}`}
            style={{ backgroundImage: `url("${statusIcon}")` }}
          />
          <div
            className={`icon${activeIcon === "discipline" ? " active" : ""}`}
            style={{ backgroundImage: `url("${disciplineIcon}")` }}
          />
          <div
            className={`icon${needsAttention ? " active" : ""}`}
            style={{ backgroundImage: `url("${attentionIcon}")` }}
          />
        </div>
      </div>
      <div className="controls">
        <button id="a" onClick={handleA}>
          A
        </button>
        <button id="b" onClick={handleB}>
          B
        </button>
        <button id="c" onClick={handleC}>
          C
        </button>
      </div>
    </div>
  );
}

export default App;
