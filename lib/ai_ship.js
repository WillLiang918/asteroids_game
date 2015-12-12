(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var AIShip = Asteroids.AIShip = function (options) {
    options.radius = options.radius || AIShip.RADIUS;
    options.vel = options.vel || [0, 0];

    this.sprite = new Image();
    this.src = options.src || './assets/enemyship1.png';
    this.width = options.width || 80;
    this.height = options.height || 45;
    this.maxRotateSpeed = options.maxRotateSpeed || (Math.PI / 1);

    this.angle = 0;
    this.bulletColor = options.bulletColor || "red";
    this.health = options.health || 50;
    this.distance = options.distance || Asteroids.Game.DIM_X / 3;
    this.speed = options.speed || 0.1;
    this.explosionSize = options.explosionSize || 60;
    this.targetShip = options.targetShip || options.game.ships[0];

    Asteroids.MovingObject.call(this, options);
  };

  AIShip.RADIUS = 25;
  Asteroids.Util.inherits(AIShip, Asteroids.Ship);

  AIShip.prototype.draw = function (ctx) {
    var thetaX = this.pos[0] - this.targetShip.pos[0];
    var thetaY = this.pos[1] - this.targetShip.pos[1];
    var radians = Math.atan2(thetaY, thetaX) - (Math.PI / 2);

    var delta = radians - this.angle;
    var delta_abs = Math.abs(delta);

    if ((delta_abs) > this.maxRotateSpeed) {
      delta = (delta / delta_abs) * this.maxRotateSpeed;
    }

    if (delta) {
      this.angle += (delta);
      this.angle %= Math.PI * 2;
    }

    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    this.sprite.src = this.src;
    ctx.drawImage(
      this.sprite, 0, 0,
      this.width, this.height,
      -(this.width / 2), -(this.height / 2),
      this.width, this.height
    );

    ctx.restore();

    var canFire = Math.random(1);
    if (canFire < 0.01) {
      this.fireBullet();
    }

    // ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    // ctx.beginPath();
    // ctx.arc(
    //   this.pos[0] + Math.sin(this.angle) * 8,
    //   this.pos[1] - Math.cos(this.angle) * 8,
    //   this.radius, 0, 2 * Math.PI, true);
    // ctx.fill();
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

    var dist = Asteroids.Util.dist(this.pos, this.targetShip.pos);
    if (dist > this.distance) {
      this.vel[0] += Math.sin(this.angle) * this.speed;
      this.vel[1] -= Math.cos(this.angle) * this.speed;
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
    // this.pos = this.game.randomPosition();
    // this.vel = [0, 0];
    // this.health = 100;
    // if ( this.game.score > 1500 && this.game.enemyShips.length < 2) {
    //   this.game.addMotherShip();
    //   // if ( this.game.fleetShip.length < 1 ) {
    //   //   this.game.addAIShip();
    //   // }
    // } else if ( this.game.score > 750 && this.game.enemyShips.length < 1) {
    //   // this.game.addFleetShip();
    //   // if ( this.game.fleetShip.length === 0 ) {
    //     this.game.addAIShip();
    //   // }
    // } else if ( this.game.score > 500 && this.game.enemyShips.length < 1) {
    //   this.game.addAIShip();
    // }
  };
})();
