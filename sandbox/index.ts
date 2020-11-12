import './style';
import * as PIXI from 'pixi.js';
import * as prism from 'prismjs';
import {
  rectRectCollision,
  rectRectCollisionStr,
  circCircCollision,
  circCircCollisionStr,
} from './samples';

let app = new PIXI.Application();
function resetApp (): void {
  const width = Math.min(800, window.innerWidth);
  const height = Math.round(width * 0.75);
  if (app.ticker.started) {
    app.ticker.stop();
    app.ticker.destroy();
  }
  app.stage.destroy({
    children: true,
    texture: true,
    baseTexture: true,
  });
  app = new PIXI.Application({
    width,
    height,
    backgroundColor: 0x000000,
  });
  const viewport = document.getElementById('viewport');
  if (viewport !== null) {
    viewport.innerHTML = '';
    viewport.appendChild(app.view);
  }
  window.addEventListener('resize', () => {
    const width = Math.min(800, window.innerWidth);
    const height = Math.round(width * 0.75);
    app.renderer.resize(width, height);
  });
};

const setRectRectCollision = (): void => {
  resetApp();
  rectRectCollision(app);
  const code = document.getElementById('prism');
  if (code !== null) {
    code.innerHTML = prism.highlight(
      rectRectCollisionStr,
      prism.languages.javascript,
      'javascript',
    );
  }
};

const setCircCircCollision = (): void => {
  resetApp();
  circCircCollision(app);
  const code = document.getElementById('prism');
  if (code !== null) {
    code.innerHTML = prism.highlight(
      circCircCollisionStr,
      prism.languages.javascript,
      'javascript',
    );
  }
};

const rectRectCollisionButton = document.getElementById('rect-rect-collision');
if (rectRectCollisionButton !== null) {
  rectRectCollisionButton.onclick = setRectRectCollision;
};

const circCircCollisionButton = document.getElementById('circ-circ-collision');
if (circCircCollisionButton !== null) {
  circCircCollisionButton.onclick = setCircCircCollision;
};

setRectRectCollision();
