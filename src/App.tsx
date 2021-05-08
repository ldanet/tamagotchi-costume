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
  deadAnimation,
  denyAnimation,
  dyingAnimation,
  eggHatchAnimation,
  eggIdleAnimation,
  foodAnimation,
  FoodOption,
  foodScreen,
  gameActionAnimation,
  gameScoreAnimation,
  gameStartAnimation,
  gameWaitAnimation,
  Gender,
  happyAnimation,
  idleAnimation,
  poopAnimation,
  statusScreen,
  washAnimation,
} from "./animations/animations";

type Mode = "idle" | "food" | "game" | "status" | "egg" | "dead" | "sleep";

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

const maxGameRounds = 3;

const directions = ["left", "right"] as const;

const minutes = (n: number) => n * 60 * 1000;

const poopInterval = minutes(8);
const hungerInterval = minutes(4);
const happinessInterval = minutes(5);

const missedCareDelay = minutes(3);

const poopSickDelay = minutes(3);

const deathDelay = minutes(5);

const hatchDelay = 15 * 1000;

const getRandomGender = (): Gender =>
  genders[Math.floor(Math.random() * 10) % 2];

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  // General
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>("egg");
  const [activeOption, setActiveOption] = useState<number>(0);

  const isEggMode = mode === "egg";
  const isLiveMode = mode !== "egg" && mode !== "dead" && mode !== "sleep";
  const activeIcon = isLiveMode && options[activeOption];

  // Character
  const [gender, setGender] = useState<Gender>(getRandomGender());
  const [isWaitingToPoop, setIsWaitingToPoop] = useState(false);
  const [hasPoop, setHasPoop] = useState(false);
  const [isWaitingToDie, setIsWaitingToDie] = useState(false);
  const [hungryLevel, setHungryLevel] = useState<number>(0);
  const [happyLevel, setHappyLevel] = useState<number>(0);
  const [needsAttention, setNeedsAttention] = useState(false);
  const [sick, setSick] = useState(false);

  // Food
  const [foodOption, setFoodOption] = useState<FoodOption>("meal");

  // Lights
  const [lightsOff, setlightsOff] = useState(false);

  // Game
  const [gameRound, setGameRound] = useState<number>(1);
  const gameScore = useRef<number>(0);

  // Status
  const [statusPage, setStatusPage] = useState<number>(0);

  // Animation
  const [animationLoop, setAnimationLoop] = useState(eggIdleAnimation(gender));
  const [pauseLoop, setPauseLoop] = useState(false);

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      if (ctx.current) ctx.current.imageSmoothingEnabled = false;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEggMode) {
      interval = setTimeout(async () => {
        setPauseLoop(true);
        await animate(ctx.current, eggHatchAnimation(gender));
        setMode("idle");
        setPauseLoop(false);
      }, hatchDelay);
    }
    return () => {
      clearTimeout(interval);
    };
  }, [isEggMode, gender]);

  // Poop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMode) {
      interval = setInterval(() => setIsWaitingToPoop(true), poopInterval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isLiveMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMode) {
      interval = setInterval(
        () => setHungryLevel((lvl) => (lvl ? lvl - 1 : lvl)),
        hungerInterval
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [isLiveMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMode) {
      interval = setInterval(
        () => setHappyLevel((lvl) => (lvl ? lvl - 1 : lvl)),
        happinessInterval
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [isLiveMode]);

  useEffect(() => {
    if (happyLevel <= 0) {
      setNeedsAttention(true);
    }
  }, [happyLevel]);

  useEffect(() => {
    if (hungryLevel <= 0) {
      setNeedsAttention(true);
    }
  }, [hungryLevel]);

  useEffect(() => {
    if (hungryLevel > 0 && happyLevel > 0) {
      setNeedsAttention(false);
    }
  }, [hungryLevel, happyLevel]);

  // get sick if left uncared fo for too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (needsAttention && isLiveMode) {
      timeout = setTimeout(() => {
        setNeedsAttention(false);
        setSick(true);
      }, missedCareDelay);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [needsAttention, isLiveMode]);

  // get sick if left with poop for too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hasPoop && isLiveMode) {
      timeout = setTimeout(() => {
        setSick(true);
      }, poopSickDelay);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [hasPoop, isLiveMode]);

  // die if left sick for too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (sick && isLiveMode) {
      timeout = setTimeout(() => {
        setIsWaitingToDie(true);
      }, deathDelay);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [sick, isLiveMode, gender]);

  // die if left sick for too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (sick && isLiveMode) {
      timeout = setTimeout(async () => {}, deathDelay);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [sick, isLiveMode, gender]);

  const { setAnimation, currentFrame } = useAnimationLoop(
    ctx.current,
    animationLoop,
    lightsOff,
    pauseLoop
  );

  // Poop when not busy
  useEffect(() => {
    const poop = async () => {
      setBusy(true);
      setPauseLoop(true);
      setHasPoop(true);
      setAnimation([]);
      setIsWaitingToPoop(false);
      await animate(ctx.current, poopAnimation(gender));
      setBusy(false);
      setPauseLoop(false);
    };
    if (!hasPoop && isWaitingToPoop && mode === "idle" && !busy) {
      poop();
    }
  }, [gender, hasPoop, isWaitingToPoop, mode, busy, setAnimation]);

  // Die when not busy
  useEffect(() => {
    const die = async () => {
      setMode("dead");
      setPauseLoop(true);
      await animate(ctx.current, dyingAnimation(gender));
      setPauseLoop(false);
    };
    if (isWaitingToDie && mode === "idle" && !busy) {
      die();
    }
  }, [gender, isWaitingToDie, mode, busy, setAnimation]);

  // Choose relevant looping animation
  useEffect(() => {
    if (mode === "egg") {
      setAnimation([]);
      setAnimationLoop(eggIdleAnimation(gender));
    }
    if (mode === "idle") {
      setAnimation([]);
      setAnimationLoop(idleAnimation(gender, hasPoop, sick));
    }
    if (mode === "game") {
      setAnimation([]);
      setAnimationLoop(gameWaitAnimation(gender, hasPoop, sick));
    }
    if (mode === "dead") {
      setAnimation([]);
      setAnimationLoop(deadAnimation());
    }
  }, [gender, hasPoop, mode, setAnimation, sick]);

  const guessDirection = useCallback(
    async (guess: "left" | "right") => {
      const tamaFacing = directions[Math.floor(Math.random() * 2)];
      const isWin = guess === tamaFacing;
      setBusy(true);
      setPauseLoop(true);
      await animate(
        ctx.current,
        gameActionAnimation(gender, guess, tamaFacing)
      );
      if (isWin) {
        await animate(ctx.current, happyAnimation(gender, hasPoop, sick));
        gameScore.current++;
      } else {
        await animate(ctx.current, angryAnimation(gender, hasPoop, sick));
      }
      if (gameRound >= maxGameRounds) {
        const gameWon = gameScore.current > maxGameRounds / 2;
        await animate(
          ctx.current,
          gameScoreAnimation(
            gender,
            gameScore.current,
            maxGameRounds - gameScore.current
          )
        );
        if (gameWon) {
          await animate(ctx.current, happyAnimation(gender, hasPoop, sick));
          setHappyLevel((lvl) => lvl + 1);
        } else {
          await animate(ctx.current, angryAnimation(gender, hasPoop, sick));
        }
        setMode("idle");
      }
      setGameRound(gameRound + 1);
      setBusy(false);
      setPauseLoop(false);
    },
    [gender, hasPoop, gameRound, gameScore, sick]
  );

  const turnStatusPage = useCallback(
    (direction: "next" | "prev") => {
      const statusScreens = statusScreen(gender, hungryLevel, happyLevel);
      const increment = direction === "next" ? 1 : -1;
      console.log("increment: ", increment);
      const newPage =
        (statusPage + increment + statusScreens.length) % statusScreens.length;
      console.log("statusScreens.length: ", statusScreens.length);
      console.log("statusPage: ", statusPage);
      console.log("newPage: ", newPage);
      setStatusPage(newPage);
      drawFrame(ctx.current, statusScreens[newPage]);
    },
    [gender, hungryLevel, happyLevel, statusPage]
  );

  const reset = useCallback(() => {
    const newGender = getRandomGender();
    // General
    setBusy(false);
    setMode("egg");
    setActiveOption(0);

    // Character
    setGender(newGender);
    setIsWaitingToPoop(false);
    setHasPoop(false);
    setIsWaitingToDie(false);
    setHungryLevel(0);
    setHappyLevel(0);
    setNeedsAttention(false);
    setSick(false);

    // Food
    setFoodOption("meal");

    // Lights
    setlightsOff(false);

    // Game
    setGameRound(1);

    // Status
    setStatusPage(0);

    // Animation
    setAnimationLoop(eggIdleAnimation(newGender));
    setPauseLoop(false);
  }, []);

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
        break;
      }
      case "game": {
        guessDirection("left");
        break;
      }
      case "status": {
        turnStatusPage("prev");
        break;
      }
    }
  }, [mode, busy, foodOption, lightsOff, turnStatusPage, guessDirection]);

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
          case "game": {
            setPauseLoop(true);
            setAnimation([]);
            setMode("game");
            setGameRound(1);
            gameScore.current = 0;
            setBusy(true);
            await animate(
              ctx.current,
              gameStartAnimation(gender, hasPoop, sick),
              lightsOff
            );
            setBusy(false);
            setPauseLoop(false);
            break;
          }
          case "medicine": {
            setPauseLoop(true);
            setAnimation([]);
            setBusy(true);
            if (!sick) {
              await animate(ctx.current, denyAnimation(gender, hasPoop, sick));
            } else {
              await animate(
                ctx.current,
                happyAnimation(gender, hasPoop, false)
              );
              setSick(false);
              setHungryLevel((lvl) => lvl - 1);
              setHappyLevel((lvl) => lvl - 1);
            }

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
              if (hasPoop) {
                await animate(ctx.current, happyAnimation(gender, false, sick));
              }
              setBusy(false);
              setPauseLoop(false);
            }
            break;
          }
          case "status": {
            if (!lightsOff) {
              const screen = statusScreen(gender, hungryLevel, happyLevel)[0];
              setMode("status");
              setStatusPage(0);
              setPauseLoop(true);
              setAnimation([]);
              drawFrame(ctx.current, screen, false);
            }
            break;
          }
          case "discipline": {
            setPauseLoop(true);
            setAnimation([]);
            setBusy(true);
            await animate(ctx.current, angryAnimation(gender, hasPoop, sick));
            setBusy(false);
            setPauseLoop(false);
            break;
          }
          default: {
            if (activeIcon) {
              setPauseLoop(true);
              setAnimation([]);
              setBusy(true);
              await animate(ctx.current, denyAnimation(gender, hasPoop, sick));
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
            foodAnimation(gender, foodOption, hasPoop, sick),
            lightsOff
          );
          if (foodOption === "meal") {
            setHungryLevel(Math.max(hungryLevel, 0) + 1);
          } else {
            setHappyLevel((level) =>
              Math.min(Math.max(level, 0) + 1, maxNeedLevel)
            );
          }
        } else {
          await animate(ctx.current, denyAnimation(gender, hasPoop, sick));
        }
        setBusy(false);
        drawFrame(ctx.current, foodScreen(foodOption), lightsOff);
        break;
      }
      case "game": {
        guessDirection("right");
        break;
      }
      case "status": {
        turnStatusPage("next");
        break;
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
    turnStatusPage,
    happyLevel,
    hasPoop,
    guessDirection,
    sick,
  ]);

  const handleC = useCallback(() => {
    if (busy || mode === "idle") return;
    if (mode === "dead") {
      reset();
    } else {
      setAnimation([]);
      setMode("idle");
      setPauseLoop(false);
    }
  }, [busy, setAnimation, mode, reset]);

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
            className={`icon${isLiveMode && needsAttention ? " active" : ""}`}
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
