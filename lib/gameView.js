(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
    this.timerId = null;
  };

  GameView.MOVES = {
    "W": [ 0, -1],
    "S": [ 0,  1],
    "A": -25,
    "D": 25,
    " ": "fire"
  };

  GameView.prototype.bindKeyHandlers = function () {
    var ship = this.ship;

    var _heldKeys = [];

    $(document).on('keydown', function (e) {
      var code = e.keyCode;
      code = String.fromCharCode(code);
      var valid = (typeof GameView.MOVES[code] !== "undefined");
      if (_heldKeys.indexOf(code) === -1 && valid) {
        _heldKeys.push(code);
      }
      ship.power(ship, _heldKeys);
    });

    $(document).on('keyup', function (e) {
      var code = String.fromCharCode(e.keyCode),
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

    requestAnimationFrame(this.animate.bind(this));

    this.game.step(delta);
    this.game.draw(this.ctx);

    this.lastTime = time;
  },

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };
})();
