/**
 * Schema representing settings Print parameter.
 * The record stored in this schema will be used to print from other functions
 * See {@tutorial reporting-tutorial} for an overview.
 *
 * @module PrinterConfiguration
 */
// import the necessary modules

var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;


var PrinterConfigurationSchema = new Schema({
    /** name of the device using the application */
    devicename: String,
    /** locationuid {String} - type of the report for the constructing parameters */
    locationuid: { type: Schema.ObjectId, ref: 'Department' },
    reportdetails: [{
        /** report template that need to be printed */
        reporttemplateuid: { type: Schema.ObjectId, ref: 'ReportTemplate' },
        /** printer path, stores the ipp path for the printer */
        printerpath: String,
    }]
});

PrinterConfigurationSchema.plugin(resuable);
module.exports = mongoose.model('PrinterConfiguration', PrinterConfigurationSchema);