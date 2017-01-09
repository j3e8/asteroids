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
