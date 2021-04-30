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
import { clear, fill, useAnimationLoop } from "./animations/animate";
import {
  foodAnimation,
  FoodOption,
  foodScreen,
  idleAnimation,
} from "./animations/animations";

type Mode = "idle" | "food" | "game" | "status";

const options = [
  "none",
  "food",
  "light",
  "game",
  "medicine",
  "bathroom",
  "status",
  "discipline",
] as const;

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [busy, setBusy] = useState(false);
  const [lightsOff, setlightsOff] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [activeOption, setActiveOption] = useState<number>(0);
  const [needsAttention, setNeedsAttention] = useState<boolean>(false);
  const [animationLoop, setAnimationLoop] = useState(idleAnimation);

  const [foodOption, setFoodOption] = useState<FoodOption>("meal");

  const activeIcon = options[activeOption];

  const { setAnimation } = useAnimationLoop(
    ctx.current,
    animationLoop,
    lightsOff,
    setBusy
  );

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      if (ctx.current) ctx.current.imageSmoothingEnabled = false;
    }
  }, []);

  const handleA = useCallback(() => {
    if (busy) return;
    switch (mode) {
      case "idle": {
        setActiveOption((curr) => (curr + 1) % options.length);
        break;
      }
      case "food": {
        const newOption: FoodOption = foodOption === "meal" ? "snack" : "meal";
        setFoodOption(newOption);
        setAnimationLoop([foodScreen(newOption)]);
      }
    }
  }, [mode, busy, foodOption, setAnimationLoop]);

  const handleB = useCallback(async () => {
    if (busy) return;
    switch (mode) {
      case "idle": {
        if (activeIcon === "food" && !lightsOff) {
          setFoodOption("meal");
          setMode("food");
          setAnimation([]);
          setAnimationLoop([foodScreen(foodOption)]);
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
        setAnimation(foodAnimation(foodOption));
      }
    }
  }, [mode, activeIcon, busy, lightsOff, setAnimation, foodOption]);

  const handleC = useCallback(() => {
    if (busy || mode === "idle") return;
    setAnimation([]);
    setAnimationLoop(idleAnimation);
    setMode("idle");
  }, [busy, setAnimation, mode]);

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
