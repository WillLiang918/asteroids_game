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
    this.speed = 1;
    this.agility = 1;
    this.rank = "Cadet";
    this.enemyShips = [];
    this.addAsteroids();
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 32;
  Game.NUM_ASTEROIDS = 10;

  Game.prototype.add = function (object) {
    if (object instanceof Asteroids.Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Asteroids.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Asteroids.Ship) {
      this.ships.push(object);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      console.log("Hi");
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

  Game.prototype.allObjects = function () {
    return [].concat(this.ships, this.asteroids, this.bullets);
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
    ctx.fillText("Score", 30, 25);
    ctx.fillText(this.score, 100, 25);

    ctx.fillText("Rank", 850, 50);
    ctx.fillText(this.rank, 925, 50);

    ctx.fillText("Weapon", 850, 75);
    ctx.fillText(this.weapon, 925, 75);

    ctx.fillText("Speed", 850, 100);
    ctx.fillText(this.speed, 925, 100);

    ctx.fillText("Agility", 850, 125);
    ctx.fillText(this.agility, 925, 125);


    this.allObjects().forEach(function (object) {
      object.draw(ctx);
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
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function (delta) {
    if (this.ships[0].moving) {
    } else {
      this.ships[0].friction();
    }

    switch (true) {
      case this.score >= 300:
          this.weapon = 7;
          this.rank = "Admiral";
        break;
      case this.score >= 250:
          this.weapon = 6;
          this.speed = 3;
        break;
      case this.score >= 200:
          this.weapon = 5;
          this.agility = 3;
        break;
      case this.score >= 150:
          this.weapon = 4;
        break;
      case this.score >= 100:
          this.speed = 2;
          this.weapon = 3;
        break;
      case this.score >= 50:
          this.agility = 2;
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
