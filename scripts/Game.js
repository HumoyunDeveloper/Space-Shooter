export default class ShooterGame {
  static Mouse = {
    x: undefined,
    y: undefined,
    isActive: false
  };
  constructor(_canvas) {
    this._canvas = document.querySelector(_canvas);

    this.ARRAYS = {
      projectilesArray: [],
      enemyProjectilesArray: [],
      explodesArray: []
    };
    this.RES = {
      ENEMY: "",
      PLAYER: "",
      EBULL: "",
      PBULL: "",
      BG: "",
      SHOOT_SOUND: "../res/sounds/sound.wav"
    };

    this.STATES = ["KILLED", "WON", "EQUAL", "NO-AMMO", "PL"];
    this.context = null;
    this.CONFIG = {
      STATE: this.STATES[4],
      SCORE: 0,
      IS_ACTIVE: true,
      FR: 1000 / 60,

      CANVAS: {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight,
        W2: window.innerWidth / 2,
        H2: window.innerHeight / 2
      },
      OBJECTS: {
        BULLETS: 26,
        ENEMY_HEALTH: 100,
        PLAYER_HEALTH: 100,
        ENEMY_BULLET_SIZE: 10,
        BULLET_SPEED: 4,
        ENEMY_MOVING_SPEED: 5,
      }
    };
    this.animationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
  }

  init() {
    this._canvas.width = this.CONFIG.CANVAS.WIDTH;
    this._canvas.height = this.CONFIG.CANVAS.HEIGHT;
    this.context = this._canvas.getContext("2d");
  }

  clearScene() {
    this.context.clearRect(0, 0, this.CONFIG.CANVAS.WIDTH, this.CONFIG.CANVAS.HEIGHT);
  }

  exportSceneAs(_type = "image/png", _qual = 1) {
    return this.CONFIG.CANVAS.toDataURL(_type, _qual);
  }

  setLevel(_num = 1) {
    localStorage.setItem("level", _num.toString());
  }

  getLevel() {
    return localStorage.getItem("level");
  }

  install(_level, _callback) {
    var level = this.getLevel();
    if (level) {
      fetch("../levels.json").then((resp) => {
        return resp.json();
      }).then((data) => {
        var num = +level;
        var d = 0;
        for (; d < data.data.length; d++) {
          var _obs = data.data[d];
          if (_obs.level == num) {
            this.RES.BG = "data:image/png; base64," + _obs.data.back;
            this.RES.PLAYER = "data:image/png; base64," +_obs.data.player;
            this.RES.ENEMY = "data:image/png; base64," +_obs.data.enemy;
            this.RES.PBULL = "data:image/png; base64," +_obs.data.playerBullet;
            this.RES.EBULL = "data:image/png; base64," +_obs.data.enemyBullet;
            break;
          }
        }
        _callback();
      }).catch(err => console.error(err.message));
    } else {
      this.setLevel(1);
      document.location.reload();
    }
  }
}