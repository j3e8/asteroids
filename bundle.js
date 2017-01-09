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

function Animation(htmlContainer, animationCallback, renderCallback, viewSize) {
  var htmlCanvas = null;
  var aspectRatio = viewSize.width / viewSize.height;

  htmlCanvas = document.createElement("canvas");
  htmlCanvas.style.marginLeft = "auto";
  htmlCanvas.style.marginRight = "auto";
  htmlContainer.style.textAlign = "center";
  htmlContainer.appendChild(htmlCanvas);
  fillParent();
  _requestAnimationFrame();

  window.addEventListener("resize", function() {
    fillParent();
  });

  this.getWidth = function() {
    return htmlCanvas.width;
  }

  this.getHeight = function() {
    return htmlCanvas.height;
  }

  function fillParent() {
    var parentRatio = htmlContainer.offsetWidth / htmlContainer.offsetHeight;

    if (aspectRatio && aspectRatio >= parentRatio) {
      htmlCanvas.width = htmlContainer.offsetWidth;
      htmlCanvas.height = htmlContainer.offsetWidth / aspectRatio;
    }
    else if (aspectRatio && aspectRatio < parentRatio) {
      htmlCanvas.height = htmlContainer.offsetHeight;
      htmlCanvas.width = htmlContainer.offsetHeight * aspectRatio;
    }
    else {
      htmlCanvas.width = htmlContainer.offsetWidth;
      htmlCanvas.height = htmlContainer.offsetHeight;
    }
  }

  function _requestAnimationFrame() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(animateFrame);
    }
    else if (window.webkitRequestAnimationFrame) {
      window.webkitRequestAnimationFrame(animateFrame);
    }
    else if (window.mozRequestAnimationFrame) {
      window.mozRequestAnimationFrame(animateFrame);
    }
    else if (window.msRequestAnimationFrame) {
      window.msRequestAnimationFrame(animateFrame);
    }
  }

  var lastFrame = new Date().getTime();
  function animateFrame() {
    var thisFrame = new Date().getTime();
    var elapsedTime = thisFrame - lastFrame;

    var needsRender = false;
    if (animationCallback) {
      needsRender = animationCallback(elapsedTime);
    }

    if (needsRender && renderCallback) {
      renderCallback(htmlCanvas);
    }

    lastFrame = thisFrame;
    _requestAnimationFrame();
  }
}

var Asteroid = {};

Asteroid.ELASTICITY = 0.5;
Asteroid.SIZE = [
  { width: 6, height: 6},
  { width: 3, height: 3},
  { width: 1.5, height: 1.5}
];

Asteroid.createAsteroid = function(viewSize, level) {
  var image = new Image();
  image.src = "images/asteroid" + level + ".svg";

  return {
    img: image,
    x: Math.random() * viewSize.width,
    y: Math.random() * viewSize.height,
    r: 0,
    level: level,
    v: {
      x: Util.randomValue(0.005, 0.008, true),
      y: Util.randomValue(0.005, 0.008, true),
      r: Util.randomValue(0.0005, 0.002, true)
    }
  }
}

Asteroid.moveAsteroid = function(asteroid, elapsedTime, viewSize) {
  asteroid.x += asteroid.v.x * elapsedTime;
  asteroid.y += asteroid.v.y * elapsedTime;

  if (asteroid.x < 0) {
    asteroid.x += viewSize.width;
  }
  if (asteroid.x >= viewSize.width) {
    asteroid.x -= viewSize.width;
  }

  if (asteroid.y < 0) {
    asteroid.y += viewSize.height;
  }
  if (asteroid.y >= viewSize.height) {
    asteroid.y -= viewSize.height;
  }
}

Asteroid.rotateAsteroid = function(asteroid, elapsedTime) {
  asteroid.r += asteroid.v.r * elapsedTime;
  if (asteroid.r >= Math.PI * 2) {
    asteroid.r -= Math.PI * 2;
  }
  if (asteroid.r < 0) {
    asteroid.r += Math.PI * 2;
  }
}

Asteroid.render = function(ctx, asteroid, canvasSize, viewSize) {
  var size = Util.convertSizeFromMetersToPx(Asteroid.SIZE[asteroid.level], canvasSize, viewSize);
  var x = Util.convertValueFromMetersToPx(asteroid.x, canvasSize, viewSize);
  var y = Util.convertValueFromMetersToPx(asteroid.y, canvasSize, viewSize);

  Asteroid.drawImage(ctx, asteroid.img, x, y, size.width, size.height, asteroid.r);
  if (x < 0 + size.width/2) {
    Asteroid.drawImage(ctx, asteroid.img, x + canvasSize.width, y, size.width, size.height, asteroid.r);
  }
  if (x > canvasSize.width - size.width/2) {
    Asteroid.drawImage(ctx, asteroid.img, x - canvasSize.width, y, size.width, size.height, asteroid.r);
  }
  if (y < 0 + size.height/2) {
    Asteroid.drawImage(ctx, asteroid.img, x, y + canvasSize.height, size.width, size.height, asteroid.r);
  }
  if (y > canvasSize.height - size.height/2) {
    Asteroid.drawImage(ctx, asteroid.img, x, y - canvasSize.height, size.width, size.height, asteroid.r);
  }
}

Asteroid.drawImage = function(ctx, img, x, y, w, h, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.drawImage(img, -w/2, -h/2, w, h);
  ctx.restore();
}

Asteroid.calculateSize = function(asteroid, canvasWidth, canvasHeight) {
  var a = asteroid.img.width / asteroid.img.height;
  var h = canvasHeight * 0.05;
  var w = h * a;
  var d = (h + w) / 2;
  var r = d / 2;
  return {
    width: w,
    height: h,
    radius: r
  };
}

Asteroid.hitTestAsteroids = function(asteroid1, asteroid2) {
  var size1 = Asteroid.SIZE[asteroid1.level];
  var radius1 = size1.width / 2;
  var size2 = Asteroid.SIZE[asteroid2.level];
  var radius2 = size2.width / 2;
  var sqd = (asteroid1.x - asteroid2.x)*(asteroid1.x - asteroid2.x) + (asteroid1.y - asteroid2.y)*(asteroid1.y - asteroid2.y);
  if (sqd <= (radius1 + radius2) * (radius1 + radius2)) {
    return true;
  }
  return false;
}

Asteroid.doAsteroidCollision = function(asteroid1, asteroid2) {
  var m = (asteroid2.y - asteroid1.y) / (asteroid2.x - asteroid1.x);
  var reflectSlope = -1 / m;
  var reflectAngle = Math.atan(reflectSlope);
  Asteroid.reflectAsteroid(asteroid1, reflectAngle);
  Asteroid.reflectAsteroid(asteroid2, reflectAngle);
}

Asteroid.reflectAsteroid = function(asteroid, reflectAngle) {
  var velocity = MathHelper.calculateVelocity(asteroid.v.x, asteroid.v.y);
  var asteroidAngle = MathHelper.calculateAngle(asteroid.v.y, asteroid.v.x);
  var newAngle = MathHelper.calculateAngleOfReflection(asteroidAngle, reflectAngle);
  var vec = MathHelper.convertAngleToVector(newAngle);
  var newVelocity = velocity * Asteroid.ELASTICITY;
  asteroid.v.x = vec.x * newVelocity;
  asteroid.v.y = vec.y * newVelocity;
}

var MathHelper = {};

MathHelper.calculateVelocity = function(x, y) {
  var sqv = x*x + y*y;
  return Math.sqrt(sqv);
}

MathHelper.calculateAngle = function(rise, run) {
  var theta = 0;
  if (run == 0) {
    theta = rise > 0 ? Math.PI / 2 : -Math.PI / 2;
  }
  if (rise == 0) {
    theta = run > 0 ? 0 : Math.PI;
  }
  else {
    var m = rise / run;
    var theta = Math.atan(m);

    if (rise > 0 && run < 0) {
      theta += Math.PI;
    }
    if (rise < 0 && run < 0) {
      theta += Math.PI;
    }
  }
  if (theta < 0) {
    theta += Math.PI * 2;
  }
  return theta;
}

MathHelper.calculateAngleOfReflection = function(angle, reflectAngle) {
  var delta = angle - reflectAngle;
  var newAngle = reflectAngle - delta;
  return MathHelper.normalizeAngle(newAngle);
}

MathHelper.convertAngleToVector = function(angle) {
  var x = Math.cos(angle);
  var y = Math.sin(angle);

  return {
    'x': x,
    'y': y
  }
}

MathHelper.normalizeAngle = function(angle) {
  if (angle < 0) {
    angle += Math.PI * 2;
  }
  if (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
}

var Ship = {};

Ship.SIZE = {
  width: 4.29,
  height: 2.5
};

Ship.createShip = function(viewSize) {
  var image = new Image();
  image.src = "images/ship.svg";

  return {
    img: image,
    r: Math.PI * 3 / 2,
    x: viewSize.width / 2,
    y: viewSize.height / 2,
    v: {
      x: 0,
      y: 0
    }
  };
}

Ship.render = function(ctx, ship, canvasSize, viewSize) {
  var size = Util.convertSizeFromMetersToPx(Ship.SIZE, canvasSize, viewSize);
  var x = Util.convertValueFromMetersToPx(ship.x, canvasSize, viewSize);
  var y = Util.convertValueFromMetersToPx(ship.y, canvasSize, viewSize);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ship.r);
  ctx.drawImage(ship.img, -size.width/2, -size.height/2, size.width, size.height);
  ctx.restore();
}

var Util = {};

Util.randomValue = function(min, max, allowNegatives) {
  var value = Math.random() * (max - min) + min;
  if (allowNegatives) {
    if (Math.random() < 0.5) {
      value = -value;
    }
  }
  return value;
}

Util.convertPointFromMetersToPx = function(pt, canvasSize, viewSize) {
  var ratio = canvasSize.width / viewSize.width;
  return {
    x: pt.x * ratio,
    y: pt.y * ratio
  };
}

Util.convertSizeFromMetersToPx = function(size, canvasSize, viewSize) {
  var ratio = canvasSize.width / viewSize.width;
  return {
    width: size.width * ratio,
    height: size.height * ratio
  };
}

Util.convertValueFromMetersToPx = function(value, canvasSize, viewSize) {
  var ratio = canvasSize.width / viewSize.width;
  return value * ratio;
}
