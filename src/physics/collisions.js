const states = {};

export default {
  circleToCircle: (e, actor, interactor) => {
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
};
