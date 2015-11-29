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
    this.speed = 0;

    Asteroids.MovingObject.call(this, options);
  };

  Ship.RADIUS = 15;
  Ship.sprite = new Image();
  Ship.sprite.src = './assets/speedship.png';

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);



  Ship.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle*Math.PI/180);
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
    var norm = Asteroids.Util.norm(this.vel);

    if (norm == 0) {
      // Can't fire unless moving.
      return;
    }

    var relVel = Asteroids.Util.scale(
      Asteroids.Util.dir(this.vel),
      Asteroids.Bullet.SPEED
    );

    var bulletVel = [
      relVel[0] + this.vel[0], relVel[1] + this.vel[1]
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
    held_keys.forEach( function (pressed_key) {
      console.log(held_keys);
      if (pressed_key == "W" || this.speed < 8) {
        this.speed += 1;
        
        if (ship.vel[0] < 8 && ship.vel[0] > -8) {
          ship.vel[0] += Asteroids.GameView.MOVES[pressed_key][0];
        }
        if (ship.vel[1] < 8 && ship.vel[1] > -8) {
          ship.vel[1] += Asteroids.GameView.MOVES[pressed_key][1];
        }
      }
      if (pressed_key == "A" || pressed_key == "D") {
        ship.angle += Asteroids.GameView.MOVES[pressed_key];
        // ship.vel[1] += Asteroids.GameView.MOVES[pressed_key][1];
      }
    });
  };

  Ship.prototype.friction = function (ship, held_keys) {

    held_keys.forEach( function (pressed_key) {
      if (ship.vel[0] < 8 && ship.vel[0] > -8) {
        ship.vel[0] += Asteroids.GameView.MOVES[pressed_key][0];
      }
      if (ship.vel[1] < 8 && ship.vel[1] > -8) {
        ship.vel[1] += Asteroids.GameView.MOVES[pressed_key][1];
      }
    });
  };

  Ship.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };
})();
