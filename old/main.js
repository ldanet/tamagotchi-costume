var egg = new Egg(canvas);
var tamagotchi = new Tamagotchi(canvas);
var game = new Game(canvas);

// https://www.erikagoering.com/tamagotchi-collection/images/infographic%20sketches-09.png
var options = ["stats", "food", "toilet", "games", "connect", "discipline", "medicine", "lights", "guestbook", "attention"];
var curr_option = 0;

var buttonA = document.querySelector('.a');
var buttonB = document.querySelector('.b');
var buttonC = document.querySelector('.c');

// functionality to allow finger to follow the cursor
document.addEventListener('mousemove', e => {
  document.getElementById('finger').style.left = (e.pageX - 30) + "px";
  document.getElementById('finger').style.top = (e.pageY - 30) + "px";
});

function feed(food) {
  if (game.started) {
    game.userEvents.push(tamagotchi.feed.bind(null, food));
    game.hideOptions();
  }
}

buttonA.addEventListener('click', () => {
  if (game.paused) { return; }
  if (game.started) {
    // game.showOptions();
    move_option('left');
  }
});

buttonB.addEventListener('click', () => {
  if (game.paused) { return; }
  if (!game.started) {
    game.start();
  }
  if (game.started) {
    if (options[curr_option] == "food") {
      game.showFoodOptions();
    } else {
      displayDebugMsg("Action for '" + options[curr_option] + "' not yet implemented");
    }
  }
});

buttonC.addEventListener('click', () => {
  if (game.paused) { return; }
  if (game.started) {
    move_option('right');
  }
});

function show_tama_options() {
  document.getElementById("tama_options").style.display = 'block';
}
function init_option() {
  document.getElementById("tama_options_" + options[curr_option]).classList.add("tama_options_active");
}

function move_option(direction) {
  document.getElementById("tama_options_" + options[curr_option]).classList.remove("tama_options_active");
  if (direction == 'left') {
    curr_option = curr_option - 1;
    if (curr_option < 0) {
      curr_option = options.length - 1;
    }
  } else if (direction == 'right') {
    curr_option = curr_option + 1
    if (curr_option == options.length) {
      curr_option = 0;
    }
  }
  document.getElementById("tama_options_" + options[curr_option]).classList.add("tama_options_active");
}

function displayDebugMsg(message) {
  debug = document.getElementById("debug");
  debug.innerHTML = message;
  debug.style.display = 'block';
  setTimeout(function(){ debug.style.display = 'none'; }, 3000);
}
