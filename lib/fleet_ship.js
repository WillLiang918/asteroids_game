(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var FleetShip = Asteroids.FleetShip = function (options) {
    options.health = 50;
    options.targetShip = options.game.enemyShips[0];
    options.src = './assets/spaceship1.png';
    options.width = 60;
    options.height = 64;

    Asteroids.AIShip.call(this, options);
  };

  FleetShip.sprite = new Image();

  Asteroids.Util.inherits(FleetShip, Asteroids.AIShip);

  FleetShip.prototype.fireBullet = function () {
    var bulletVel = [
      this.vel[0] + Math.sin(this.angle) * 10,
      this.vel[1] - Math.cos(this.angle) * 10
    ];

    var angleRight = this.angle + (Math.PI/18);
    var angleLeft = this.angle - (Math.PI/18);

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
      color: "orange",
      game: this.game
    });

    var bullet2 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle) * 10),
        (this.pos[1] + Math.sin(this.angle) * 10)
      ],
      vel: bulletVel,
      color: "orange",
      game: this.game
    });

    var bullet3 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle) * 10),
        (this.pos[1] - Math.sin(this.angle) * 10)
      ],
      vel: bulletVel,
      color: "orange",
      game: this.game
    });

    var bulletRight = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVelSpreadRight,
      color: "orange",
      game: this.game
    });

    var bulletLeft = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVelSpreadLeft,
      color: "orange",
      game: this.game
    });

    switch (true) {
      case this.game.score > 1250:
        this.game.add(bullet2);
        this.game.add(bullet3);
        break;
      case this.game.score > 750:
        this.game.add(bullet2);
        this.game.add(bullet3);
        break;
      default:
        this.game.add(bullet);
    }
  };

  FleetShip.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.health = 100;
    if ( this.game.score > 1500 && this.game.fleetShips.length < 3) {
      this.game.addFleetShip();
    } else if ( this.game.score > 1000 && this.game.fleetShips.length < 2) {
      this.game.addFleetShip();
    }
  };
})();
