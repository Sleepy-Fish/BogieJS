import { EventEmitter } from 'events';

export default class Watcher extends EventEmitter {
  id: string;
  run: Function;

  constructor (id: string, run: Function) {
    super();
    this.id = id;
    this.run = run;
  }
}
