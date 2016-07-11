import PIXI from "pixi.js";
import { SparksEngine } from "./models/SparksEngine.js";

let engine = new SparksEngine({
  "backgroundColor": "#12487B",
  "canvasHeight": 900,
  "canvasWidth": 1600,
  "fpsContainer": "render_fps",
  "nodeColor": "#0F97F7",
  "nodeCount": 300,
  "nodeReach": 50,
  "maxFPS": 60,
  "maxOpacity": 0.4,
  "sparkColor": "rgba(255, 255, 255, 0.4)",
  "sparkLifetime": 500
});

if(engine.world instanceof PIXI.CanvasRenderer) {
  document.getElementById("render_type").innerHTML = "Canvas";
} else {
  document.getElementById("render_type").innerHTML = "WebGL";
}