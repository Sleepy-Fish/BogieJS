import * as physics from './physics';
import * as geom from './geom';

const Bogie = {
  physics,
  geom
};

if (window) window.Bogie = Bogie;

export default Bogie;
