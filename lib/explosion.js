(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Explosion = Asteroids.Explosion = function (bullet) {
    this.game = bullet.game;
    this.pos = bullet.pos;
    this.index = 0;
  };

  Asteroids.Util.inherits(Explosion, Asteroids.MovingObject);

  Explosion.prototype.move = function () {};

  var sheet = document.createElement("img");
  sheet.src = './assets/explosion_spritesheet.png';

  Explosion.prototype.draw = function (ctx) {
    var that = this;
    var fps = 81;
    var rows = 9;
    var cols = 9;
    var width = 100;
    var height = 100;


    if (this.index > 81) {
      this.game.remove(this);
    }

    var x = this.index % (cols - 1) * width;
    var y = Math.floor(this.index / (rows - 1)) * height;
    ctx.drawImage(sheet, x, y, 100, 100, this.pos[0], this.pos[1], 30, 30);
    this.index++;

  };

  // Bullet.prototype.explode = function (spriteIndex) {
  //   var fps = 81;
  //   var rows = 9;
  //   var cols = 9;
  //   var width = 100;
  //   var height = 100;
  //   explode();
  //   function explode() {
  //
  //     var canvas=document.getElementsByTagName("canvas")[0];
  //     var ctx=canvas.getContext("2d");
  //
  //     if (spriteIndex > 81) {return;}
  //     // console.log("Hi");
  //     setTimeout(function() {
  //       requestAnimationFrame(explode);
  //
  //       var x = spriteIndex % (cols - 1) * width;
  //       var y = spriteIndex % (rows - 1) * height;
  //       console.log("Hi");
  //       ctx.clearRect(0, 0, Asteroids.Game.DIM_X, Asteroids.Game.DIM_Y);
  //       ctx.drawImage(sheet, 0, 0, 100, 100, -30 , -30, 100, 100);
  //
  //       spriteIndex++;
  //     }, 1000 / fps);
  //   }
  // };
  //
  // Bullet.prototype.isWrappable = false;
})();
