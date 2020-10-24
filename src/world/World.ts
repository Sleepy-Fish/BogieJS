import Watcher from './Watcher';
import { ICollidable } from '../attributes';

export default class World {
  layers: { [key: string]: ICollidable[]; };

  constructor () {
    this.layers = {
      global: [],
    };
  }

  getId (interactors: ICollidable|ICollidable[]|string): string {
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

  add (spacial: ICollidable, layer: string = 'global'): void {
    if (!this.layer(layer).includes(spacial)) {
      this.layer(layer).push(spacial);
    }
  }

  remove (spacial: ICollidable, layer: string = 'global'): void {
    const index = this.layer(layer).indexOf(spacial);
    if (index >= 0) {
      this.layer(layer).splice(index, 1);
    }
  }

  layer (layer: string): ICollidable[] {
    if (!Array.isArray(this.layers[layer])) this.layers[layer] = [];
    return this.layers[layer];
  }

  watcher (actor: ICollidable, other: ICollidable|ICollidable[]|string): Watcher {
    let interactors: ICollidable[];
    if (typeof other === 'string') {
      interactors = this.layer(other);
    } else if (!Array.isArray(other)) {
      interactors = [other];
    } else {
      interactors = other;
    }
    const watcher = new Watcher(this.getId(other), () => {
      for (const interactor of interactors) {
        actor.check(watcher, interactor);
      }
    });
    return watcher;
  }
}
