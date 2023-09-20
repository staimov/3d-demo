import { RGBELoader } from "https://unpkg.com/three@0.122.0/examples/jsm/loaders/RGBELoader.js";
import {
  PMREMGenerator,
  UnsignedByteType,
} from "https://unpkg.com/three@0.122.0/build/three.module.js";
import { getBaseUrl } from "../../systems/utils.js";

async function loadEnvironmentMap(renderer, scene, showEnvironment) {
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const loader = new RGBELoader()
    .setDataType(UnsignedByteType)
    .setPath(getBaseUrl() + "assets/textures/");

  const texture = await loader.loadAsync("abandoned_hopper_terminal_03_2k.hdr");

  const envMap = pmremGenerator.fromEquirectangular(texture).texture;

  if (showEnvironment) {
    scene.background = envMap;
  }

  scene.environment = envMap;

  texture.dispose();
  pmremGenerator.dispose();
}

export { loadEnvironmentMap };
