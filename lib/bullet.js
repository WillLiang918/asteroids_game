(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function (options) {
    options.radius = Bullet.RADIUS;

    Asteroids.MovingObject.call(this, options);
  };

  Bullet.RADIUS = 2;
  Bullet.SPEED = 15;

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);

  var sheet = document.createElement("img");
  sheet.src = './assets/explosion_spritesheet.png';

  Bullet.prototype.collideWith = function (otherObject) {
    var explosion = new Asteroids.Explosion(this);
    var explosionShip = new Asteroids.Explosion(otherObject);

    if (otherObject instanceof Asteroids.Bullet && this.color == "red" && otherObject.color == "orange") {
      this.game.addExplosion(explosion);
      this.remove();
      otherObject.remove();
    }

    if (otherObject instanceof Asteroids.Ship && !(otherObject instanceof Asteroids.EnemyShip) && this.color == "red") {
      this.remove();
      this.game.addExplosion(explosion);
      if (this.game.shields > 10) {
        this.game.shields -= 10;
      } else {
        this.game.health -= 10;
        this.game.shields = 0;
      }
    }

    if (otherObject instanceof Asteroids.FleetShip && this.color == "red") {
      this.remove();
      this.game.addExplosion(explosion);
      otherObject.health -= 10;
      if (otherObject.health <= 0) {
        this.game.addExplosion(explosionShip);
        otherObject.relocate();
      }
    }

    if (otherObject instanceof Asteroids.EnemyShip && this.color == "orange") {
      this.remove();
      this.game.addExplosion(explosion);
      otherObject.health -= 10;
      if (otherObject.health <= 0) {
        this.game.score += 50;
        this.game.addExplosion(explosionShip);
        otherObject.relocate();
      }
    }

    // if (otherObject instanceof Asteroids.MotherShip && this.color == "orange") {
    //   this.remove();
    //   this.game.addExplosion(explosion);
    //   otherObject.health -= 10;
    //   if (otherObject.health <= 0) {
    //     this.game.score += 50;
    //     this.game.addExplosion(explosionShip);
    //     otherObject.relocate();
    //   }
    // }

    if (otherObject instanceof Asteroids.Asteroid) {
      this.game.addExplosion(explosion);
      this.remove();
      if (this.color == "orange") {
        this.game.score += 10;
      }
      otherObject.remove();
    }
  };

  Bullet.prototype.isWrappable = false;
})();
