(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var EnemyShip = Asteroids.EnemyShip = function (options) {
    Asteroids.AIShip.call(this, options);
  };

  EnemyShip.sprite = new Image();

  Asteroids.Util.inherits(EnemyShip, Asteroids.AIShip);

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
      // this.game.addEnemyShip();
    } else if ( this.game.score > 1000 && this.game.enemyShips.length < 3) {
      this.game.addEnemyShip();
    } else if ( this.game.score > 500 && this.game.enemyShips.length < 2) {
      this.game.addFleetShip();
      this.game.addEnemyShip();
    }
  };
})();
