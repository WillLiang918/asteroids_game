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

  var Ship = Asteroids.Ship = function (options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    this.angle = 0;
    this.moving = false;

    Asteroids.MovingObject.call(this, options);
  };

  Ship.RADIUS = 15;
  Ship.sprite = new Image();
  Ship.sprite.src = './assets/1.png';

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle * Math.PI/180);
    if (this.moving) {
      Ship.sprite.src = './assets/spaceship1-trust.png';
    } else {
      Ship.sprite.src = './assets/spaceship1.png';
    }
    ctx.drawImage(Ship.sprite, 0, 0, 60, 60, -30, -30, 60, 60);
    // if (this.frozen) {
    //   ctx.drawImage(Ship.sprite, 0, 0, 60, 60, -30, -30, 60, 60);
    // } else {
    //   ctx.drawImage(Ship.sprite, this.spriteFrame, 0, 60, 60, -30, -30, 60, 60);
    //   if (this.animSprite === 0) {
    //     if (this.thrusting) {
    //       this.spriteFrame = (this.spriteFrame + 60) % 480;
    //     } else {
    //       this.spriteFrame = (this.spriteFrame + 60) % 180;
    //     }
    //   }
    //   this.animSprite = (this.animSprite + 1) % 4; // sets frequency of animation based on global refresh rate.
    // };

    ctx.restore();
    // this.thrusting = false;
  };

  Ship.prototype.fireBullet = function () {

    var bulletVel = [
      this.vel[0] + Math.sin(this.angle/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(this.angle/180 * Math.PI) * 10
    ];
    var bullet = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVel,
      color: this.color,
      game: this.game
    });

    this.game.add(bullet);
  };

  Ship.prototype.power = function (ship, held_keys) {
    console.log(held_keys);
    held_keys.forEach( function (pressed_key) {
      if (pressed_key == "W") {
        ship.moving = true;
      }
      if (pressed_key == "A" || pressed_key == "D") {
        ship.angle += Asteroids.GameView.MOVES[pressed_key];
      }
      if (pressed_key == " ") {
        ship.fireBullet();
      }
    });
  };

  Ship.prototype.isMoving = function (ship, held_keys) {
    if (held_keys.indexOf("W") == -1 ) {
      ship.moving = false;
    }
  };

  Ship.prototype.move = function (delta) {
    if (this.moving) {
      this.vel[0] += Math.sin(this.angle/180 * Math.PI) * 0.05;
      this.vel[1] -= Math.cos(this.angle/180 * Math.PI) * 0.05;
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

  Ship.prototype.friction = function () {
    this.vel[0] = this.vel[0] * 0.97;
    this.vel[1] = this.vel[1] * 0.97;
  };

  Ship.prototype.relocate = function () {
    this.pos = [ Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2 ];
    this.vel = [0, 0];
  };
})();
