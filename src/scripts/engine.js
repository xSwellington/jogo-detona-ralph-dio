const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#timeLeft"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    gameOverContainer: document.querySelector(".gameover-overlay"),
    gameOverScore: document.querySelector("#gameover-score"),
  },
  values: {
    scoreInterval: 10,
    enemyId: null,
    timeLeft: 150,
    score: 0,
    lives: 5,
    gameVelocity: 2000,
    timeId: null,
    gameTime: null,
    audio: {
      gameover: {
        obj: new Audio("/src/audios/gameover.wav"),
      },
      hit: { obj: new Audio("/src/audios/hit.mp3"), volume: 0.2 },
    },
    speedInc: 75,
  },
};

function playSound(audioId) {
  const { obj, volume } = state.values.audio[audioId];
  if (obj) {
    obj.volume = volume ?? 1.0;
    obj.play();
  }
}

function showGameOverScreen(toogle) {
  state.view.gameOverScore.textContent = state.values.score;
  state.view.gameOverContainer.style.display = toogle ? "flex" : "none";
}

function gameOver() {
  showGameOverScreen(true);
  playSound("gameover");
  removeListenerHitBox();
  clearInterval(state.values.timeId);
  clearInterval(state.values.gameTime);
  enemyId = null;
  gameTime = null;
}

function countDown() {
  if (state.values.timeLeft <= 0) {
    gameOver();
  } else {
    state.values.timeLeft--;
    state.view.timeLeft.textContent = state.values.timeLeft;
  }
}

function randomSquare() {
  state.view.squares.forEach((square) => square.classList.remove("enemy"));
  const randomNumber = Math.floor(Math.random() * state.view.squares.length);
  const randomSquare = state.view.squares[randomNumber];
  state.values.enemyId = randomSquare.id;
  randomSquare.classList.add("enemy");
}

function refreshSpeed() {
  let { gameVelocity, score, scoreInterval, speedInc } = state.values;
  let changed = false;
  if (gameVelocity > 250 && score >= scoreInterval) {
    console.log(novoIntervalo);
    if (novoIntervalo > scoreInterval) {
      gameVelocity -= (novoIntervalo / scoreInterval) * speedInc;
      state.values.scoreInterval = novoIntervalo;
      if (gameVelocity < 250) gameVelocity = 250;
      state.values.gameVelocity = gameVelocity;
      changed = true;
    }
  }

  if (changed) {
    clearInterval(state.values.timeId);
    moveEnemy();
  }
}

function checkHitElement({ target }) {
  const id = target.id;
  playSound("hit");
  if (state.values.enemyId === id) {
    state.values.enemyId = null;
    state.values.score++;
    state.view.score.textContent = state.values.score;
    refreshSpeed();
  } else {
    state.values.lives--;
    state.view.lives.textContent = state.values.lives;
    if (state.values.lives <= 0) gameOver();
  }
}

function removeListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.removeEventListener("mousedown", checkHitElement);
  });
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", checkHitElement);
  });
}

function moveEnemy() {
  state.values.timeId = setInterval(randomSquare, state.values.gameVelocity);
}

function init() {
  state.values.gameTime = setInterval(countDown, 1000);
  state.view.score.textContent = state.values.score;
  state.view.lives.textContent = state.values.lives;
  addListenerHitBox();
  moveEnemy();
}

init();
