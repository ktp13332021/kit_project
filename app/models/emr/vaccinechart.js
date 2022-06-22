
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var VaccineChartSchema = new Schema({
        /** patientuid {ObjectId} - reference to the patient schema */
        patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
        /** vaccinedetails - links to the vaccineschedule */
        vaccinedetails: [{
                vaccinescheduleuid: { type: Schema.ObjectId, ref: 'VaccineSchedule', required: true },
                drugmasteruid: { type: Schema.ObjectId, ref: 'DrugMaster' },
                genericdruguid: { type: Schema.ObjectId, ref: 'DrugMaster' },
                dosagenumber: Number,
                administered: Boolean,
                administereddate: Date,
                planned: Boolean,
                planneddate: Date,
                comments: String,
                recordedby: { type: Schema.ObjectId, ref: 'User', required: true },
                recordedat: { type: Date },
                statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' }
        }]
});

VaccineChartSchema.plugin(resuable);

module.exports = mongoose.model('VaccineChart', VaccineChartSchema);