import PIXI from "pixi.js";
import * as utils from "./webgl.utils";

export class Node extends PIXI.Sprite {
  constructor(x, y, config, texture) {
    super(texture);
    this.id = utils.GenerateID();
    this.config = config;
    this.justPulsed = false;

    this.position = {
      "x": x || utils.RandomInt(100, 1500),
      "y": y || utils.RandomInt(100, 800)
    };

    this.velocity = {
      //"x": utils.RandomRange(0.125, 0.125, true),
      //"y": utils.RandomRange(0.125, 0.125, true)
      "x": utils.RandomRange(0.125, 0.45, true),
      "y": utils.RandomRange(0.125, 0.45, true)
    };

    let color = this.config.nodeColor;
    let colorStart = this.config.nodeColor.indexOf("(") + 1;
    let colorEnd = this.config.nodeColor.indexOf(")");
    let startColor = color.slice(colorStart, colorEnd).replace(" ", "").split(",");

    this.startColor = {
      "r": startColor[0],
      "g": startColor[1],
      "b": startColor[2]
    };

    this.pulseColor = {
      "r": 230,
      "g": 230,
      "b": 230
    };

    this.hasDrawn = false;
    this.lastPulsed = new Date();
    this.pulseActive = false;
    this.pulseDuration = 1000;
  }

  canPulse() {
    let now = new Date();
    let timeSince = (now - this.lastPulsed);

    if (timeSince > (2000 + this.pulseDuration) && !this.pulseActive) {
      return true;
    } else {
      return false;
    }
  }

  getColor() {
    if (this.isPulsing()) {
      let now = new Date();
      let timeSince = now - this.lastPulsed;

      if (timeSince <= (this.pulseDuration / 5)) {
        let outColor = {};
        let percentage = Math.round((timeSince / (this.pulseDuration / 5)) * 100) / 100;
        percentage = Math.max(0.01, percentage);

        for (let i = 0; i < Object.keys(this.startColor).length; i++) {
          let key = Object.keys(this.startColor)[i];
          outColor[key] = utils.scale(this.startColor[key], this.pulseColor[key], percentage);
        }

        return formatColor(outColor);
      } else {
        let outColor = [];
        // Subtract half the duration from both sides to normalize 5/10 to 0/5
        let percentage = Math.round(((timeSince - (this.pulseDuration / 2)) / (this.pulseDuration / 2)) * 100) / 100;
        percentage = Math.max(0.01, percentage);

        for (let i = 0; i < Object.keys(this.startColor).length; i++) {
          let key = Object.keys(this.startColor)[i];
          outColor[key] = utils.scale(this.pulseColor[key], this.startColor[key], percentage);
        }

        return utils.formatColor(outColor);
      }
    } else {
      return utils.formatColor(this.startColor);
    }
  }

  pulse() {
    this.lastPulsed = new Date();
    this.pulseActive = true;
    this.justPulsed = true;
  }

  isPulsing() {
    return this.pulseActive;
  }

  step() {
    if (this.isPulsing()) {
      let now = new Date();

      if ((now - this.lastPulsed) > this.pulseDuration) {
        this.pulseActive = false;
      }
    } else if (this.canPulse() && (Math.random() > 0.999)) {
      this.pulse();
    }
  }

  tryPulse() {
    if (this.canPulse()) {
      this.pulse();
    }
  }
}

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