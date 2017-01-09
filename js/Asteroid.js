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
