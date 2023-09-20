import { GLTFLoader } from "https://unpkg.com/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";
import { MeshStandardMaterial } from "https://unpkg.com/three@0.122.0/build/three.module.js";
import { Mesh } from "https://unpkg.com/three@0.122.0/build/three.module.js";
import { getBaseUrl } from "../../systems/utils.js";

class Model3D {
  name;
  description;
  children = [];
  childrenDisplayNames;

  async load() {
    throw new Error(
      "Abstarct method: you have to implement it in the extended class!"
    );
  }

  findChildbyObject(object3d) {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].object === object3d) {
        return this.children[i];
      }

      // костыль
      if (object3d.parent) {
        if (this.children[i].object === object3d.parent) {
          return this.children[i];
        }
      }
    }

    return null;
  }

  findChildbyName(name) {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].name === name) {
        return this.children[i];
      }
    }

    return null;
  }

  // static findChildMeshes(model) {
  // 	var child;
  // 	var meshes = [];
  // 	console.log(model);
  // 	if (model.children) {
  // 		for (let i = 0; i < model.children.length; i++) {
  // 			child = model.children[i];
  // 			if (child instanceof Mesh) {
  // 				meshes.push(child);
  // 			}
  // 			if (child.children)
  // 			{
  // 				meshes.push(findChildMeshes(child));
  // 			}
  // 		}
  // 	}

  // 	return meshes;
  // }

  static findFirstChildMesh(model) {
    var child;
    for (let i = 0; i < model.children.length; i++) {
      child = model.children[i];

      if (child instanceof Mesh) {
        return child;
      }

      if (child.children) {
        return Model3D.findFirstChildMesh(child);
      } else {
        return null;
      }
    }
  }

  static attachMaterial(model, material) {
    model.traverse((o) => {
      if (o.isMesh) {
        o.material = material;
      }
    });
  }

  static cloneMaterial(model) {
    model.traverse((o) => {
      if (o.isMesh) {
        var materialClone = o.material.clone();
        o.material = materialClone;
      }
    });
  }

  static enableShadows(model) {
    model.traverse((o) => {
      if (o.isMesh) {
        o.receiveShadow = true;
        o.castShadow = true;
      }
    });
  }

  // static findChildMeshes(model) {
  // 	var meshes = [];
  // 	model.traverse((o) => {
  // 		if (o.isMesh) {
  // 			meshes.push(o);
  // 		}
  // 	});

  // 	return meshes;
  // }
}

class Helmet3D extends Model3D {
  path = "assets/models/DamagedHelmet/DamagedHelmet.gltf";

  async load() {
    const loader = new GLTFLoader();

    const [loadedData] = await Promise.all([
      loader.loadAsync(getBaseUrl() + this.path),
    ]);

    this.children = [];

    for (var i = 0; i < loadedData.scene.children.length; i++) {
      var object3d = loadedData.scene.children[i];

      Model3D.enableShadows(object3d);
      var newItem = { name: object3d.name, object: object3d };
      this.children.push(newItem);
    }
  }
}

class Test3D extends Model3D {
  async load() {
    const loader = new GLTFLoader();

    const [deaeratorData, pvdData, pndData, cubeData] = await Promise.all([
      loader.loadAsync(
        getBaseUrl() + "assets/models/deaerator_test/deaerator.gltf"
      ),
      loader.loadAsync(getBaseUrl() + "assets/models/pvd_test/pvd.gltf"),
      loader.loadAsync(getBaseUrl() + "assets/models/pnd_test/pnd.gltf"),
      loader.loadAsync(getBaseUrl() + "assets/models/cube/cube.gltf"),
    ]);

    let material;

    //const deaerator = deaeratorData.scene.children[0].children[0].children[0].children[0];
    const deaerator = Model3D.findFirstChildMesh(deaeratorData.scene);
    deaerator.position.set(0, 0, 0);
    material = new MeshStandardMaterial({ color: 0x3498db });
    material.roughness = 0.2;
    material.metalness = 0.9;
    Model3D.attachMaterial(deaerator, material);
    Model3D.enableShadows(deaerator);

    //const pvd = pvdData.scene.children[0].children[0].children[0];
    const pvd = Model3D.findFirstChildMesh(pvdData.scene);
    pvd.position.set(5, -3.5, 0);
    material = new MeshStandardMaterial({ color: 0xf39c12 });
    material.roughness = 0.1;
    material.metalness = 1.0;
    Model3D.attachMaterial(pvd, material);
    Model3D.enableShadows(pvd);

    //const pnd = pndData.scene.children[0].children[0].children[0];
    const pnd = Model3D.findFirstChildMesh(pndData.scene);
    pnd.position.set(-5, -3.5, 0);
    material = new MeshStandardMaterial({ color: 0x34495e });
    material.roughness = 0.5;
    material.metalness = 0.5;
    Model3D.attachMaterial(pnd, material);
    Model3D.enableShadows(pnd);

    //const cube = cubeData.scene.children[0];
    const cube = Model3D.findFirstChildMesh(cubeData.scene);
    cube.position.set(-5, -3.5, -3.5);
    Model3D.enableShadows(cube);

    this.children = [
      { name: "Деаэратор1", object: deaerator },
      { name: "ПВД1", object: pvd },
      { name: "ПНД1", object: pnd },
      { name: "Кубик1", object: cube },
    ];
  }
}

export { Test3D, Helmet3D, Model3D };
