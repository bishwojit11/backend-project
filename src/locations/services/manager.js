const {LocationModel} = require("../../models");

class Manager{
    constructor(config) {
        this.Location = LocationModel;
        this.accessControl = config.accessControl
    }
}
module.exports = { Manager };