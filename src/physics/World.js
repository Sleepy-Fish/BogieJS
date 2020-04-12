import U from '../utilities';
import collisions from './collisions';
import { EventEmitter } from 'events';

export default class World {
  constructor () {
    this.layers = {
      global: []
    };
  }

  getId (interactors) {
    if (typeof interactors === 'string') {
      // World layer so return it as cache id
      return interactors;
    } else if (Array.isArray(interactors)) {
      // Array of spacials so concat the ids for cache id
      return interactors.map(x => x.id).join('-');
    } else {
      // Passed a single spacial so return id for cache id
      return interactors.id;
    }
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

  // actor is the spacial that is doing the colidding
  // other is either
  //  -- 1 a sacial (that you want to watch for collisions on)
  // -- 2 an array of spacials (that you want to watch for collisions on)
  // -- 3 a string (the world layer name which you're watching for collisions)
  watcher (actor, other) {
    let interactors = other; // assumes interactor was stored as array of shapes
    if (typeof other === 'string') {
      interactors = this.layer(other);
    } else if (!Array.isArray(other)) {
      interactors = [other];
    }
    const watcher = new EventEmitter();
    watcher.id = this.getId(other);
    if (!collisions[actor.type]) {
      watcher.run = () => { U.log(`Collision Actor type ${actor.type} not found!`, 'error'); };
      return watcher;
    }
    watcher.run = () => {
      for (const interactor of interactors) {
        const handleCollision = collisions[actor.type][interactor.type];
        if (typeof handleCollision !== 'function') {
          U.log(`Collision Interactor type ${interactor.type} not found for Actor type ${actor.type}!`, 'error');
          continue;
        }
        handleCollision(watcher, actor, interactor);
      }
    };
    return watcher;
  }
}
