import { Tether } from "./Tether";

export class TetherManager {
  constructor(config) {
    this.config = config;
    this.maxDistance = this.config.nodeReach;
    this.tetherList = [];

    this.initialize();
  }

  initialize() {
    for (let i=0; i < (this.config.nodeCount * 10); i++){
      this.tetherList.push(new Tether());
    };
  }

  getTether() {
    let deadTethers = this.tetherList.filter((e, i, a) => {
      return e.alive === false;
    });

    if (deadTethers.length > 0) {
      return deadTethers[0];
    } else {
      let newTether = new Tether();
      this.tetherList.push(newTether);

      return newTether;
    }
  }
}