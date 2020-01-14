import collisions from './collisions';
import { EventEmitter } from 'events';

export default class World {
  constructor () {
    this.layers = {
      global: []
    };
  }

  add (body, layer = 'global') {
    if (this.layer(layer).indexOf(body) < 0) {
      this.layer(layer).push(body);
    }
  }

  remove (body, layer = 'global') {
    const index = this.layer(layer).indexOf(body);
    if (index >= 0) {
      this.layer(layer).splice(index, 1);
    }
  }

  layer (layer) {
    if (!this.layers[layer]) this.layers[layer] = [];
    return this.layers[layer];
  }

  watcher (actor, other) {
    let interactors = other; // assumes interactor was stored as array of shapes
    if (typeof other === 'string') {
      interactors = this.layer(other);
    } else if (!Array.isArray(other)) {
      interactors = [other];
    }
    const watcher = new EventEmitter();
    watcher.run = () => { console.warn(' no nono non on '); };
    switch (actor.type) {
      case 'circle':
        watcher.run = () => {
          for (const interactor of interactors) {
            switch (interactor.type) {
              case 'circle':
                collisions.circleToCircle(watcher, actor, interactor);
                break;
            }
          }
        };
        break;
    }
    return watcher;
  }
}
