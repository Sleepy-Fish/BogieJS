if (!window.Bogie.scenes) window.Bogie.scenes = {};
window.Bogie.scenes.circleRectCollision = () => {
  // Clear existing example and re-initialize
  window.Bogie.init();

  // Create global shortcut variables
  // (These would normally be declared via package import syntax)
  const World = window.Bogie.Physics.World;
  const Spacial = window.Bogie.Shapes.Spacial;
  const Point = window.Bogie.Geom.Point;
  const Vector = window.Bogie.Geom.Vector;
  const app = window.app; // This is set in init()

  // <START> //
  // Physics World handles collision layers and exposes collision watcher creation
  const world = new World();

  // Create a small rectangle that will move about the screen and collide with things
  const actor = new Spacial(null, {
    shape: 'rectangle',
    parent: app.stage,
    world: world,
    height: 60,
    width: 45,
  })
    .position(new Point(200, 10))
    .rotation(1);

  // Create a large circle that will stay centered on screen and be collided with
  const interactor = new Spacial(null, {
    shape: 'circle',
    parent: app.stage,
    world: world,
    radius: 100,
  })
    .position(new Point(app.view.width / 2, app.view.height / 2));

  // Initialize velocity of actor rectangle so it will collide
  // To do this we set to the velocity vector to the angle between both circle centers
  actor.velocity(new Vector(1, 3));

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
    const actorPos = actor.position();
    if (actorPos.y > 600) actor.velocityY(-3);
    if (actorPos.y < 10) actor.velocityY(3);
    // Reset actor postion if once it gets too far away
    if (actorPos.x > 600) actor.x(200);
    // Run the Bogie objects that have a run function
    actor.run(delta);
    interactor.run(delta);
  };
  app.ticker.add(delta => loop(delta));
  // <END> //
};
