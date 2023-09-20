class DataContainer {
    name;
    title;
    dataPoints;
    showDataPoints;

    constructor() {
        this.showDataPoints = true;
    }

    getText() {
        var text = "<u>" + this.title + "</u>";
        if (this.showDataPoints) {
            for (var i = 0; i < this.dataPoints.length; ++i) {
                var valueStr;
                if (typeof this.dataPoints[i].value === 'number') {
                    valueStr = this.dataPoints[i].value.toFixed(1);
                }
                else {
                    valueStr = this.dataPoints[i].value;
                }
                text += "<br>" + this.dataPoints[i].description + " " + valueStr + " " + this.dataPoints[i].engUnits;
            }
        }

        return text;
    }

    tryUpdateDataPointValue(name, newValue) {
        var dataPoint = this.getDataPointByName(name);
        if (dataPoint) {
            dataPoint.value = newValue;
            return true;
        }
        return false;
    }

    getDataPointByName(dataPointName) {
        if (this.dataPoints) {
            return this.dataPoints.find(x => x.name === dataPointName);
        }
    }
}

class DataPoint {
    name;
    description;
    value;
    engUnits;
}

export { DataContainer, DataPoint };