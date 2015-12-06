(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MotherShip = Asteroids.MotherShip = function (options) {
    options.radius = MotherShip.RADIUS;
    options.health = 1000;
    options.explosionSize = 300;
    options.distance = 600;
    options.speed =  1 / 50;

    Asteroids.EnemyShip.call(this, options);
  };

  MotherShip.RADIUS = 100;
  MotherShip.sprite = new Image();

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
      this.angle %= Math.PI * 2;
    }

    // // this.angle = Math.atan(thetaY / thetaX);
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    MotherShip.sprite.src = './assets/boss.png';

    ctx.drawImage(MotherShip.sprite, 0, 0, 230, 336, -115, -168, 230, 336);

    ctx.restore();

    var canFire = Math.random(1);
    if (canFire < 0.02) {
      this.fireBullet();
    }

    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.arc(
      this.pos[0] + Math.sin(this.angle/180 * Math.PI) * 8,
      this.pos[1] - Math.cos(this.angle/180 * Math.PI) * 8,
      this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
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

  MotherShip.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.health = 10000;
    this.game.addMotherShip();
  };
})();
