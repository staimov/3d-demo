import { PerspectiveCamera } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

function createCamera() {
  const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

  camera.position.set(2.5, 10, 10);

  return camera;
}

export { createCamera };
