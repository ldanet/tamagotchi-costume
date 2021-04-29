import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3-timer";
import Egg from "./animations/Egg";
import Tamagotchi from "./animations/Tamagotchi";

import foodIcon from "./icons/food.png";
import lightIcon from "./icons/light.png";
import gameIcon from "./icons/game.png";
import medicineIcon from "./icons/medicine.png";
import bathroomIcon from "./icons/bathroom.png";
import statusIcon from "./icons/status.png";
import disciplineIcon from "./icons/discipline.png";
import attentionIcon from "./icons/attention.png";

import "./App.css";

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
  const egg = useRef<Egg | null>(null);
  const tamagotchi = useRef<Tamagotchi | null>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [activeOption, setActiveOption] = useState<number>(0);
  const [needsAttention, setNeedsAttention] = useState<boolean>(false);
  console.log("activeOption: ", activeOption);

  const activeIcon = options[activeOption];
  console.log("activeIcon: ", activeIcon);

  useEffect(() => {
    if (canvas.current) {
      egg.current = new Egg(canvas.current);
      tamagotchi.current = new Tamagotchi(canvas.current);
    }
  });

  const handleA = useCallback(() => {
    if (mode === "idle") {
      setActiveOption((curr) => (curr + 1) % options.length);
    }
  }, [mode]);

  const handleB = useCallback(() => {
    if (mode === "idle") {
      if (activeIcon === "food") {
        console.log("Food!", tamagotchi.current);
        const feed = tamagotchi.current?.feed("meal");
        const t = d3.timer((elapsed) => {
          if (elapsed > 170) {
            t.stop();
            return;
          }
          feed?.next();
        }, 40);
      }
    }
  }, [mode, activeIcon]);

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
        <canvas ref={canvas} width={960} height={480} />
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
