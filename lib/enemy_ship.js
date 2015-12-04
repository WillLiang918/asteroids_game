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

  var EnemyShip = Asteroids.EnemyShip = function (options) {
    options.radius = EnemyShip.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    this.moving = false;
    this.turnRight = false;
    this.turnLeft = false;
    this.fireBeam = false;
    this.upgrade = 0;
    this.angle = 0;

    Asteroids.MovingObject.call(this, options);
  };

  EnemyShip.RADIUS = 25;
  EnemyShip.sprite = new Image();

  Asteroids.Util.inherits(EnemyShip, Asteroids.MovingObject);

  EnemyShip.prototype.draw = function (ctx) {
    var thetaX = this.pos[0] - this.game.ships[0].pos[0];
    var thetaY = this.pos[1] - this.game.ships[0].pos[1];
    var radians = Math.atan2(thetaY, thetaX);
    var delta = radians - this.angle;
    var delta_abs = Math.abs(delta);
    if (delta) {

      // - 90 degrees in radians
      this.angle += (delta - (Math.PI/2) - (Math.random() / 5) + Math.random() / 10);
      this.angle %= Math.PI * 2;
    }

    // // this.angle = Math.atan(thetaY / thetaX);
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    EnemyShip.sprite.src = './assets/enemyship1.png';
    ctx.drawImage(EnemyShip.sprite, 0, 0, 80, 45, -30, -15, 60, 30);
    ctx.restore();

    var random = Math.random(1);
    if (random < 0.01) {
      this.fireBullet();
    }
  };

  EnemyShip.prototype.fireBullet = function () {
    var bulletVel = [
      this.vel[0] + Math.sin(this.angle) * 10,
      this.vel[1] - Math.cos(this.angle) * 10
    ];

    var bullet = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVel,
      color: "red",
      game: this.game
    });

    this.game.add(bullet);
  };

  EnemyShip.prototype.power = function (ship, held_keys) {
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

  EnemyShip.prototype.isMoving = function (ship, held_keys) {
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

  EnemyShip.prototype.move = function (delta) {
    if (this.moving) {
      this.vel[0] += Math.sin(this.angle/180 * Math.PI) * (this.game.speed / 20);
      this.vel[1] -= Math.cos(this.angle/180 * Math.PI) * (this.game.speed / 20);
    }
    if (this.turnLeft) {
      this.angle -= 1.5 + (this.game.agility/2);
    }
    if (this.turnRight) {
      this.angle += 1.5 + (this.game.agility/2);
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

  EnemyShip.prototype.friction = function () {
    this.vel[0] = this.vel[0] * 0.97;
    this.vel[1] = this.vel[1] * 0.97;
  };

  EnemyShip.prototype.relocate = function () {
    this.pos = [ Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2 ];
    this.vel = [0, 0];
  };
})();
