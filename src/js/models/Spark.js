import PIXI from "pixi.js";
import * as utils from "../utils";

export class Spark {
  constructor(startNodeIndex, endNodeIndex) {
    this.id = utils.GenerateID();
    this.alive = true;
    this.spawnTime = new Date();
    this.duration = this.config.sparkLifetime;
    this.percentComplete = 0.01;

    this.startNodeIndex = startNodeIndex;
    this.endNodeIndex = endNodeIndex;
    this.startPoint = nodes[this.startNodeIndex].position;
    this.endPoint = nodes[this.endNodeIndex].position;

    this.updatePoints(this.startPoint, this.endPoint);

    this.position = {
      "x": this.startPoint.x,
      "y": this.startPoint.y
    };
  }

  calculateY(x) {
    if (this.startPoint.x == this.endPoint.x) {
      let y = this.startPoint.y + (this.yDistance * this.percentComplete);
    } else {
      let y = (this.slope * x) + this.intercept;
    }

    return y;
  }

  step() {
    // Calculate position from lifetime / duration
    let now = new Date();
    let timeSince = now - this.spawnTime;

    if (timeSince > this.duration) {
      this.alive = false;
      nodes[this.endNodeIndex].tryPulse();
    } else {
      this.startPoint = nodes[this.startNodeIndex].position;
      this.endPoint = nodes[this.endNodeIndex].position;
      this.updatePoints(this.startPoint, this.endPoint);
      this.percentComplete = timeSince / this.duration;

      let x = this.startPoint.x + (this.xDistance * this.percentComplete);
      x = Math.round(x * 100) / 100;

      let y = this.calculateY(x);

      this.position.x = x;
      this.position.y = y;
    }

    return this.alive;
  }

  updatePoints(newStart, newEnd) {
    this.startPoint = newStart;
    this.endPoint = newEnd;

    //this.pointDistance = Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2))
    this.xDistance = this.endPoint.x - this.startPoint.x;
    this.yDistance = this.endPoint.y - this.startPoint.y;

    this.slope = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
    this.intercept = this.startPoint.y - (this.startPoint.x * this.slope);
  }
}