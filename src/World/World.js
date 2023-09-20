import { Vector3 } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

import { loadEnvironmentMap } from './components/environmentMap/environmentMap.js';
import { TextLabel } from './components/TextLabel.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

let camera;
let controls;
let renderer;
let scene;
let loop;
let sceneContainer;

class World {
	showTestObjects = false;
	showAllObjectNames = false;
	showInfoLabel = false;
	model;
	dataContainers;
	webSocket;

	#objectLabels;
	#selectedObjectLabel;
	
	constructor(container, backColor) {
		camera = createCamera();
		renderer = createRenderer();
		scene = createScene(backColor);
		loop = new Loop(camera, scene, renderer);
		sceneContainer = container;
		sceneContainer.append(renderer.domElement);
		controls = createControls(camera, renderer.domElement);

		const { ambientLight, mainLight } = createLights();

		loop.updatables.push(controls);
		scene.add(ambientLight, mainLight);

		const resizer = new Resizer(container, camera, renderer);

		this.#objectLabels = {};
	}

	async init() {
		await loadEnvironmentMap(renderer, scene, this.showEnvironment);  
		
		await this.model.load();

		this.#configureWebSocket();

		this.#configureScene();

		this.#configurePicker();
	}

	#configureScene() {
		if (this.model.children.length > 0) {
			// move the target to the center of the front object
			controls.target.copy(this.model.children[0].object.position);

			for (var i = 0; i < this.model.children.length; i++) {
				scene.add(this.model.children[i].object);

				if (this.showAllObjectNames) {
					var displayName = this.#getDisplayName(this.model.children[i]); 
					if (displayName) {
						var container = this.dataContainers.find(x => x.name === displayName.name);

						if (this.webSocket && container.dataPoints) {
							for (var j = 0; j < container.dataPoints.length; ++j) {
								this.webSocket.dpConnect(container.dataPoints[j].name);
							}
						}

						var labelText = container.getText();
						var label = this.#addLabel(labelText, this.model.children[i].object, new Vector3(0,0,0));
						this.#objectLabels[displayName.name] = label;
					}
				}
			}	
		}

		if (this.showInfoLabel) {
			var infoLabel = this.#addLabel(this.model.description, scene, new Vector3(3, 3, 0));
			loop.infoLabel = infoLabel;
		}
	}

	#configureWebSocket() {
		var self = this;

		if (this.webSocket) {
			this.webSocket.onValueReceived = function(name, value) { 
				//console.log("Datapoint value updated (" + name + ", " + value + ")"); 
				if (self.showAllObjectNames) {
					for (var i = 0; i < self.dataContainers.length; i++) {
						if (self.dataContainers[i].tryUpdateDataPointValue(name, value)) {
							self.#objectLabels[self.dataContainers[i].name].setHTML(self.dataContainers[i].getText());
						}
					}
				}
				else {
					if (self.#selectedObjectLabel) {
						var container = self.dataContainers.find(x => x.name === self.#selectedObjectLabel.key);
						if (container.tryUpdateDataPointValue(name, value)) {
							self.#selectedObjectLabel.value.setHTML(container.getText());
						}
					}
				}
			}
		}
	}

	#configurePicker() {
		var self = this;

		loop.pickHelper.pickedHandler = function (pickedObject) {
			var child = self.model.findChildbyObject(pickedObject);

			if (child) {
				var displayName = self.#getDisplayName(child); 
				if (!self.showAllObjectNames) {
					if (displayName) {
						var container = self.dataContainers.find(x => x.name === displayName.name)
						var labelText = container.getText();
						var label = self.#addLabel(labelText, pickedObject, new Vector3(0,0,0));
						self.#selectedObjectLabel = { key: displayName.name, value: label };		

						if (self.webSocket && container.dataPoints) {
							for (var j = 0; j < container.dataPoints.length; ++j) {
								self.webSocket.dpConnect(container.dataPoints[j].name);
							}
						}								
					}
				}

				if (displayName) {
					console.log(displayName.name + " picked");
				}
				else
				{
					console.log("(" + child.name + ") picked");
				}
			}
			else {
				console.log("(" + null + ") picked");
			}
    	}
    
    	loop.pickHelper.unpickingHandler = function (unpickingObject) {
			var child = self.model.findChildbyObject(unpickingObject);
			if (child) {
				var displayName = self.#getDisplayName(child); 

				if (!self.showAllObjectNames && self.#selectedObjectLabel) {
					self.#removeLabel(self.#selectedObjectLabel.value);
					var container = self.dataContainers.find(x => x.name === self.#selectedObjectLabel.key);

					if (self.webSocket && container.dataPoints) {
						for (var j = 0; j < container.dataPoints.length; ++j) {
							self.webSocket.dpDisconnect(container.dataPoints[j].name);
						}
					}	

					self.#selectedObjectLabel = undefined;
				}

				if (displayName) {
					console.log(displayName.name + " unpicking");
				}
				else
				{
					console.log("(" + child.name + ") unpicking");
				}
			}
			else {
				console.log("(" + null + ") unpicking");
			}			
		}
	}

	#getDisplayName(child) {
		return this.model.childrenDisplayNames.find(x => x.meshname === child.name)
	}
	
	#addLabel(text, parent, offset) {
		var label = new TextLabel(camera);
		label.setHTML(text);
		label.setParent(parent);
		label.offset = offset;
		sceneContainer.append(label.element);	
		loop.updatables.push(label);	
		return label;
	}

	#removeLabel(label) {
		sceneContainer.removeChild(label.element);
		var index = loop.updatables.indexOf(label);
		if (index > -1) {
			loop.updatables.splice(index, 1);
		}
	}

	render() {
		renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	stop() {
		loop.stop();
	}
}

export { World };
