import { GLTFLoader } from 'https://unpkg.com/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { Model3D } from './objects.js';

class Turbine3D extends Model3D {
	
	path;
	
	async load() {
		const loader = new GLTFLoader();

		const [loadedData] = await Promise.all([
			loader.loadAsync(this.path),
		]);	
		
		this.children = [];

		for (var i = 0; i < loadedData.scene.children.length; i++) {
			var object3d = loadedData.scene.children[i];
			
			// разделяемый между объектами материал клонируется для того,
			// чтобы при выделении объекта можно было индивидуально для него корректировать свойства материала (подсвечивать объект), 
			// не влияя на внешний вид других объектов
			Model3D.cloneMaterial(object3d);

			Model3D.enableShadows(object3d);

			var newItem = { name: object3d.name, object: object3d }
			this.children.push(newItem);
		}
		
		//console.log(this.children);
	}
}

class Deaerator3D extends Model3D {
	
	path;
	
	async load() {
		const loader = new GLTFLoader();

		const [loadedData] = await Promise.all([
			loader.loadAsync(this.path),
		]);	
		
		this.children = [];

		for (var i = 0; i < loadedData.scene.children.length; i++) {
			var object3d = loadedData.scene.children[i];
			
			// разделяемый между объектами материал клонируется для того,
			// чтобы при выделении объекта можно было индивидуально для него корректировать свойства материала (подсвечивать объект), 
			// не влияя на внешний вид других объектов
			Model3D.cloneMaterial(object3d);

			Model3D.enableShadows(object3d);

			//object3d.scale.set(0.001, 0.001, 0.001);

			var newItem = { name: object3d.name, object: object3d };
			this.children.push(newItem);
		}
		
		console.log(this.children);
	}
}

class Pvd3D extends Model3D {
	
	path;
	
	async load() {
		const loader = new GLTFLoader();

		const [loadedData] = await Promise.all([
			loader.loadAsync(this.path),
		]);	
		
		this.children = [];

		for (var i = 0; i < loadedData.scene.children.length; i++) {
			var object3d = loadedData.scene.children[i];
			
			// разделяемый между объектами материал клонируется для того,
			// чтобы при выделении объекта можно было индивидуально для него корректировать свойства материала (подсвечивать объект), 
			// не влияя на внешний вид других объектов
			Model3D.cloneMaterial(object3d);

			Model3D.enableShadows(object3d);

			//object3d.rotation.x = Math.PI / 2;
			//object3d.rotation.set(new Vector3( 0, 0, Math.PI / 2));

			var newItem = { name: object3d.name, object: object3d };
			this.children.push(newItem);
		}
		
		console.log(this.children);
	}
}

export { Turbine3D, Deaerator3D, Pvd3D };