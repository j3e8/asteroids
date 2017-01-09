var ani = null;
var asteroids = [];
var ship = null;
var viewSize = {
  width: 100,
  height: 66
}

window.addEventListener("load", function() {
  ani = new Animation(document.getElementById('game'), animate, render, viewSize);
  initGame();
  initLevel(1);
});

function initGame() {
  ship = Ship.createShip(viewSize);
}

function initLevel(lvl) {
  asteroids = [];
  asteroids.push(Asteroid.createAsteroid(viewSize, 0));
  asteroids.push(Asteroid.createAsteroid(viewSize, 0));
}


function animate(elapsedTime) {
  var canvasSize = {
    width: ani.getWidth(),
    height: ani.getHeight()
  };

  for (var i=0; i < asteroids.length; i++) {
    Asteroid.moveAsteroid(asteroids[i], elapsedTime, viewSize);
    Asteroid.rotateAsteroid(asteroids[i], elapsedTime);
    for (var j=i+1; j < asteroids.length; j++) {
      if (Asteroid.hitTestAsteroids(asteroids[i], asteroids[j])) {
        Asteroid.doAsteroidCollision(asteroids[i], asteroids[j]);
      }
    }
  }

  return true;
}

function render(htmlCanvas) {
  var ctx = htmlCanvas.getContext("2d");

  var canvasSize = {
    width: ani.getWidth(),
    height: ani.getHeight()
  };

  var canvasWidth = htmlCanvas.width;
  var canvasHeight = htmlCanvas.height;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  Ship.render(ctx, ship, canvasSize, viewSize);

  asteroids.forEach(function(asteroid) {
    Asteroid.render(ctx, asteroid, canvasSize, viewSize);
  });
}
