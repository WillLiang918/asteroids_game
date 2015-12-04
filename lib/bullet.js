(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function (options) {
    options.radius = Bullet.RADIUS;

    Asteroids.MovingObject.call(this, options);
  };

  Bullet.RADIUS = 2;
  Bullet.SPEED = 15;

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);

  var sheet = document.createElement("img");
  sheet.src = './assets/explosion_spritesheet.png';

  Bullet.prototype.collideWith = function (otherObject) {
    var explosion = new Asteroids.Explosion(otherObject);

    if (otherObject instanceof Asteroids.Ship && this.color == "red") {
      this.remove();
      this.game.addExplosion(explosion);
    }

    if (otherObject instanceof Asteroids.EnemyShip && this.color == "orange") {
      this.remove();
      this.game.addExplosion(explosion);
    }

    if (otherObject instanceof Asteroids.Asteroid) {
      this.game.addExplosion(explosion);
      this.remove();
      this.game.score += 10;
      otherObject.remove();
    }
  };
  //  sheet.onload=function(){
  //    var canvasEl = document.getElementsByTagName("canvas")[0];
  //    canvasEl.width = Asteroids.Game.DIM_X;
  //    canvasEl.height = Asteroids.Game.DIM_Y;
  //    explosion();
  //  };
  // sheet.src = './assets/explosion_spritesheet.png';

  Bullet.prototype.explode = function (spriteIndex) {
    var fps = 81;
    var rows = 9;
    var cols = 9;
    var width = 100;
    var height = 100;
    explode();
    function explode() {

      var canvas=document.getElementsByTagName("canvas")[0];
      var ctx=canvas.getContext("2d");

      if (spriteIndex > 81) {return;}
      // console.log("Hi");
      setTimeout(function() {
        requestAnimationFrame(explode);

        var x = spriteIndex % (cols - 1) * width;
        var y = spriteIndex % (rows - 1) * height;
        console.log("Hi");
        ctx.clearRect(0, 0, Asteroids.Game.DIM_X, Asteroids.Game.DIM_Y);
        ctx.drawImage(sheet, 0, 0, 100, 100, -30 , -30, 100, 100);

        spriteIndex++;
      }, 1000 / fps);
    }
  };

  Bullet.prototype.isWrappable = false;
})();
