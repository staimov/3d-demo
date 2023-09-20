import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';	

function createControls(camera, canvas) {
	const controls = new OrbitControls(camera, canvas);

	controls.minDistance = 2;
	controls.maxDistance = 30;

	controls.enableDamping = true;

	// forward controls.update to our custom .tick method
	controls.tick = () => controls.update();

	return controls;
}

export { createControls };
