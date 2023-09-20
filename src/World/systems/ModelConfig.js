import { DataContainer, DataPoint } from '../components/DataContainer.js';

class ModelConfig {
    path = ".\\assets\\models\\models.xml";
    xhr = new XMLHttpRequest();
    xmlDoc;
    onerror;
    onload;

    load() {
        var self = this;
        this.xhr.onload = function() {
            self.xmlDoc = self.xhr.responseXML.documentElement;
            //console.log(self.xmlDoc);
            if (typeof self.onload === "function") { 
                self.onload();
            }            
        }
        this.xhr.onerror = function() {
            console.log("Error while getting XML");
            if (typeof self.onerror === "function") { 
                self.onerror();
            }             
        }
        this.xhr.open("GET", this.path);
        this.xhr.responseType = "document";
        this.xhr.send();        
    };

    findModelByName(name) {
        var models = this.xmlDoc.getElementsByTagName("model");
        for (var i = 0; i < models.length; ++i) {
            if (models[i].getAttribute("name") == name) { return models[i]; }
        }
    }

    static getObjectNames(modelElement) {
        var objectElements = modelElement.getElementsByTagName("object");
        var objectNames = [];
        for(var i = 0; i < objectElements.length; i++)	{
            objectNames.push({ 
                name: objectElements[i].getAttribute("name"), 
                meshname: objectElements[i].getAttribute("meshname") 
            });
        }		
        return objectNames;
    }

    static getDataContainers(modelElement) {
        var objectElements = modelElement.getElementsByTagName("object");

        var dataContainers = [];
        for(var i = 0; i < objectElements.length; i++)	{
            var container = new DataContainer();
            container.name = objectElements[i].getAttribute("name");
            container.title = container.name;
            
            var dataPointElements = objectElements[i].getElementsByTagName("datapoint");
            var dataPoints = [];
            for(var j = 0; j < dataPointElements.length; j++)	{
                var dataPoint = new DataPoint();
                dataPoint.name = dataPointElements[j].getAttribute("name");
                dataPoint.description = dataPointElements[j].getAttribute("description");
                dataPoint.engUnits = dataPointElements[j].getAttribute("engunits");
                dataPoint.value = "##";
                dataPoints.push(dataPoint);
            }
            container.dataPoints = dataPoints;

            dataContainers.push(container);
        }	

        return dataContainers;
    }
}

export { ModelConfig };