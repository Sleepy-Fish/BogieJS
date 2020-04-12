const states = {};
const SEPARATE = 0;
const OVERLAPPING = 1;
const ENCLOSED = 2;

const separatingAxis = (actor, interactor) => {
  const a1 = actor.axes(interactor);
  const a2 = interactor.axes(actor);
  let enclosed = true;
  for (const axis of a1) {
    const p1 = actor.project(axis);
    const p2 = interactor.project(axis);
    if (p1.min > p2.max || p2.min > p1.max) return SEPARATE;
    if (enclosed && (p1.min < p2.min || p1.max > p2.max)) enclosed = false;
  }

  for (const axis of a2) {
    const p1 = actor.project(axis);
    const p2 = interactor.project(axis);
    if (p1.min > p2.max || p2.min > p1.max) return SEPARATE;
    if (enclosed && (p1.min < p2.min || p1.max > p2.max)) enclosed = false;
  }

  return enclosed ? ENCLOSED : OVERLAPPING;
};

export default {
  rectangle: {
    rectangle: (e, actor, interactor) => {
      const distance = actor.position().distance(interactor.position());
      const key = `${actor.id}-${interactor.id}`;
      const last = states[key] || null;
      // It's impossible to have a collision at this range
      if (distance > actor.hypotenus + interactor.hypotenus) {
        states[key] = 'outside';
        if (last !== 'outside') e.emit('leave', actor, interactor);
      } else {
        switch (separatingAxis(actor, interactor)) {
          case SEPARATE:
            states[key] = 'outside';
            if (last !== 'outside') e.emit('leave', actor, interactor);
            break;
          case ENCLOSED:
            states[key] = 'inside';
            if (last !== 'inside') e.emit('enter', actor, interactor);
            break;
          case OVERLAPPING:
            states[key] = 'colliding';
            if (last !== 'colliding') e.emit('collide', actor, interactor);
            if (last === 'inside') e.emit('collide-inner', actor, interactor);
            if (last === 'outside') e.emit('collide-outer', actor, interactor);
        }
      }
    },
    circle: (e, actor, interactor) => {
      const distance = actor.position().distance(interactor.position());
      const key = `${actor.id}-${interactor.id}`;
      const last = states[key] || null;
      // It's impossible to have a collision at this range
      if (distance > actor.hypotenus + interactor.radius) {
        states[key] = 'outside';
        if (last !== 'outside') e.emit('leave', actor, interactor);
      } else {
        switch (separatingAxis(actor, interactor)) {
          case SEPARATE:
            states[key] = 'outside';
            if (last !== 'outside') e.emit('leave', actor, interactor);
            break;
          case ENCLOSED:
            states[key] = 'inside';
            if (last !== 'inside') e.emit('enter', actor, interactor);
            break;
          case OVERLAPPING:
            states[key] = 'colliding';
            if (last !== 'colliding') e.emit('collide', actor, interactor);
            if (last === 'inside') e.emit('collide-inner', actor, interactor);
            if (last === 'outside') e.emit('collide-outer', actor, interactor);
        }
      }
    }
  },

  circle: {
    rectangle: (e, actor, interactor) => { /* No Op */ },
    circle: (e, actor, interactor) => {
      const distance = actor.position().distance(interactor.position());
      const key = `${actor.id}-${interactor.id}`;
      const last = states[key] || null;
      if (distance > (actor.radius + interactor.radius)) {
        // actor is outside of interactor
        states[key] = 'outside';
        if (last !== 'outside') e.emit('leave', actor, interactor);
      } else if (distance < Math.abs(actor.radius - interactor.radius)) {
        // actor is entirely inside interactor
        states[key] = 'inside';
        if (last !== 'inside') e.emit('enter', actor, interactor);
      } else {
        // actor is crossing borders with interactor
        states[key] = 'colliding';
        if (last !== 'colliding') e.emit('collide', actor, interactor);
        if (last === 'inside') e.emit('collide-inner', actor, interactor);
        if (last === 'outside') e.emit('collide-outer', actor, interactor);
      }
    }
  }

};
