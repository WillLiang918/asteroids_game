(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
    this.enemyShip = this.game.addEnemyShip();
    this.enemyShip = this.game.addMotherShip();
    this.enemyShip = this.game.addFleetShip();
    this.timerId = null;
  };

  GameView.MOVES = {
    // WASD, F
    87: "Up",
    65: "Left",
    83: "Down",
    68: "Right",
    70: "Fire",

    // Arrow keys, space
    38: "Up",
    37: "Left",
    40: "Down",
    39: "Right",
    32: "Fire"

  };

  GameView.prototype.bindKeyHandlers = function () {
    var ship = this.ship;
    var _heldKeys = [];

    $(document).on('keydown', function (e) {
      var code = e.keyCode;
      var valid = (typeof GameView.MOVES[code] !== "undefined");
      if (valid) { e.preventDefault(); }

      if (_heldKeys.indexOf(GameView.MOVES[code]) === -1 && valid) {
        _heldKeys.push(GameView.MOVES[code]);
      }
      ship.power(ship, _heldKeys);
    });

    $(document).on('keyup', function (e) {
      var code = GameView.MOVES[e.keyCode],
          idx = _heldKeys.indexOf(code);
      if (idx !== -1) {
        _heldKeys.splice(idx, 1);
      }
      ship.isMoving(ship, _heldKeys);
    });
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.bindKeyHandlers();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.animate = function(time){
    var delta = time - this.lastTime;


    // if (this.game.health <= 0) {
    //   this.ctx.clearRect(0, 0, Asteroids.Game.DIM_X, Asteroids.Game.DIM_Y);
    //   this.ctx.fillStyle = Asteroids.Game.BG_COLOR;
    //   this.stop();
    // } else {
      requestAnimationFrame(this.animate.bind(this));
      this.game.step(delta);
      this.game.draw(this.ctx);

      this.lastTime = time;

  },

  GameView.prototype.stop = function () {
    console.log("Hi");
    clearInterval(this.game);
  };
})();
