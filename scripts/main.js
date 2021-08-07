import ShooterGame from "./Game.js";
import { Player, Rect, Projectile, Explode } from "./Objects.js";

window.requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || window.webkitRequestAnimationFrame;

// ELs
var playerHealthEL = document.querySelector(".player-health");
var enemyHealthEL = document.querySelector(".enemy-health");
var playerAmmoEL = document.querySelector(".ammo");
var gameStatEl = document.querySelector(".stat");
var gameStatTitleEl = document.querySelector("#stat-title");
var btnNext = document.querySelector("#next");
btnNext.style.display = "none";

var player, enemy, enemyProjectileConfig, randomArY, randomArX, playerProjectileConfig;
var bg, bg2;

// Game
var Game = new ShooterGame("#game-scene");
Game.init();
Game.install(Game.getLevel(), init);

function init() {
  // Player
  const playerImg = new Image();
  playerImg.src = Game.RES.PLAYER;
  const playerConfig = {
    image: playerImg,
    type: "sprite"
  };
  player = new Player(playerConfig);
  player.setDim(110, 110);
  player.setPos(40, Game.CONFIG.CANVAS.H2 - player.getCentreY());

  // Enemy
  const enemyImg = new Image();
  enemyImg.src = Game.RES.ENEMY;
  const enemyConfig = {
    image: enemyImg,
    type: "sprite"
  };
  enemy = new Player(enemyConfig);
  enemy.setDim(110, 110);
  enemy.setPos(Game.CONFIG.CANVAS.WIDTH - enemy.getWidth() - 30, Game.CONFIG.CANVAS.H2 - enemy.getCentreY());

  // Projectile
  const playerProjectileImage = new Image();
  playerProjectileImage.src = Game.RES.PBULL;
  playerProjectileConfig = {
    type: "sprite",
    image: playerProjectileImage,
    r: 25
  };

  // Projectile
  const enemyProjectileImage = new Image();
  enemyProjectileImage.src = Game.RES.EBULL;
  enemyProjectileConfig = {
    type: "sprite",
    image: enemyProjectileImage,
    r: 25
  };

  // BG
  const bgImage = new Image();
  bgImage.src = Game.RES.BG;
  const bgConfig = {
    type: "sprite",
    image: bgImage
  }
  bg = new Rect(bgConfig);
  bg.setDim(Game.CONFIG.CANVAS.WIDTH, Game.CONFIG.CANVAS.HEIGHT);
  bg.setPos(0, 0);

  // BG 2
  const bgImage2 = new Image();
  bgImage2.src = Game.RES.BG;
  bg2 = new Rect(bgConfig);
  bg2.setDim(Game.CONFIG.CANVAS.WIDTH, Game.CONFIG.CANVAS.HEIGHT);
  bg2.setPos(Game.CONFIG.CANVAS.WIDTH, 0);

  //Enemy ))
  randomArX = Game.CONFIG.CANVAS.W2;
  randomArY = Game.CONFIG.CANVAS.H2 + enemy.getCentreY();
  setInterval(() => {
    randomArX = getRandomInt(Game.CONFIG.CANVAS.W2, Game.CONFIG.CANVAS.WIDTH - enemy.getWidth() - 10);
    randomArY = getRandomInt(enemy.getHeight() + 10, Game.CONFIG.CANVAS.HEIGHT - enemy.getHeight() - 60);
  }, 2500);
  setInterval(() => {
    var projectile = new Projectile(enemyProjectileConfig);
    projectile.x = enemy.getCentreX();
    projectile.y = enemy.getCentreY();
    projectile.r = 40;
    Game.ARRAYS.enemyProjectilesArray.push(projectile);
  }, 700);

  draw();
}

function nextLevel() {
  if (+Game.getLevel() >= 3) {
    Game.setLevel(3);
    document.location.assign("../win.html");
  } else {
    Game.setLevel(+Game.getLevel() + 1);
    document.location.reload();
  }
}

function draw() {
  if (Game.CONFIG.IS_ACTIVE) {
    updateEls();
    Game.clearScene();
    updateBG();
    updateEnemy();
    updatePlayer();
    Game.ARRAYS.explodesArray.forEach((explode) => {
      explode.draw(Game.context);
    });
    window.requestAnimationFrame(draw);
  }
  else {
    gameStatEl.style.display = "flex";
    if (Game.CONFIG.STATE === Game.STATES[0]) {
      updateStateEls("You Are Killed By " + enemy.name + "!");
    } else if (Game.CONFIG.STATE === Game.STATES[1]) {
      btnNext.style.display = "block";
      updateStateEls("Woow You Win!");
    } else if (Game.CONFIG.STATE === Game.STATES[2]) {

    } else if (Game.CONFIG.STATE === Game.STATES[3]) {
      updateStateEls("No Ammo! Lets Play Again.");
    } else {
      updateStateEls("Unexpected State... Are you hacker?");
    }
  }
}

function updateStateEls(_title = "") {
  gameStatTitleEl.innerHTML = _title;
}

function updateEls() {
  enemyHealthEL.textContent = enemy.health + "%";
  enemyHealthEL.style.width = enemy.health + "px";
  playerHealthEL.textContent = player.health + "%";
  playerHealthEL.style.width = player.health + "px";
  playerAmmoEL.textContent = Game.CONFIG.OBJECTS.BULLETS;
  if (enemy.health <= 50) {
    enemyHealthEL.style.background = "#c00";
  }
  if (enemy.health <= 0) {
    enemy.health = 0;
    Game.CONFIG.IS_ACTIVE = false;
    Game.CONFIG.STATE = Game.STATES[1];
  }
  if (player.health <= 50) {
    playerHealthEL.style.color = "#fff";
    playerHealthEL.style.background = "#c00";
  }
  if (player.health <= 0) {
    player.health = 0;
    Game.CONFIG.IS_ACTIVE = false;
    Game.CONFIG.STATE = Game.STATES[0];
  }
}

function updateEnemy() {
  if (enemy.x != randomArX) {
    enemy.x -= enemy.getAbsDistSimX(randomArX) / 50;
  }
  if (enemy.y != randomArY) {
    enemy.y -= enemy.getAbsDistSimY(randomArY) / 50;
  }
  Game.ARRAYS.enemyProjectilesArray.forEach((projectile, index) => {
    projectile.velocity.x += 0.1;
    projectile.x -= projectile.velocity.x;
    if (projectile.collideWith(player)) {
      boom(projectile.x, projectile.y);
      player.health -= 10;
      Game.ARRAYS.enemyProjectilesArray.splice(index, 1);
    }
    projectile.draw(Game.context);
  });
  enemy.draw(Game.context);
}

function updateBG() {
  bg.draw(Game.context);
  bg.x -= 1;
  bg2.draw(Game.context);
  bg2.x -= 1;
  if (bg.getRight() <= 0) {
    bg.x = Game.CONFIG.CANVAS.WIDTH;
  }
  if (bg2.getRight() <= 0) {
    bg2.x = Game.CONFIG.CANVAS.WIDTH;
  }
}

function updatePlayer() {
  Game.ARRAYS.projectilesArray.forEach((projectile, index) => {
    projectile.draw(Game.context);
    projectile.update();
    if (projectile.collideWith(enemy)) {
      enemy.health -= 3;
      boom(projectile.x, projectile.y)
      Game.ARRAYS.projectilesArray.splice(index, 1);
    }
  })
  player.draw(Game.context);
  if (ShooterGame.Mouse.isActive && ShooterGame.Mouse.x <= Game.CONFIG.CANVAS.W2 / 2) {
    var src = ShooterGame.Mouse;
    if (player.getCentreX() != src.x) {
      player.x -= (player.w * 0.5 + player.getAbsDistX(src)) / 12;
    }
    if (player.getCentreY() != src.y) {
      player.y -= (player.h * 0.5 + player.getAbsDistY(src)) / 12;
    }
  }
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function boom(_x, _y) {
  for (var d = 0; d <= 40; d++) {
    var vx = getRandomFloat(-1.5, 1.5);
    var vy = getRandomFloat(-1.5, 1.5);
    var ex = new Explode();
    ex.velocity.x = vy;
    ex.velocity.y = vx;
    ex.x = _x;
    ex.y = _y;
    ex.color = "#ff00ff"
    ex.r = 2;
    Game.ARRAYS.explodesArray.push(ex);
  }
}

function mouseDownDetected(_event) {
  var x = _event.clientX || _event.touches[0]?.clientX;
  var y = _event.clientY || _event.touches[0]?.clientY;
  ShooterGame.Mouse.x = x;
  ShooterGame.Mouse.y = y;
  ShooterGame.Mouse.isActive = true;

  if (Game.CONFIG.OBJECTS.BULLETS != 0) {
    if (x <= Game.CONFIG.CANVAS.W2 / 2) {
      Game.CONFIG.OBJECTS.BULLETS -= 1;
      if (Game.CONFIG.IS_ACTIVE) {
        const sound = document.createElement("audio");
        sound.src = Game.RES.SHOOT_SOUND;
        sound.preload = 520;
        sound.play();
        sound.onended = () => {
          sound.remove();
        };
      }
      var projectile = new Projectile(playerProjectileConfig),
        projectile2 = new Projectile(playerProjectileConfig);
      projectile.r = 25;
      projectile2.r = 25;
      projectile.setPos(player.x + 10, player.getTop() + 3);
      projectile2.setPos(player.x + 10, player.getBottom() - 22);
      Game.ARRAYS.projectilesArray.push(projectile);
      Game.ARRAYS.projectilesArray.push(projectile2);
    }
  } else {
    Game.CONFIG.IS_ACTIVE = false;
    Game.CONFIG.STATE = Game.STATES[3];
  }
}

function mouseMoveDetected(_ev) {
  ShooterGame.Mouse.isActive = true;
  if (_ev.touches) {
    ShooterGame.Mouse.x = _ev.touches[0].clientX;
    ShooterGame.Mouse.y = _ev.touches[0].clientY;
  } else {
    ShooterGame.Mouse.x = _ev.clientX;
    ShooterGame.Mouse.y = _ev.clientY;
  }
}

function mouseUpDetected() {
  ShooterGame.Mouse.isActive = false;
}

btnNext.onclick = nextLevel;
Game._canvas.onmousemove = mouseMoveDetected;
Game._canvas.ontouchmove = mouseMoveDetected;
Game._canvas.ontouchstart = mouseDownDetected;
Game._canvas.onmousedown = mouseDownDetected;
Game._canvas.onmouseup = mouseUpDetected;