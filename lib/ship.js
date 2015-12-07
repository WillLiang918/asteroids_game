(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function (options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    // options.color = options.color || randomColor();
    this.angle = 0;
    this.moving = false;
    this.turnRight = false;
    this.turnLeft = false;
    this.upgrade = 0;
    this.color = "orange";
    this.explosionSize = 400;

    Asteroids.MovingObject.call(this, options);
  };

  Ship.RADIUS = 30;
  Ship.sprite = new Image();

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle * Math.PI/180);

    switch (true) {
      case this.game.score >= 300:
        if (this.moving){
          Ship.sprite.src = './assets/spaceship3-thrust.png';
        } else {
          Ship.sprite.src = './assets/spaceship3.png';
        }
        ctx.drawImage(Ship.sprite, 0, 0, 70, 70, -30, -30, 60, 60);
        break;

      default:
      if (this.moving){
        Ship.sprite.src = './assets/spaceship1-thrust.png';
      } else {
        Ship.sprite.src = './assets/spaceship1.png';
      }
      ctx.drawImage(Ship.sprite, 0, 0, 58, 64, -30, -30, 58, 64);
    }

    ctx.restore();

    if (this.game.shields < 30) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    }
    if (this.game.shields > 0) {
      ctx.beginPath();
      ctx.arc(
        this.pos[0] + Math.sin(this.angle/180 * Math.PI) * 8,
        this.pos[1] - Math.cos(this.angle/180 * Math.PI) * 8,
        this.radius, 0, 2 * Math.PI, true);
      ctx.fill();
    }
  };

  Ship.prototype.fireBullet = function () {

    var angleRight = this.angle + 5;
    var angleLeft = this.angle - 5;

    var bulletVel = [
      this.vel[0] + Math.sin(this.angle/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(this.angle/180 * Math.PI) * 10
    ];
    var bulletVelSpreadRight = [
      this.vel[0] + Math.sin(angleRight/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(angleRight/180 * Math.PI) * 10
    ];
    var bulletVelSpreadLeft = [
      this.vel[0] + Math.sin(angleLeft/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(angleLeft/180 * Math.PI) * 10
    ];

    var bullet = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.sin(this.angle/180 * Math.PI) * 30),
        (this.pos[1] - Math.cos(this.angle/180 * Math.PI) * 30)
      ],
      vel: bulletVel,
      color: "orange",
      game: this.game
    });

    var bullet2 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] + Math.cos(this.angle/180 * Math.PI) * 10),
        (this.pos[1] + Math.sin(this.angle/180 * Math.PI) * 10)
      ],
      vel: bulletVel,
      color: "orange",
      game: this.game
    });

    var bullet3 = new Asteroids.Bullet({
      pos: [
        (this.pos[0] - Math.cos(this.angle/180 * Math.PI) * 10),
        (this.pos[1] - Math.sin(this.angle/180 * Math.PI) * 10)
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
      case this.game.score >= 700:
        for (var i = 0; i < 2; i++){
          this.game.add(bullet);
          this.game.add(bullet2);
          this.game.add(bullet3);
          this.game.add(bulletRight);
          this.game.add(bulletLeft);
        }
        break;
      case this.game.score >= 450:
        for (i = 0; i < 2; i++){
          this.game.add(bullet);
          this.game.add(bullet2);
          this.game.add(bullet3);
        }
        break;
      case this.game.score >= 300:
        for (i = 0; i < 2; i++){
          this.game.add(bullet2);
          this.game.add(bullet3);
        }
        break;
      case this.game.score >= 200:
        this.game.add(bullet);
        this.game.add(bullet2);
        this.game.add(bullet3);
        break;
      case this.game.score >= 100:
        this.game.add(bullet);
        this.game.add(bulletRight);
        this.game.add(bulletLeft);
        break;
      case this.game.score >= 50:
        this.game.add(bullet2);
        this.game.add(bullet3);
        break;
      case this.game.score < 50:
        this.game.add(bullet);
        this.game.add(bullet);
        break;
      }
  };

  Ship.prototype.bulletType = function (bulletType) {

    var pos, vel;
    var angleRight = this.angle + 5;
    var angleLeft = this.angle - 5;
    var bulletVel = [
      this.vel[0] + Math.sin(this.angle/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(this.angle/180 * Math.PI) * 10
    ];
    var bulletVelSpreadRight = [
      this.vel[0] + Math.sin(angleRight/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(angleRight/180 * Math.PI) * 10
    ];
    var bulletVelSpreadLeft = [
      this.vel[0] + Math.sin(angleLeft/180 * Math.PI) * 10,
      this.vel[1] - Math.cos(angleLeft/180 * Math.PI) * 10
    ];

    switch (bulletType) {
      case "bullet":
        pos = [
          (this.pos[0] + Math.sin(this.angle/180 * Math.PI) * 30),
          (this.pos[1] - Math.cos(this.angle/180 * Math.PI) * 30)
        ];
        vel = bulletVel;
        break;
      case "bullet2":
        pos = [
          (this.pos[0] + Math.cos(this.angle/180 * Math.PI) * 10),
          (this.pos[1] + Math.sin(this.angle/180 * Math.PI) * 10)
        ];
        vel = bulletVel;
        break;
      case "bullet3":
        pos = [
          (this.pos[0] - Math.cos(this.angle/180 * Math.PI) * 10),
          (this.pos[1] - Math.sin(this.angle/180 * Math.PI) * 10)
        ];
        vel = bulletVel;
      break;
      case "bulletRight":
        pos = this.pos;
        vel = bulletVelSpreadRight;
      break;
      case "bulletLeft":
        pos = this.pos;
        vel = bulletVelSpreadLeft;
      break;
    }
  };

  Ship.prototype.power = function (ship, held_keys) {
    held_keys.forEach( function (pressed_key) {
      if (pressed_key == "Up") {
        ship.moving = true;
      }
      if (pressed_key == "Left") {
        ship.turnLeft = true;
      }
      if (pressed_key == "Right") {
        ship.turnRight = true;
      }
      if (pressed_key == "Fire" && !ship.game.gameOver) {
        ship.fireBullet();
      }
    });
  };

  Ship.prototype.isMoving = function (ship, held_keys) {
    if (held_keys.indexOf("Up") == -1 ) {
      ship.moving = false;
    }
    if (held_keys.indexOf("Left") == -1 ) {
      ship.turnLeft = false;
    }
    if (held_keys.indexOf("Right") == -1 ) {
      ship.turnRight = false;
    }
  };

  Ship.prototype.move = function (delta) {
    if (this.moving) {
      this.vel[0] += Math.sin(this.angle/180 * Math.PI) * (this.game.mobility / 10);
      this.vel[1] -= Math.cos(this.angle/180 * Math.PI) * (this.game.mobility / 10);
    }
    if (this.turnLeft) {
      this.angle -= 1.5 + (this.game.mobility/2);
    }
    if (this.turnRight) {
      this.angle += 1.5 + (this.game.mobility/2);
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
    this.vel[0] = this.vel[0] * 0.98;
    this.vel[1] = this.vel[1] * 0.98;
  };

  Ship.prototype.collideWith = function (otherObject) {
    var explosion = new Asteroids.Explosion(this);
    var explosionOtherShip = new Asteroids.Explosion(otherObject);

    if (this == this.game.ships[0] &&
      otherObject instanceof Asteroids.EnemyShip &&
      this.game.health > 0) {
      var health = this.game.health;

      if (this.game.shields > otherObject.health) {
        this.game.shields -= otherObject.health;
      } else {
        this.game.shields = 0;
        this.game.health -= otherObject.health;
        if (this.game.health <= 0) {
          this.game.health = 0;
          this.game.addExplosion(explosion);
          this.game.gameOver = true;
          $("#game-over").append("<br>" + "Kills: " + this.game.kills);
          $("div").addClass("active");
        }
      }
      otherObject.health -= this.game.health;
      if (otherObject.health <= 0) {
        this.game.addExplosion(explosionOtherShip);
        otherObject.relocate();
      }
    }
  };

  Ship.prototype.relocate = function () {
    this.pos = [ Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2 ];
    this.vel = [0, 0];
    // this.game.gameOver = true;
  };
})();
