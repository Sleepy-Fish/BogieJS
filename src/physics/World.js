import collisions from './collisions';
import { EventEmitter } from 'events';

export default class World {
  constructor () {
    this.layers = {
      global: []
    };
  }

  add (spacial, layer = 'global') {
    if (this.layer(layer).indexOf(spacial) < 0) {
      this.layer(layer).push(spacial);
    }
  }

  remove (spacial, layer = 'global') {
    const index = this.layer(layer).indexOf(spacial);
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
    if (!collisions[actor.type]) {
      watcher.run = () => { console.error(`Collision Actor type ${actor.type} not found!`); };
      return watcher;
    }
    watcher.run = () => {
      for (const interactor of interactors) {
        const handleCollision = collisions[actor.type][interactor.type];
        if (typeof handleCollision !== 'function') {
          console.error(`Collision Interactor type ${interactor.type} not found for Actor type ${actor.type}!`);
          continue;
        }
        handleCollision(watcher, actor, interactor);
      }
    };
    return watcher;
  }
}
