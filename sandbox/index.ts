import $ from 'jquery';
import './style';
import * as PIXI from 'pixi.js';
import * as prism from 'prismjs';
import {
  rectRectCollision,
  rectRectCollisionStr,
  circCircCollision,
  circCircCollisionStr,
} from './samples';

const scenes = [
  { function: rectRectCollision, code: rectRectCollisionStr, button: $('#rect-rect-collision') },
  { function: circCircCollision, code: circCircCollisionStr, button: $('#circ-circ-collision') },
];
const viewport = $('#viewport');
const code = $('#prism');

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
  viewport.html(app.view);
  $(window).on('resize', function () {
    const width = Math.min(800, window.innerWidth);
    const height = Math.round(width * 0.75);
    app.renderer.resize(width, height);
  });
};

for (const scene of scenes) {
  scene.button.on('click', function () {
    $('.scene-button').css({ borderColor: '#009900' });
    scene.button.css({ borderColor: '#00ff00' });
    resetApp();
    scene.function(app);
    code.html(prism.highlight(
      scene.code,
      prism.languages.javascript,
      'javascript',
    ));
  });
};
scenes[0].button.click();
