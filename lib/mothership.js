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
    options.maxRotateSpeed = Math.PI / 2700;
    options.src = './assets/boss.png';
    options.width = 230;
    options.height = 336;

    Asteroids.EnemyShip.call(this, options);
  };

  MotherShip.RADIUS = 100;
  MotherShip.sprite = new Image();

  Asteroids.Util.inherits(MotherShip, Asteroids.EnemyShip);

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
