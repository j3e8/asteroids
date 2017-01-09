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
