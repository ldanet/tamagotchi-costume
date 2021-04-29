import coroutine from "./coroutine";
import Egg from "./Egg";
import Tamagotchi from "./Tamagotchi";

var gameScreen = document.querySelector(".game__screen");
var gameOptions = document.querySelector(".game__options");

var buttonA = document.querySelector(".a");
var buttonB = document.querySelector(".b");
var buttonC = document.querySelector(".c");

var options = [
  "stats",
  "food",
  "toilet",
  "games",
  "connect",
  "discipline",
  "medicine",
  "lights",
  "guestbook",
  "attention",
];

var curr_option = 0;

function show_tama_options() {
  document.getElementById("tama_options").style.display = "block";
}
function init_option() {
  document
    .getElementById("tama_options_" + options[curr_option])
    .classList.add("tama_options_active");
}

class Game {
  egg: Egg;
  tamagotchi: Tamagotchi;
  started: boolean;
  paused: boolean;
  optionsVisible: boolean;
  userEvents: Array<() => any>;

  constructor(canvas: HTMLCanvasElement) {
    this.egg = new Egg(canvas);
    this.tamagotchi = new Tamagotchi(canvas);
    this.started = false;
    this.paused = false; // flag to disable button presses during animations
    this.optionsVisible = false;
    this.userEvents = [];

    this.start = this.start.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.isPending = this.isPending.bind(this);
    this.loop = this.loop.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
  }

  init() {
    buttonA.addEventListener("click", () => {
      if (game.paused) {
        return;
      }
      if (game.started) {
        // game.showOptions();
        move_option("left");
      }
    });

    buttonB.addEventListener("click", () => {
      if (game.paused) {
        return;
      }
      if (!game.started) {
        game.start();
      }
      if (game.started) {
        if (options[curr_option] == "food") {
          game.showFoodOptions();
        } else {
          displayDebugMsg(
            "Action for '" + options[curr_option] + "' not yet implemented"
          );
        }
      }
    });

    buttonC.addEventListener("click", () => {
      if (game.paused) {
        return;
      }
      if (game.started) {
        move_option("right");
      }
    });
  }

  start() {
    this.paused = true;
    show_tama_options();
    coroutine(function* () {
      yield* this.egg.hatch();
      yield this.egg.delay(500);
    }).then(() => {
      this.paused = false;
      this.started = true;
      init_option();
      this.startLoop();
    });
  }

  isPending() {
    return this.userEvents.length;
  }

  startLoop() {
    coroutine(this.loop());
  }

  loop() {
    const { isPending, userEvents } = this;

    return function* loop() {
      let idle = this.tamagotchi.idle();
      let done = false;

      while (this.started) {
        if (isPending()) {
          const event = userEvents.shift();
          idle.return();
          yield this.tamagotchi.reset;
          yield* event();
        }

        while (!done && !isPending()) {
          const next = idle.next();
          done = next.done;
          yield next.value;
        }

        idle = this.tamagotchi.idle();
        done = false;
      }
    };
  }

  showOptions() {
    this.optionsVisible = true;
    gameOptions.classList.add("visible");
    const options = gameOptions.children as HTMLCollection;
    (options.item(0) as HTMLDivElement).innerText = "Feed";
    options.item(0).onclick = () => this.showFoodOptions();
    (options.item(1) as HTMLDivElement).innerText = "Play";
  }

  showFoodOptions() {
    this.optionsVisible = true;
    gameOptions.classList.add("visible");
    const options = gameOptions.children;
    options.item(0).innerText = "Burger";
    options.item(0).onclick = () => feed("burger");
    options.item(1).innerText = "Candy";
    options.item(1).onclick = () => feed("candy");
  }

  hideOptions() {
    this.optionsVisible = false;
    gameOptions.classList.remove("visible");
  }
}

export default Game;
