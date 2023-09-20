import { World } from './World/World.js';
import { Test3D, Helmet3D } from './World/components/objects/objects.js';
import { Turbine3D, Deaerator3D, Pvd3D } from './World/components/objects/turbine.js';
import { Boiler3D } from './World/components/objects/boiler.js';
import { ModelConfig } from './World/systems/ModelConfig.js';
import { WinCCOAWebSocket } from './World/systems/WinCCOAWebSocket.js';

async function main() {
	prepareModel(getModelNameParam(), createWorld);
}

function getModelNameParam() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var modelName = urlParams.get('modelName');
	return modelName;
}

async function prepareModel(modelName, onReady) {
	var modelConfig = new ModelConfig;
	modelConfig.path = ".\\assets\\models\\models.xml";

	modelConfig.onload = function() {
		var model;
		const types3d = {
			Boiler3D, 
			Test3D, 
			Helmet3D,
			Turbine3D,
			Deaerator3D,
			Pvd3D
		};

		if (!modelName) {
			modelName = "Тест";
		}

		var modelElement = modelConfig.findModelByName(modelName);
		if (!modelElement) {
			console.log("Model not found");
		}
		model = new types3d[modelElement.getAttribute("class")];
		model.name = modelName;
		model.description = modelElement.getAttribute("description");
		var path = modelElement.getAttribute("filepath");
		if (path) { model.path = path; }
		model.childrenDisplayNames = ModelConfig.getObjectNames(modelElement);
		var dataContainers = ModelConfig.getDataContainers(modelElement);

		if (typeof onReady === "function") { 
			onReady(model, dataContainers);
		}
	}

	modelConfig.load();
}

async function createWorld(model, dataContainers) {
	// Get a reference to the container element
	const container = document.querySelector('#scene-container');

	// create a new world
	//var backColor = 'skyblue';
	var backColor = 'steelblue';
	//var backColor = 'gray';
	const world = new World(container, backColor);
  
	//world.showAllObjectNames = true;
	world.showAllObjectNames = false;
	world.showInfoLabel = true;
	world.showEnvironment = false;

	world.model = model; 
	world.dataContainers = dataContainers;

	var config = getConfig();

	var wsUri = "wss://localhost:443/ws"; // https
	// var wsUri = "ws://localhost:80/ws"

	if (config != null)	{
		if (config.wsUri != null) {
			wsUri = config.wsUri;
		}
	}
	
	var winccoaws = new WinCCOAWebSocket(wsUri);
	world.webSocket = winccoaws;

	// complete async tasks
	await world.init();
	// start the animation loop
	world.start();
}

function getConfig() {
	var request = new XMLHttpRequest();
	request.open('GET', ".\\src\\config.json", false);  // `false` makes the request synchronous
	request.send(null);

	if (request.status === 200) {
		var config  = JSON.parse(request.response);
		//console.log("config json: ", config);	
		return config;
	}
}

main().catch((err) => {
	console.error(err);
});
