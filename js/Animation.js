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
