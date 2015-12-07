(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Explosion = Asteroids.Explosion = function (object) {
    this.object = object;
    this.game = object.game;
    this.pos = object.pos;
    this.index = 0;
    this.size = object.explosionSize || 25;
    this.radius = object.radius;
  };

  Asteroids.Util.inherits(Explosion, Asteroids.MovingObject);

  Explosion.prototype.move = function () {};

  var sheet = document.createElement("img");
  sheet.src = './assets/explosion_spritesheet.png';

  Explosion.prototype.draw = function (ctx) {
    // var that = this;
    var rows = 9;
    var cols = 9;
    var width = 100;
    var height = 100;

    if (this.index > 81) {
      this.game.remove(this);
    }

    var x = this.index % (cols - 1) * width;
    var y = Math.floor(this.index / (rows - 1)) * height;
    ctx.drawImage(sheet, x, y, 100, 100, this.pos[0] - (this.size / 2), this.pos[1] - (this.size / 2), this.size, this.size);
    this.index++;

  };
})();
