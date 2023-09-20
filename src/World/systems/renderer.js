import { WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, PCFSoftShadowMap, PCFShadowMap } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

function createRenderer() {
	const renderer = new WebGLRenderer({ antialias: true });

	renderer.physicallyCorrectLights = true;
	  
	renderer.toneMapping = ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = sRGBEncoding;	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;	  

	return renderer;
}

export { createRenderer };
