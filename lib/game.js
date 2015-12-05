(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function () {
    this.asteroids = [];
    this.bullets = [];
    this.ships = [];
    this.score = 0;
    this.weapon = 1;
    this.shieldReg = 1;
    this.mobility = 1;
    this.rank = "Cadet";
    this.enemyShips = [];
    this.fleetShips = [];
    this.addAsteroids();
    this.explosions = [];
    this.shields= 100;
    this.health = 500;
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = document.body.clientWidth;
  Game.DIM_Y = document.body.clientHeight;
  Game.FPS = 32;
  Game.NUM_ASTEROIDS = 8;

  Game.prototype.add = function (object) {
    if (object instanceof Asteroids.Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Asteroids.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Asteroids.Ship) {
      this.ships.push(object);
    } else if (object instanceof Asteroids.Explosion) {
      this.explosion.push(object);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.addExplosion = function (explosion) {
    this.explosions.push(explosion);
  };

  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      this.add(new Asteroids.Asteroid({ game: this }));
    }
  };

  Game.prototype.addShip = function () {
    var ship = new Asteroids.Ship({
      pos: [ Game.DIM_X / 2, Game.DIM_Y / 2 ],
      game: this
    });

    this.add(ship);
    return ship;
  };

  Game.prototype.addEnemyShip = function () {
    var enemyShip = new Asteroids.EnemyShip({
      pos: this.randomPosition(),
      game: this
    });

    this.enemyShips.push(enemyShip);
    return enemyShip;
  };

  Game.prototype.addMotherShip = function () {
    var enemyShip = new Asteroids.MotherShip({
      pos: this.randomPosition(),
      game: this
    });

    this.enemyShips.push(enemyShip);
    return enemyShip;
  };

  Game.prototype.addFleetShip = function () {
    var fleetShip = new Asteroids.FleetShip({
      pos: this.randomPosition(),
      game: this
    });

    this.fleetShips.push(fleetShip);
    return fleetShip;
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.ships, this.asteroids, this.bullets, this.enemyShips, this.fleetShips);
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1 == obj2) {
          // don't allow self-collision
          return;
        }

        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;

    ctx.font = "20px point Ariel";
    ctx.fillStyle = "white";


    ctx.fillText("Rank", 30, 50);
    ctx.fillText(this.rank, 105, 50);

    ctx.fillText("Health", Game.DIM_X / 2 - 75, 50);
    ctx.fillText(Math.floor(this.health), Game.DIM_X / 2, 50);

    ctx.fillText("Shields", Game.DIM_X / 2 - 75, 75);
    ctx.fillText(Math.floor(this.shields) + "%", Game.DIM_X / 2, 75);

    ctx.fillText("Weapon", 30, 75);
    ctx.fillText(this.weapon, 105, 75);

    ctx.fillText("Mobility", 30, 100);
    ctx.fillText(this.mobility, 105, 100);

    ctx.fillText("Regen", 30, 125);
    ctx.fillText(this.shieldReg, 105, 125);

    ctx.fillText("Score", Game.DIM_X - 200, 50);
    ctx.fillText(this.score, Game.DIM_X - 125, 50);


    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

    this.explosions.forEach(function (explosion) {
      explosion.draw(ctx);
    });

    this.enemyShips.forEach(function (enemyShip) {
      enemyShip.draw(ctx);
    });
    this.fleetShips.forEach(function (fleetShip) {
      fleetShip.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function (delta) {
    this.allObjects().forEach(function (object) {
      object.move(delta);
    });
  };

  Game.prototype.randomPosition = function () {
    var spawnOption = Math.random();
    var dimX, dimY;
    switch (true) {
      case (spawnOption < 0.25):
        dimX = 0;
        dimY = Game.DIM_Y * Math.random();
        break;
      case (spawnOption < 0.50):
        dimX = Game.DIM_X;
        dimY = Game.DIM_Y * Math.random();
        break;
      case (spawnOption < 0.75):
        dimX = Game.DIM_X * Math.random();
        dimY = 0;
        break;
      default:
        dimX = Game.DIM_X * Math.random();
        dimY = Game.DIM_Y;
        break;
    }
    return [
      dimX,
      dimY
    ];
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Asteroids.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Asteroids.Asteroid) {
      var idx = this.asteroids.indexOf(object);
      this.asteroids[idx] = new Asteroids.Asteroid({ game: this });
    } else if (object instanceof Asteroids.Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else if (object instanceof Asteroids.Explosion) {
      this.explosions.splice(this.explosions.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function (delta) {
    if (this.shields > 0 && this.shields < 100) {
      this.shields += (0.05 * this.shieldReg);
    } else{
      var rand = Math.random();
      if (rand < 0.1) {
        this.shields += (0.05 * this.shieldReg);
      }
    }
    this.ships[0].friction();
    if (this.ships[0].moving) {
    } else {
    }

    this.enemyShips.forEach(function (enemyShip) {
      enemyShip.friction();
    });
    this.fleetShips.forEach(function (fleetShip) {
      fleetShip.friction();
    });

    switch (true) {
      case this.score >= 300:
          this.weapon = 7;
          this.rank = "Admiral";
          this.shieldReg = 3;
        break;
      case this.score >= 250:
          this.weapon = 6;
          this.mobility = 3;
        break;
      case this.score >= 200:
          this.ships[0].radius = 35;
          this.weapon = 5;
        break;
      case this.score >= 150:
          this.weapon = 4;
          this.shieldReg = 2;
        break;
      case this.score >= 100:
          this.mobility = 2;
          this.weapon = 3;
        break;
      case this.score >= 50:
          this.weapon = 2;
        break;
      default:

    }

    this.moveObjects(delta);
    this.checkCollisions();
  };

  Game.prototype.wrap = function (pos) {
    return [
      wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
    ];

    function wrap(coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  };
})();
