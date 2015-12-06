(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var AIShip = Asteroids.AIShip = function (options) {
    options.radius = options.radius || AIShip.RADIUS;
    options.vel = options.vel || [0, 0];

    this.angle = 0;
    this.bulletColor = options.bulletColor || "red";
    this.health = options.health || 50;
    this.explosionSize = options.explosionSize || 60;

    Asteroids.MovingObject.call(this, options);
  };

  AIShip.RADIUS = 25;
  Asteroids.Util.inherits(AIShip, Asteroids.Ship);

  AIShip.prototype.draw = function (ctx) {
    var thetaX = this.pos[0] - this.game.ships[0].pos[0];
    var thetaY = this.pos[1] - this.game.ships[0].pos[1];
    var radians = Math.atan2(thetaY, thetaX);
    var delta = radians - this.angle;
    var delta_abs = Math.abs(delta);
    if (delta) {

      // - 90 degrees in radians
      this.angle += (delta - (Math.PI/2));
      this.angle %= Math.PI * 2;
    }

    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    AIShip.sprite.src = './assets/enemyship1.png';
    ctx.drawImage(AIShip.sprite, 0, 0, 80, 45, -30, -15, 60, 30);

    ctx.restore();

    var canFire = Math.random(1);
    if (canFire < 0.01) {
      this.fireBullet();
    }
  };

  AIShip.prototype.fireBullet = function () {
    var bulletVel = [
      this.vel[0] + Math.sin(this.angle) * 10,
      this.vel[1] - Math.cos(this.angle) * 10
    ];

    var angleRight = this.angle + (Math.PI/60);
    var angleLeft = this.angle - (Math.PI/60);

    var bulletVelSpreadRight = [
      this.vel[0] + Math.sin(angleRight) * 10,
      this.vel[1] - Math.cos(angleRight) * 10
    ];

    var bulletVelSpreadLeft = [
      this.vel[0] + Math.sin(angleLeft) * 10,
      this.vel[1] - Math.cos(angleLeft) * 10
    ];

    var bullet = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVel,
      color: this.bulletColor,
      game: this.game
    });

    var bullet2 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle) * 10),
        (this.pos[1] + Math.sin(this.angle) * 10)
      ],
      vel: bulletVel,
      color: this.bulletColor,
      game: this.game
    });

    var bullet3 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle) * 10),
        (this.pos[1] - Math.sin(this.angle) * 10)
      ],
      vel: bulletVel,
      color: this.bulletColor,
      game: this.game
    });

    var bulletRight = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVelSpreadRight,
      color: this.bulletColor,
      game: this.game
    });

    var bulletLeft = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVelSpreadLeft,
      color: this.bulletColor,
      game: this.game
    });

    switch (true) {
      case this.game.score > 750:
        this.game.add(bullet2);
        this.game.add(bullet3);
        break;
      default:
        this.game.add(bullet);
    }
  };

  AIShip.prototype.move = function (delta) {

    var dist = Asteroids.Util.dist(this.pos, this.game.ships[0].pos);
    if (dist > 300) {
      this.vel[0] += Math.sin(this.angle) * (2 / 20);
      this.vel[1] -= Math.cos(this.angle) * (2 / 20);
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

  AIShip.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.health = 100;
    if ( this.game.score > 1500 && this.game.enemyShips.length < 4) {
      this.game.addMotherShip();
      this.game.addAIShip();
    } else if ( this.game.score > 1000 && this.game.enemyShips.length < 3) {
      this.game.addAIShip();
      this.game.addFleetShip();
    } else if ( this.game.score > 50 && this.game.enemyShips.length < 2) {
      this.game.addAIShip();
    }
  };
})();
