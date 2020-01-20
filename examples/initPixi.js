window.Bogie.initPixi = () => {
  var viewport = document.getElementById('view-port');
  viewport.innerHTML = '';
  window.app = null;
  const app = new window.PIXI.Application({
    width: Math.min(800, window.innerWidth),
    height: 600
  });
  viewport.appendChild(app.view);
  window.app = app;
};
