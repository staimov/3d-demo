import { Raycaster } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

class PickHelper {
	pickedHandler;
	unpickingHandler;
	pickedObject;
	#pickedObjectSavedColor = 0;
	#raycaster = new Raycaster();
	
	pick(normalizedPosition, scene, camera, select) {
		// cast a ray through the frustum
		this.#raycaster.setFromCamera(normalizedPosition, camera);
		// get the list of objects the ray intersected
		const intersectedObjects = this.#raycaster.intersectObjects(scene.children, true);
		
		if (intersectedObjects.length) {
			if (this.pickedObject !== intersectedObjects[0].object) {
				this.#resetPickedIfAny();

				// pick the first object. It's the closest one
				this.pickedObject = intersectedObjects[0].object;
				//console.log(this.pickedObject);

				// save its color
				this.#pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
				// set its emissive color to yellow
				this.pickedObject.material.emissive.setHex(0xFFFF00);

				if (typeof this.pickedHandler === "function") { 
					this.pickedHandler(this.pickedObject);
				}
			}
		}
		else
		{
			this.#resetPickedIfAny();
		}
	}

	#resetPickedIfAny() {
		if (this.pickedObject) {
			if (typeof this.unpickingHandler === "function") { 
				this.unpickingHandler(this.pickedObject);
			}

			// restore the color if there is a picked object
			this.pickedObject.material.emissive.setHex(this.#pickedObjectSavedColor);			
			this.pickedObject = undefined;					
		}
	}
}

export { PickHelper };