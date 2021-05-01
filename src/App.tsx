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
  foodAnimation,
  FoodOption,
  foodScreen,
  Gender,
  idleAnimation,
} from "./animations/animations";

type Mode = "idle" | "food" | "game" | "status";

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
  const [needsAttention, setNeedsAttention] = useState<boolean>(false);

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

  const { setAnimation } = useAnimationLoop(
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
        if (activeIcon === "food" && !lightsOff) {
          setFoodOption("meal");
          setMode("food");
          setPauseLoop(true);
          setAnimation([]);
          drawFrame(ctx.current, foodScreen("meal"), lightsOff);
        }
        if (activeIcon === "light") {
          if (!ctx.current) return;
          lightsOff ? clear(ctx.current) : fill(ctx.current);
          setlightsOff((current) => !current);
        }
        break;
      }
      case "food": {
        setBusy(true);
        await animate(
          ctx.current,
          foodAnimation(gender, foodOption),
          lightsOff
        );
        setBusy(false);
        drawFrame(ctx.current, foodScreen("meal"), lightsOff);
      }
    }
  }, [mode, activeIcon, busy, lightsOff, setAnimation, foodOption, gender]);

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
