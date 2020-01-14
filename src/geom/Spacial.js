/* Spacial Class
 * Used as an abstract class to provide any other class with 2D transormation
 * It it is basically just saying whatever this thing is, it has the physical properties
 * of location, orientation, motion, etc.
 */

import U from '../utilities';
import * as PIXI from 'pixi.js';
import { Point, Vector } from '.';

const _defaults = {
  maxSpeed: Infinity,
  maxRotation: Infinity,
  maxSize: Infinity,
  lockVelocityToAngle: false
};

export default class Spacial {
  /**
   * Abstract class that gives physical transformation: (translation, rotation, and dilation) properties to a subclass
   * @param {PIXI.Container} container What to PIXI container to draw the sprite onto.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  constructor (parent = null, {
    maxSpeed = _defaults.maxSpeed,
    maxRotation = _defaults.maxRotation,
    maxSize = _defaults.maxSize,
    lockVelocityToAngle = _defaults.lockVelocityToAngle
  } = _defaults) {
    this.id = U.uuid();
    this.parent = parent;

    // Spacial values
    this.pos = Point.Zero(); // Position - Tranlational value
    this.vel = Vector.Zero(); // Velocity - Change in translation per tick
    this.ang = 0; // Angle - Rotational value
    this.rot = 0; // Rotation - Change in rotation per tick
    this.scl = Vector.One(); // Scale - Dilational value
    this.dil = Vector.Zero(); // Dilation - Change in dilation per tick

    // States
    this.dynamic = true; // Spacial values are updated per tick
    this.awake = true; // Collision being checked per tick

    // Object extensions
    this.sprite = null; // PIXI.Sprite object set by 'makeSprite' function
    this.debug = null; // PIXI.Sprite object set by 'makeDebug' function
    this.watcher = null; // World.watcher object set by 'makeCollidable' function

    // Options
    this.maxSpeed = maxSpeed; // Caps +/- velocity at this value
    this.maxRotation = maxRotation; // Caps +/- rotation at this value
    this.maxSize = maxSize; // Caps +/- dilation at this value
    this.lockVelocityToAngle = lockVelocityToAngle; // If true, velocity is always relative to angle like propulsion.
  }

  /**
   * Sets up visual Sprite of this Spacial that will be rendered via PIXI.js
   * @param {PIXI.Container} container What to PIXI container to draw the sprite onto.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  makeSprite (container) {
    this.container = container;
    this.sprite = new PIXI.Sprite();
    this.gfx = new PIXI.Graphics();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.addChild(this.gfx);
    this.container.addChild(this.sprite);
    return this;
  }

  /**
   * Creates a simple outline of the collision area of the spacial rendered by PIXI.js
   * Overridden in subclasses since the shape to draw is unkonwn / abstract until envoked by subclass.
   * @param {PIXI.Container} container What to PIXI container to draw the debug shape onto.
   * @param {octal} color Color to make debug shape
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  makeDebug (container, color) {
    return this;
  }

  /**
   * Sets up the ability to for things to collide with this Spacial
   * To detect when this collides with other things you must extend in subclass and call world.watcher
   * @param {World} world Physics world that is managing collisions for the Spacial
   * @param {octal} [layer="default"] Groups collidable spacials together if you want granularity in collision detection
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  makeCollidable (world, layer = 'default') {
    this.world = world;
    this.layer = layer;
    this.world.add(this, this.layer);
    return this;
  }

  /**
   * Cleans up any artifacts that could prevent this from being garbage collected.
   */
  destroy () {
    this.run = () => {};
    if (this.sprite) this.container.removeChild(this.sprite);
    if (this.debug) this.container.removeChild(this.debug);
    if (this.world) this.world.remove(this, this.layer);
  }

  /**
   * Function to be called per tick a game loop.
   * Automatically handles tranlational, rotational, and dilational change per tick.
   * @param {number} delta How much time has passed since the last tick
   */
  run (delta) {
    if (this.dynamic) {
      this.shift(this.vel);
      this.rotate(this.rot);
      this.dilate(this.dil);
    }
  }

  /* =============================================================================================
   * ========== TRANSLATE FUNCTIONS ==============================================================
   * = Functions that deal with the coordinate location of the Spacial relative to its container =
   * ============================================================================================= */

  /**
   * Sets or Gets the position of the Spacial relative to its container.
   * @param {Point|number} xOrPoint If Point, sets horizontal and vertical location to Point. If number, sets horizontal location to value.
   * @param {number} y Sets vertical location to value. Ignored if first parameter is a Point.
   * @param {function} cb For internal use only to allow subclasses to extend this function easier.
   * @return {Point|Spacial} If no parameters, getter returns position as Point. If parameters, setter returns this Spacial for chaining functions.
   */
  position (xOrPoint, y, cb) {
    if (!arguments.length) return this.pos.copy();
    if (xOrPoint instanceof Object) {
      this.pos.x = xOrPoint.x;
      this.pos.y = xOrPoint.y;
    } else {
      this.pos.x = xOrPoint;
      this.pos.y = y;
    }
    if (this.sprite) {
      this.sprite.x = this.pos.x;
      this.sprite.y = this.pos.y;
    }
    if (this.debug) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
    }
    if (typeof cb === 'function') cb();
    return this;
  }

  /**
   * Sets or Gets the horizontal coordinate of the Spacial relative to its container.
   * @param {number} val Sets horizontal location to value.
   * @return {number|Spacial} If no parameter, getter returns horizontal location value. If parameter, setter returns this Spacial for chaining functions.
   */
  x (val) {
    if (!arguments.length) return this.pos.x;
    this.position(val, this.pos.y);
    return this;
  }

  /**
   * Sets or Gets the vertical coordinate of the Spacial relative to its container.
   * @param {number} val Sets vertical location to value.
   * @return {number|Spacial} If no parameter, getter returns vertical location value. If parameter, setter returns this Spacial for chaining functions.
   */
  y (val) {
    if (!arguments.length) return this.pos.y;
    this.position(this.pos.x, val);
    return this;
  }

  /**
   * Increments the Spacial's position coordinates by the amount specified.
   * @param {Vector|number} xOrVector If Vector, increments horizontal and vertical location by Vector. If number, increments horizontal location by value.
   * @param {number} y Increments vertical location by value. Ignored if first parameter is a Vector.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  shift (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.position(this.pos.x + xOrVector.x, this.pos.y + xOrVector.y);
    } else {
      this.position(this.pos.x + xOrVector, this.pos.y + y);
    }
    return this;
  }

  /**
   * Sets or Gets the velocity of the Spacial.
   * While dynamic is true, velocity automatically shifts position via the run function.
   * @param {Vector|number} xOrVector If Vector, sets tranlation per tick to Vector. If number, sets horizontal translation per tick to value.
   * @param {number} y Sets vertical translation per tick to value. Ignored if first parameter is a Vector.
   * @return {Vector|Spacial} If no parameters, getter returns tranlation per tick as Vector. If parameters, setter returns this Spacial for chaining functions.
   */
  velocity (xOrVector, y) {
    if (!arguments.length) return this.vel.copy();
    if (xOrVector instanceof Object) {
      this.vel.x = xOrVector.x;
      this.vel.y = xOrVector.y;
    } else {
      this.vel.x = xOrVector;
      this.vel.y = y;
    }
    if (this.vel.magnitude() > this.maxSpeed) this.vel.magnitude(this.maxSpeed);
    return this;
  }

  /**
   * Sets or Gets the horizontal velocity.
   * @param {number} val Sets horizontal velocity to value.
   * @return {number|Spacial} If no parameter, getter returns horizontal velocity. If parameter, setter returns this Spacial for chaining functions.
   */
  velocityX (val) {
    if (!arguments.length) return this.vel.x;
    this.velocity(val, this.vel.y);
    return this;
  }

  /**
   * Sets or Gets the vertical velocity.
   * @param {number} val Sets vertical velocity to value.
   * @return {number|Spacial} If no parameter, getter returns vertical velocity. If parameter, setter returns this Spacial for chaining functions.
   */
  velocityY (val) {
    if (!arguments.length) return this.vel.y;
    this.velocity(this.vel.x, val);
    return this;
  }

  /**
   * Increments the Spacial's velocity value by the amount specified.
   * Velocity will cap out at +/- maxSpeed if one is set regardless of input from accelerate.
   * @param {Vector|number} xOrVector If Vector, increments velocity by Vector. If number, increments horizontal velocity by value.
   * @param {number} y Increments veritcal velocity by value. Ignored if first parameter is a Vector.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  accelerate (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.velocity(this.vel.plus(xOrVector));
    } else {
      this.velocity(this.vel.x + xOrVector, this.vel.y + y);
    }
    return this;
  }

  /* ===================================================================
   * ========== ROTATION FUNCTIONS =====================================
   * = Functions that deal with the 2D angle of the Spacial in degrees =
   * =================================================================== */

  /**
   * Sets or Gets the angle of the Spacial in degrees where 0 is to the right of the unit circle.
   * Stored angle is always clamped to be between 0 and 360.
   * (Equivelant to 'position' for angle)
   * @param {number} degree Sets angle to value in degrees.
   * @param {function} cb For internal use only to allow subclasses to extend this function easier.
   * @return {number|Spacial} If no parameter, getter returns angle in degrees. If parameter, setter returns this Spacial for chaining functions.
   */
  angle (degree, cb) {
    if (!arguments.length) return U.clampAngle(this.ang);
    this.ang = U.clampAngle(degree);
    if (this.sprite) this.sprite.angle = this.ang;
    if (this.debug) this.debug.angle = this.ang;
    if (this.lockVelocityToAngle) this.vel.angle(this.ang);
    if (typeof cb === 'function') cb();
    return this;
  }

  /**
   * Increments the Spacial's angle by the degree specified.
   * (Equivelant to 'shift' for angle)
   * @param {number} degree Increments angle by degree.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  rotate (degree) {
    this.angle(this.ang + degree);
    return this;
  }

  /**
   * Sets or Gets the angular velocity of the Spacial.
   * While dynamic is true, rotation automatically rotates the angle via the run function.
   * (Equivelant to 'velocity' for angle)
   * @param {number} degree Sets degree change per tick to value.
   * @return {number|Spacial} If no parameters, getter returns degree change per tick. If parameters, setter returns this Spacial for chaining functions.
   */
  rotation (degree) {
    if (!arguments.length) return this.rot;
    this.rot = degree;
    if (Math.abs(this.rot) > this.maxRotation) this.rotation(this.maxRotation * Math.sign(this.rot));
    return this;
  }

  /**
   * Increments the Spacial's degree change per tick by the degree specified.
   * Degree change per tick will cap out at +/- maxRotation if one is set regardless of input from spin.
   * (Equivelant to 'accelerate' for angle)
   * @param {number} degree Increments degree change per tick by degree value.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  spin (degree) {
    this.rotation(this.rot + degree);
    return this;
  }

  /* =========================================================================================================================================
   * ========== TRANSFORM FUNCTIONS ==========================================================================================================
   * = Functions that deal with the scale and dimensions of the Spacial's visual and collision bounds relative to constants.json SCALE value =
   * ========================================================================================================================================= */

  /**
   * Sets or Gets the scale of the Spacial.
   * Scale factor change per tick will cap out at +/- maxSize
   * (Equivelant to 'position' for scale)
   * @param {Vector|number} xOrVector If Vector, sets horizontal and vertical scale to Vector. If number, sets horizontal scale to value.
   * @param {number} y Sets vertical scalae to value. Ignored if first parameter is a Vector.
   * @param {function} cb For internal use only to allow subclasses to extend this function easier.
   * @return {Vector|Spacial} If no parameters, getter returns scale as Vector. If parameters, setter returns this Spacial for chaining functions.
   */
  scale (xOrVector, y, cb) {
    if (!arguments.length) return this.scl.copy();
    if (xOrVector instanceof Object) {
      this.scl.x = xOrVector.x;
      this.scl.y = xOrVector.y;
    } else {
      this.scl.x = xOrVector;
      this.scl.y = y;
    }
    if (this.sprite) {
      this.sprite.scale.x = this.scl.x;
      this.sprite.scale.y = this.scl.y;
    }
    if (this.debug) {
      this.debug.scale.x = this.scl.x;
      this.debug.scale.y = this.scl.y;
    }
    if (this.scl.x > this.maxSize) this.scl.x = this.maxSize;
    if (this.scl.y > this.maxSize) this.scl.y = this.maxSize;
    if (typeof cb === 'function') cb();
    return this;
  }

  /**
   * Sets or Gets the horizontal scale factor of the Spacial.
   * @param {number} val Sets horizontal scale factor to value.
   * @return {number|Spacial} If no parameter, getter returns horizontal scale factor. If parameter, setter returns this Spacial for chaining functions.
   */
  scaleX (val) {
    if (!arguments.length) return this.scl.x;
    this.scale(val, this.scl.y);
    return this;
  }

  /**
   * Sets or Gets the vertical scale factor of the Spacial.
   * @param {number} val Sets vertical scale factor to value.
   * @return {number|Spacial} If no parameter, getter returns vertical scale factor. If parameter, setter returns this Spacial for chaining functions.
   */
  scaleY (val) {
    if (!arguments.length) return this.scl.y;
    this.scale(this.scl.x, val);
    return this;
  }

  /**
   * Increments the Spacial's scale factor by the amount specified.
   * @param {Vector|number} xOrVector If Vector, increments horizontal and vertical scale by Vector. If number, increments horizontal scale by value.
   * @param {number} y Increments vertical scale by value. Ignored if first parameter is a Vector.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  dilate (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.scale(this.scl.plus(xOrVector));
    } else {
      this.scale(this.scl.x + xOrVector, this.scl.y + y);
    }
    return this;
  }

  /**
   * Sets or Gets the rate of scale change of the Spacial.
   * While dynamic is true, scale automatically changes factor via the run function.
   * (Equivelant to 'velocity' for scale)
   * @param {Vector|number} xOrVector If Vector, sets dilation per tick to Vector. If number, sets horizontal dilation per tick to value.
   * @param {number} y Sets vertical dilation per tick to value. Ignored if first parameter is a Vector.
   * @return {Vector|Spacial} If no parameters, getter returns dilation per tick as Vector. If parameters, setter returns this Spacial for chaining functions.
   */
  dilation (xOrVector, y) {
    if (!arguments.length) return this.dil.copy();
    if (xOrVector instanceof Object) {
      this.dil.x = xOrVector.x;
      this.dil.y = xOrVector.y;
    } else {
      this.dil.x = xOrVector;
      this.dil.y = y;
    }
    return this;
  }

  /**
   * Sets or Gets the horizontal dilation.
   * @param {number} val Sets horizontal scale factor to value.
   * @return {number|Spacial} If no parameter, getter returns horizontal scale factor. If parameter, setter returns this Spacial for chaining functions.
   */
  dilationX (val) {
    if (!arguments.length) return this.dil.x;
    this.dilation(val, this.dil.y);
    return this;
  }

  /**
   * Sets or Gets the vertical dilation.
   * @param {number} val Sets vertical scale factor to value.
   * @return {number|Spacial} If no parameter, getter returns vertical scale factor. If parameter, setter returns this Spacial for chaining functions.
   */
  dilationY (val) {
    if (!arguments.length) return this.dil.y;
    this.dilation(this.dil.x, val);
    return this;
  }

  /**
   * Increments the Spacial's scale change per tick by the amount specified.
   * (Equivelant to 'accelerate' for scale)
   * @param {Vector|number} xOrVector If Vector, increments scale change per tick by Vector. If number, increments horizontal scale per tick by value.
   * @param {number} y Increments vertical scale change per tick by value. Ignored if first parameter is a Vector.
   * @return {Spacial} Returns this Spacial for chaining functions.
   */
  stretch (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.dilation(this.dil.plus(xOrVector));
    } else {
      this.dilation(this.dil.x + xOrVector, this.dil.y + y);
    }
    return this;
  }
}
