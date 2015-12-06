(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var EnemyShip = Asteroids.EnemyShip = function (options) {
    this.maxRotateSpeed = options.maxRotateSpeed || (Math.PI / 180);
    this.sprite = new Image();
    this.src = options.src || './assets/enemyship1.png';
    this.width = options.width || 80;
    this.height = options.height || 45;

    Asteroids.AIShip.call(this, options);
  };

  EnemyShip.sprite = new Image();

  Asteroids.Util.inherits(EnemyShip, Asteroids.AIShip);

  EnemyShip.prototype.draw = function (ctx) {
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
    // EnemyShip.sprite.src = './assets/enemyship1.png';
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

    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.arc(
      this.pos[0] + Math.sin(this.angle) * 8,
      this.pos[1] - Math.cos(this.angle) * 8,
      this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  EnemyShip.prototype.fireBullet = function () {
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

  // EnemyShip.prototype.collideWith = function (otherObject) {
  //   var explosion = new Asteroids.Explosion(this);
  //   var explosionShip = new Asteroids.Explosion(otherObject);
  //
  //   if (!(otherObject instanceof Asteroids.EnemyShip)) {
  //     var health = this.game.health;
  //     this.game.shields -= this.health;
  //
  //     if (this.game.shields > this.health) {
  //       this.game.shields -= this.health;
  //     } else {
  //       this.game.addExplosion(explosionShip);
  //       this.game.health -= this.health;
  //       this.game.shields = 0;
  //     }
  //
  //     this.health -= health;
  //     if (this.health <= 0) {
  //       this.game.addExplosion(explosion);
  //       this.relocate();
  //     }
  //   }
  // };

  EnemyShip.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.health = 100;
    if ( this.game.score > 1500 && this.game.enemyShips.length < 4) {
      this.game.addMotherShip();
      this.game.addEnemyShip();
    } else if ( this.game.score > 1000 && this.game.enemyShips.length < 3) {
      this.game.addEnemyShip();
      this.game.addFleetShip();
    } else if ( this.game.score > 50 && this.game.enemyShips.length < 2) {
      this.game.addEnemyShip();
    }
  };
})();
