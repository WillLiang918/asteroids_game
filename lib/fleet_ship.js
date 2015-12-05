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

  var FleetShip = Asteroids.FleetShip = function (options) {
    options.radius = FleetShip.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    this.moving = false;
    this.turnRight = false;
    this.turnLeft = false;
    this.upgrade = 0;
    this.angle = 0;
    this.health = 100;

    Asteroids.MovingObject.call(this, options);
  };

  FleetShip.RADIUS = 25;
  FleetShip.sprite = new Image();

  Asteroids.Util.inherits(FleetShip, Asteroids.MovingObject);

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
  };

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
        this.game.add(bulletLeft);
        this.game.add(bulletRight);
        break;
      case this.game.score > 750:
        this.game.add(bullet2);
        this.game.add(bullet3);
        break;
      default:
        this.game.add(bullet);
    }
  };

  FleetShip.prototype.power = function (ship, held_keys) {
    held_keys.forEach( function (pressed_key) {
      if (pressed_key == "W") {
        ship.moving = true;
      }
      if (pressed_key == "A") {
        ship.turnLeft = true;
      }
      if (pressed_key == "D") {
        ship.turnRight = true;
      }
      if (pressed_key == " ") {
          ship.fireBullet();
      }
    });
  };

  FleetShip.prototype.isMoving = function (ship, held_keys) {
    if (held_keys.indexOf("W") == -1 ) {
      ship.moving = false;
    }
    if (held_keys.indexOf("A") == -1 ) {
      ship.turnLeft = false;
    }
    if (held_keys.indexOf("D") == -1 ) {
      ship.turnRight = false;
    }
    if (held_keys.indexOf(" ") == -1 && ship.fireBeam) {
      ship.fireBeam = false;
    }
  };

  FleetShip.prototype.move = function (delta) {

    // var targetIdx = Math.floor(Math.random() * (this.game.enemyShips.length));
    var dist = Asteroids.Util.dist(this.pos, this.game.enemyShips[0].pos);
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

  FleetShip.prototype.friction = function () {
    this.vel[0] = this.vel[0] * 0.97;
    this.vel[1] = this.vel[1] * 0.97;
  };

  FleetShip.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.health = 100;
    if ( this.game.score > 1500 && this.game.fleetShips.length < 4) {
      this.game.addFleetShip();
    } else if ( this.game.score > 1000 && this.game.fleetShips.length < 3) {
      this.game.addFleetShip();
    } else if ( this.game.score > 300 && this.game.fleetShips.length < 2) {
      this.game.addFleetShip();
    }
  };
})();
