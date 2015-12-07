(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (options) {
    options.color = Asteroid.COLOR;
    options.pos = options.pos || options.game.randomPosition();
    options.radius = Asteroid.RADIUS;
    options.vel = options.vel || Asteroids.Util.randomVec(Asteroid.SPEED);

    Asteroids.MovingObject.call(this, options);
  };

  Asteroid.COLOR = "#505050";
  Asteroid.RADIUS = 25;
  Asteroid.SPEED = 2;
  Asteroid.sprite = new Image();
  Asteroid.sprite.src = './assets/asteroids00.png';

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.prototype.collideWith = function (otherObject) {
    var explosion = new Asteroids.Explosion(this);
    var explosionShip = new Asteroids.Explosion(otherObject);

    if (otherObject == this.game.ships[0] && !this.game.gameOver) {
      this.game.addExplosion(explosion);
      if (this.game.shields > 20) {
        this.game.shields -= 20;
      } else {
        this.game.shields = 0;
        this.game.health -= 10;
        if (this.game.health <= 0) {
          this.game.health = 0;
          this.game.addExplosion(explosionShip);
          this.game.gameOver = true;
          $("div").addClass("active");
        }
      }
      this.remove();
    }

    if (otherObject instanceof Asteroids.AIShip) {
      this.game.addExplosion(explosion);
      otherObject.health -= 20;
      if (otherObject.health <= 0) {
        this.game.addExplosion(explosionShip);
        otherObject.relocate();
      }
      this.remove();
    }
  };

  Asteroid.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(Math.PI/180);
    ctx.drawImage(Asteroid.sprite, 0, 0, 60, 60, -30, -30, 60, 60);
    ctx.restore();
  };

  // Asteroid.prototype.explode = function () {
  //
  // };
})();
