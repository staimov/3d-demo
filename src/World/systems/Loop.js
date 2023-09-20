import { Clock, Vector2 } from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { PickHelper } from './PickHelper.js';

const clock = new Clock();	

class Loop {
  constructor(camera, scene, renderer) {
    this.setPickPosition = this.setPickPosition.bind(this);
    this.dblclick = this.dblclick.bind(this);
    this.click = this.click.bind(this);
      
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.infoLabel = undefined;
    
    this.pickPosition = new Vector2(-10000, -10000);
    this.pickHelper = new PickHelper();

    // this.pickHelper.pickedHandler = function (pickedObject) {
		// 	console.log(pickedObject.name + " picked");
    // }
    
    // this.pickHelper.unpickingHandler = function (unpickingObject) {
		// 	console.log(unpickingObject.name + " unpicking");
		// }
    
    renderer.domElement.addEventListener('mousemove', this.setPickPosition);
    renderer.domElement.addEventListener('dblclick', this.dblclick);
    renderer.domElement.addEventListener('click', this.click);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();
	  
	    this.pickHelper.pick(this.pickPosition, this.scene, this.camera);

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    for (const object of this.updatables) {
		  object.tick(delta);
    }
	
	  this.updateInfoLabel();
  }
  
  updateInfoLabel() {
	  if (typeof this.infoLabel !== 'undefined') {
		  // var now = new Date();
		  // this.infoLabel.setHTML(now.toLocaleTimeString('ru-RU'));
	  }
  }	  
	  
  dblclick() {
	  console.log('Loop.dblclick');
  }

  click() {
	  console.log('Loop.click');
  }    
  
  setPickPosition(event) {
	  var size = new Vector2();
	  this.renderer.getSize(size);	
    this.pickPosition.x = (event.clientX / size.width ) *  2 - 1;
    this.pickPosition.y = -(event.clientY / size.height) * 2 + 1;  // note we flip Y
  }
}

export { Loop };
