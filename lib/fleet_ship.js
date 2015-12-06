(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  // function randomColor() {
  //   var hexDigits = "0123456789ABCDEF";
  //
  //   var color = "#";
  //   for (var i = 0; i < 3; i ++) {
  //     color += hexDigits[Math.floor((Math.random() * 16))];
  //   }
  //   return color;
  // }

  var FleetShip = Asteroids.FleetShip = function (options) {

    this.angle = 0;
    this.health = 50;
    this.targetShip = options.game.enemyShips[0];

    Asteroids.AIShip.call(this, options);
  };

  FleetShip.sprite = new Image();

  Asteroids.Util.inherits(FleetShip, Asteroids.AIShip);

  FleetShip.prototype.draw = function (ctx) {
    var thetaX = this.pos[0] - this.game.enemyShips[0].pos[0];
    var thetaY = this.pos[1] - this.game.enemyShips[0].pos[1];
    var radians = Math.atan2(thetaY, thetaX);
    var delta = radians - this.angle;
    var delta_abs = Math.abs(delta);
    if (delta) {

      // - 90 degrees in radians
      this.angle += (delta - (Math.PI/2));
      // - (Math.random() / 5) + Math.random() / 10);
      this.angle %= Math.PI * 2;
    }

    // // this.angle = Math.atan(thetaY / thetaX);
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    FleetShip.sprite.src = './assets/spaceship1.png';
    ctx.drawImage(FleetShip.sprite, 0, 0, 70, 70, -30, -30, 60, 60);
    ctx.restore();

    var random = Math.random(1);
    if (random < 0.01) {
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

  FleetShip.prototype.fireBullet = function () {
    console.log(this.distance);
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
    // } else if ( this.game.score > 300 && this.game.fleetShips.length < 2) {
    //   this.game.addFleetShip();
    }
  };
})();
