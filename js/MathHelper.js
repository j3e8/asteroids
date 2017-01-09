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
