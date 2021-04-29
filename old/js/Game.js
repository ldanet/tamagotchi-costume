var gameScreen = document.querySelector('.game__screen');
var gameOptions = document.querySelector('.game__options');
var canvas = document.querySelector('.animation');
canvas.width = 147;
canvas.height = 147;

class Game {
  constructor() {
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

  start() {
    this.paused = true;
    show_tama_options();
    coroutine(function* () {
      yield* egg.hatch();
      yield egg.delay(500);
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
    const {
      isPending,
      userEvents,
    } = this;

    return function* loop() {
      let idle = tamagotchi.idle();
      let done = false;

      while (game.started) {
        if (isPending()) {
          const event = userEvents.shift();
          idle.return();
          yield tamagotchi.reset;
          yield* event();
        }

        while (!done && !isPending()) {
          const next = idle.next();
          done = next.done;
          yield next.value;
        }

        idle = tamagotchi.idle();
        done = false;
      }
    }
  }

  showOptions() {
    this.optionsVisible = true;
    gameOptions.classList.add('visible');
    const options = gameOptions.children;
    options.item(0).innerText = 'Feed';
    options.item(0).onclick = () => this.showFoodOptions();
    options.item(1).innerText = 'Play';
  }

  showFoodOptions() {
    this.optionsVisible = true;
    gameOptions.classList.add('visible');
    const options = gameOptions.children;
    options.item(0).innerText = 'Burger';
    options.item(0).onclick = () => feed('burger');
    options.item(1).innerText = 'Candy';
    options.item(1).onclick = () => feed('candy');
  }

  hideOptions() {
    this.optionsVisible = false;
    gameOptions.classList.remove('visible');
  }
}
