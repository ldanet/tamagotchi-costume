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
import { animate, clear, fill } from "./animations/animate";
import { foodAnimation } from "./animations/animations";

type Mode = "idle" | "food" | "light" | "status";

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
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const [busy, setBusy] = useState(false);
  const [lightsOff, setlightsOff] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [activeOption, setActiveOption] = useState<number>(0);
  const [needsAttention, setNeedsAttention] = useState<boolean>(false);

  const activeIcon = options[activeOption];
  console.log("activeIcon: ", activeIcon);

  useEffect(() => {
    if (canvas.current) {
      context.current = canvas.current.getContext("2d");
      if (context.current) context.current.imageSmoothingEnabled = false;
    }
  }, []);

  const handleA = useCallback(() => {
    if (busy) return;
    if (mode === "idle") {
      setActiveOption((curr) => (curr + 1) % options.length);
    }
  }, [mode, busy]);

  const handleB = useCallback(async () => {
    if (busy) return;
    if (mode === "idle") {
      if (activeIcon === "food" && !lightsOff) {
        setBusy(true);
        await animate(context.current, foodAnimation("meal"), lightsOff);
        setBusy(false);
      }
      if (activeIcon === "light") {
        if (!context.current) return;
        lightsOff ? clear(context.current) : fill(context.current);
        setlightsOff((current) => !current);
      }
    }
  }, [mode, activeIcon, busy, lightsOff]);

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
        <button id="c">C</button>
      </div>
    </div>
  );
}

export default App;
