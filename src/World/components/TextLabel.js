import { Vector3 } from 'https://unpkg.com/three@0.122.0/build/three.module.js';

class TextLabel {
	constructor(camera) {
		this.setHTML = this.setHTML.bind(this);
		this.setParent = this.setParent.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
		this.get2DCoords = this.get2DCoords.bind(this);			
		
		var div = document.createElement('div');
		div.className = 'text-label';
		div.style.position = 'absolute';
		div.style.width = 100;
		div.style.height = 100;
		div.innerHTML = "hi there!";
		div.style.top = -1000;
		div.style.left = -1000;
		this.element =  div;
		this.parent = undefined;
		this.position = new Vector3(0,0,0);
		this.offset = new Vector3(0,0,0);
		this.camera = camera;
	}

	setHTML(html) {
		this.element.innerHTML = html;
	}

	setParent(threejsobj) {
		this.parent = threejsobj;
	};
	
	tick() {
		this.updatePosition();
	}
	
	updatePosition() {
		if(parent) {
			this.position.copy(this.parent.position);
		}

		var offsetPosition = this.position.add(this.offset);
		var coords2d = this.get2DCoords(offsetPosition);
		this.element.style.left = coords2d.x + 'px';
		this.element.style.top = coords2d.y + 'px';
	}

	get2DCoords(position) {
		var vector = position.project(this.camera);
		vector.x = (vector.x + 1)/2 * window.innerWidth;
		vector.y = -(vector.y - 1)/2 * window.innerHeight;
		return vector;
	}
}

export { TextLabel };