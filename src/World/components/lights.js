import { DirectionalLight, HemisphereLight, AmbientLight } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

function createLights() {
  const ambientLight = new HemisphereLight(
     'white',
     'darkslategrey',
     1
  );

  const mainLight = new DirectionalLight('white', 5);
  mainLight.position.set(10, 10, 10);
  mainLight.castShadow = true;  
  mainLight.shadow.radius = 8;

  return { ambientLight, mainLight };
}

export { createLights };
