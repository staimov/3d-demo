import { Color, Scene } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

function createScene(backColor) {
  const scene = new Scene();

  scene.background = new Color(backColor);

  return scene;
}

export { createScene };
