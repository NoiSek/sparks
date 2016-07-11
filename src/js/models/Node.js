import PIXI from "pixi.js";
import * as utils from "../utils.js";

export class Node extends PIXI.Sprite {
  constructor(x, y, config, texture) {
    super(texture);
    this.id = utils.GenerateID();
    this.config = config;
    this.hasDrawn = false;
    this.justPulsed = false;
    this.neighbors = [];

    this.position = {
      "x": x || utils.RandomInt(100, 1500),
      "y": y || utils.RandomInt(100, 800)
    };

    this.velocity = {
      "x": utils.RandomRange(0.125, 0.45, true),
      "y": utils.RandomRange(0.125, 0.45, true)
    };

    // Initialize color by converting to RGB and randomizing color slightly
    let randomizeTint = function(x, variance) {
      return Math.floor(
        utils.RandomRange(
          Math.max((x - variance), 0), 
          Math.min((x + variance), 255)
        )
      );
    };

    let color = utils.HexToRGB(this.config.nodeColor);
    // Swap the Red and Blue channels for 15% of nodes.
    if (Math.random() <= 0.15) {
      let red = color.r;
      let blue = color.b;

      color.b = red;
      color.r = blue;
    }

    this.color = {
      "r": randomizeTint(color.r, 15),
      "g": randomizeTint(color.g, 35),
      "b": randomizeTint(color.b, 75)
    }
    
    let tint = utils.RGBToHex(this.color);
    this.tint = parseInt(tint.replace("#", ""), 16);

    // Generate and store 20% brighter version for pulsing.
    let brighten = function(x) {
      return Math.floor(Math.max(x * 1.2, 255));
    };

    this.pulseColor = {
      "r": brighten(this.color.r),
      "g": brighten(this.color.g),
      "b": brighten(this.color.b)
    };

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

        for (let i = 0; i < Object.keys(this.color).length; i++) {
          let key = Object.keys(this.color)[i];
          outColor[key] = utils.scale(this.color[key], this.pulseColor[key], percentage);
        }

        return formatColor(outColor);
      } else {
        let outColor = [];
        // Subtract half the duration from both sides to normalize 5/10 to 0/5
        let percentage = Math.round(((timeSince - (this.pulseDuration / 2)) / (this.pulseDuration / 2)) * 100) / 100;
        percentage = Math.max(0.01, percentage);

        for (let i = 0; i < Object.keys(this.color).length; i++) {
          let key = Object.keys(this.color)[i];
          outColor[key] = utils.scale(this.pulseColor[key], this.color[key], percentage);
        }

        return utils.formatColor(outColor);
      }
    } else {
      return utils.formatColor(this.color);
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