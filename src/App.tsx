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

type Mode = "idle" | "food" | "game" | "status" | "egg" | "dead";

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

const poopInterval = 8 * 60 * 1000;
const hungerInterval = 2.5 * 60 * 1000;
const happinessInterval = 2.5 * 60 * 1000;

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
  const [isWaitingToPoop, setIsWaitingToPoop] = useState<boolean>(false);
  const [hasPoop, setHasPoop] = useState<boolean>(false);
  const [hungryLevel, setHungryLevel] = useState<number>(0);
  const [happyLevel, setHappyLevel] = useState<number>(0);

  const needsAttention = mode !== "egg" && (!hungryLevel || !happyLevel);

  // Lights
  const [lightsOff, setlightsOff] = useState(false);

  // Food
  const [foodOption, setFoodOption] = useState<FoodOption>("meal");

  // Game
  const [gameRound, setGameRound] = useState<number>(1);
  const gameScore = useRef<number>(0);

  // Status
  const [statusPage, setStatusPage] = useState<number>(0);

  // Animation
  const [animationLoop, setAnimationLoop] = useState(
    idleAnimation(gender, hasPoop)
  );
  const [pauseLoop, setPauseLoop] = useState(false);

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      if (ctx.current) ctx.current.imageSmoothingEnabled = false;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIsWaitingToPoop(true), poopInterval);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setHungryLevel((lvl) => (lvl ? lvl - 1 : lvl)),
      hungerInterval
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setHappyLevel((lvl) => (lvl ? lvl - 1 : lvl)),
      happinessInterval
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  const { setAnimation, currentFrame } = useAnimationLoop(
    ctx.current,
    animationLoop,
    lightsOff,
    setBusy,
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

  // Choose relevant looping animation
  useEffect(() => {
    if (mode === "idle") {
      setAnimation([]);
      setAnimationLoop(idleAnimation(gender, hasPoop));
    }
    if (mode === "game") {
      setAnimation([]);
      setAnimationLoop(gameWaitAnimation(gender, hasPoop));
    }
  }, [gender, hasPoop, mode, setAnimation]);

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
        await animate(ctx.current, happyAnimation(gender, hasPoop));
        gameScore.current++;
      } else {
        await animate(ctx.current, angryAnimation(gender, hasPoop));
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
          await animate(ctx.current, happyAnimation(gender, hasPoop));
          setHappyLevel((lvl) => lvl + 1);
        }
        setMode("idle");
      }
      setGameRound(gameRound + 1);
      setBusy(false);
      setPauseLoop(false);
    },
    [gender, hasPoop, gameRound, gameScore]
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
            await animate(ctx.current, gameStartAnimation(gender, hasPoop));
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
            await animate(ctx.current, angryAnimation(gender, hasPoop));
            setBusy(false);
            setPauseLoop(false);
            break;
          }
          default: {
            if (activeIcon) {
              setPauseLoop(true);
              setAnimation([]);
              setBusy(true);
              await animate(ctx.current, denyAnimation(gender, hasPoop));
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
            foodAnimation(gender, foodOption, hasPoop),
            lightsOff
          );
          if (foodOption === "meal") {
            setHungryLevel(hungryLevel + 1);
          } else {
            setHappyLevel((level) => Math.min(level + 1, maxNeedLevel));
          }
        } else {
          await animate(ctx.current, denyAnimation(gender, hasPoop));
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
  ]);

  const handleC = useCallback(() => {
    if (busy || mode === "idle") return;
    setAnimation([]);
    setMode("idle");
    setPauseLoop(false);
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
