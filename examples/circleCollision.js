if (!window.Bogie.scenes) window.Bogie.scenes = {};
window.Bogie.scenes.circleCollision = () => {
  // Clear existing example and re-initialize
  window.Bogie.init();

  // Create global shortcut variables
  // (These would normally be declared via package import syntax)
  const World = window.Bogie.Physics.World;
  const Circle = window.Bogie.Geom.Circle;
  const Point = window.Bogie.Geom.Point;
  const Vector = window.Bogie.Geom.Vector;
  const app = window.app; // This is set in init()

  // <START> //
  // Physics World handles collision layers and exposes collision watcher creation
  const world = new World();

  // Create a small circle that will move about the screen and collide with things
  const actor = new Circle(null, {
    radius: 10
  })
    .position(new Point(10, 10))
    .makeCollidable(world)
    .makeDebug(app.stage);

  // Create a large circle that will stay centered on screen and be collided with
  const interactor = new Circle(null, {
    radius: 80
  })
    .position(new Point(app.view.width / 2, app.view.height / 2))
    .makeCollidable(world)
    .makeDebug(app.stage);

  // Initialize velocity of actor circle so it will collide
  // To do this we set to the velocity vector to the angle between both circle centers
  const angle = actor.position().angle(interactor.position());
  actor.velocity(Vector.Zero().magnitude(4).angle(angle));

  // Store how far apart the circles start so we know when to reset the scene
  const startDistance = actor.position().distance(interactor.position());

  // Set event handlers for collision events
  actor.on('enter', () => {
    // enter is when the actor becomes entirely eclosed within interactor (if possible due to size)
    interactor.makeDebug(null, 0x00ffff);
  }, interactor);

  actor.on('leave', () => {
    // leave is when the actor and interactor become entirely decoupled with no overlaps
    interactor.makeDebug(null, 0x009900);
  }, interactor);
  actor.on('collide', () => {
    // collide is a one time event that fires when the bounds of actor and interaction first overlap
    interactor.makeDebug(null, 0xff0000);
  }, interactor);
  actor.on('collide-inner', () => {
    // collide-inner is like collide but only happens when the actor was previously inside of interactor
    actor.makeDebug(null, 0x009900);
  }, interactor);
  actor.on('collide-outer', () => {
    // collide-outer is like collide but only happens when the actor was previously outside of interactor
    actor.makeDebug(null, 0x0000ff);
  }, interactor);

  // Add Bogie to PIXI app
  const loop = delta => {
    // Reset actor postion if once it gets too far away
    if (actor.position().distance(interactor.position()) > startDistance) actor.position(new Point(10, 10));
    // Run the Bogie objects that have a run function
    actor.run(delta);
    interactor.run(delta);
  };
  app.ticker.add(delta => loop(delta));
  // <END> //
};
