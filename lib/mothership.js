(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  function randomColor() {
    var hexDigits = "0123456789ABCDEF";

    var color = "#";
    for (var i = 0; i < 3; i ++) {
      color += hexDigits[Math.floor((Math.random() * 16))];
    }
    return color;
  }

  var MotherShip = Asteroids.MotherShip = function (options) {
    options.radius = MotherShip.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    this.moving = false;
    this.turnRight = false;
    this.turnLeft = false;
    this.upgrade = 0;
    this.angle = 0;
    this.health = 10000;
    this.explosionSize = 300;

    Asteroids.MovingObject.call(this, options);
  };

  MotherShip.RADIUS = 100;
  MotherShip.sprite = new Image();
  MotherShip.turretSprite = new Image();

  Asteroids.Util.inherits(MotherShip, Asteroids.EnemyShip);

  MotherShip.prototype.draw = function (ctx) {
    var thetaX = this.pos[0] - this.game.ships[0].pos[0];
    var thetaY = this.pos[1] - this.game.ships[0].pos[1];
    var radians = Math.atan2(thetaY, thetaX) - (Math.PI / 2);

    var delta = (radians - this.angle);
    var delta_abs = Math.abs(delta);
    if ((delta_abs) > Math.PI / 2700) {
      delta = (delta / delta_abs) * (Math.PI / 2700);
    }
    if (delta) {
      // - 90 degrees in radians
      this.angle += (delta);
      // - (Math.random() / 5) + Math.random() / 10);
      this.angle %= Math.PI * 2;
    }

    // // this.angle = Math.atan(thetaY / thetaX);
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    MotherShip.sprite.src = './assets/boss.png';

    ctx.drawImage(MotherShip.sprite, 0, 0, 230, 336, -115, -168, 230, 336);

    ctx.restore();

    var random = Math.random(1);
    if (random < 0.02) {
      this.fireBullet();
    }
  };

  MotherShip.prototype.fireBullet = function () {
    var bulletVel = [
      this.vel[0] + Math.sin(this.angle) * 10,
      this.vel[1] - Math.cos(this.angle) * 10
    ];

    var bullet = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.sin(this.angle) * 30),
        (this.pos[1] - Math.cos(this.angle) * 30)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet2 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle) * 20),
        (this.pos[1] + Math.sin(this.angle) * 20)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet4 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle) * 10),
        (this.pos[1] + Math.sin(this.angle) * 10)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet6 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle) * 80),
        (this.pos[1] + Math.sin(this.angle) * 80)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet8 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle) * 75),
        (this.pos[1] + Math.sin(this.angle) * 75)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet3 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle) * 20),
        (this.pos[1] - Math.sin(this.angle) * 20)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet5 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle) * 80),
        (this.pos[1] - Math.sin(this.angle) * 80)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet7 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle) * 10),
        (this.pos[1] - Math.sin(this.angle) * 10)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    var bullet9 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle) * 75),
        (this.pos[1] - Math.sin(this.angle) * 75)
      ],
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    this.game.add(bullet);
    this.game.add(bullet2);
    this.game.add(bullet3);
    this.game.add(bullet4);
    this.game.add(bullet5);
    this.game.add(bullet6);
    this.game.add(bullet7);
    this.game.add(bullet8);
    this.game.add(bullet9);
  };

  MotherShip.prototype.collideWith = function (otherObject) {
    var explosion = new Asteroids.Explosion(otherObject);

    if (otherObject instanceof Asteroids.Ship) {
      this.game.addExplosion(explosion);
      if (this.game.shields > 30) {
        this.game.shields -= 30;
      } else {
        this.game.health -= 30;
        this.game.shields = 0;
      }
    }

    if (otherObject instanceof Asteroids.FleetShip) {
      this.game.addExplosion(explosion);
      otherObject.relocate();
    }
  };

  MotherShip.prototype.power = function (ship, held_keys) {
  };

  MotherShip.prototype.isMoving = function (ship, held_keys) {
  };

  MotherShip.prototype.move = function (delta) {

    var dist = Asteroids.Util.dist(this.pos, this.game.ships[0].pos);
    if (dist > 600) {
      this.vel[0] += Math.sin(this.angle) * (2 / 100);
      this.vel[1] -= Math.cos(this.angle) * (2 / 100);
    }

    var velX = this.vel[0] * delta/20;
    var velY = this.vel[1] * delta/20;

    this.pos = [(this.pos[0] + velX) , (this.pos[1] + velY)];

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }
  };

  MotherShip.prototype.friction = function () {
    this.vel[0] = this.vel[0] * 0.97;
    this.vel[1] = this.vel[1] * 0.97;
  };

  MotherShip.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.health = 10000;
    this.game.addMotherShip();
  };
})();