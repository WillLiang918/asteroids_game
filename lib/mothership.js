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
    this.health = 5000;

    Asteroids.MovingObject.call(this, options);
  };

  MotherShip.RADIUS = 100;
  MotherShip.sprite = new Image();

  Asteroids.Util.inherits(MotherShip, Asteroids.EnemyShip);

  MotherShip.prototype.draw = function (ctx) {
    var thetaX = this.pos[0] - this.game.ships[0].pos[0];
    var thetaY = this.pos[1] - this.game.ships[0].pos[1];
    var radians = Math.atan2(thetaY, thetaX) - (Math.PI / 2);


    var delta = (radians - this.angle);
    // console.log(this.angle);
    // console.log(delta * 180 / Math.PI);
    var delta_abs = Math.abs(delta);
    if ((delta_abs) > Math.PI / 1800) {
      // console.log(delta_abs);
      // console.log(delta);
      delta = (delta / delta_abs) * (Math.PI / 1800);
      // console.log(delta * 180 / Math.PI);
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
    if (random < 0.01) {
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

    this.game.add(bullet);
    this.game.add(bullet2);
    this.game.add(bullet3);
    this.game.add(bullet4);
    this.game.add(bullet5);
    this.game.add(bullet6);
    this.game.add(bullet7);
  };

  MotherShip.prototype.power = function (ship, held_keys) {
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

  MotherShip.prototype.isMoving = function (ship, held_keys) {
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

  MotherShip.prototype.move = function (delta) {

    var dist = Asteroids.Util.dist(this.pos, this.game.ships[0].pos);
    if (dist > 500) {
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
    this.health = 5000;
    if ( this.game.score > 1500 && this.game.enemyShips.length < 4) {
      // this.game.addMotherShip();
    } else if ( this.game.score > 1000 && this.game.enemyShips.length < 3) {
      // this.game.addMotherShip();
      this.game.addFleetShip();
    } else if ( this.game.score > 300 && this.game.enemyShips.length < 2) {
      // this.game.addMotherShip();
    }
  };
})();
