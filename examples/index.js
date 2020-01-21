window.Bogie.init = () => {
  var viewport = document.getElementById('viewport');
  viewport.innerHTML = '';
  window.app = null;
  const app = new window.PIXI.Application({
    width: Math.min(800, window.innerWidth),
    height: 600
  });
  viewport.appendChild(app.view);
  window.app = app;
};

window.Bogie.selectScene = (elem, scene) => {
  window.Bogie.scenes[scene]();

  for (const button of document.getElementsByTagName('button')) {
    button.classList.remove('active');
  }
  elem.classList.add('active');

  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      let raw = xmlHttp.responseText;
      if (raw.includes('// <START> //')) raw = raw.split('// <START> //')[1];
      if (raw.includes('// <END> //')) raw = raw.split('// <END> //')[0];
      const html = window.Prism.highlight(
        raw,
        window.Prism.languages.javascript,
        'javascript'
      );
      document.getElementById('prism').innerHTML = html;
    }
  };
  xmlHttp.open('GET', `${scene}.js`, true);
  xmlHttp.send(null);
};
