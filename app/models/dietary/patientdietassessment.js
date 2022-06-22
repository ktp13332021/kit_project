// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation for patient diet assessment (consultation)

var AnthropometricDataSchema = new Schema({
    height: Number,
    weight: Number,
    bmi: Number,
    idbw: Number,
    bfmpbfratio: Number,
    whr: Number,
    /** reference value code  : 'DIETIP'  */
    interpretationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

// define schema
var PatientDietAssessmentSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** dieticianuid {ObjectId} - reference to the dietician*/
    dieticianuid: { type: Schema.ObjectId, ref: 'User' },
    /** startdate {Date} - start date of the plan */
    startdate: Date,
    /** anthropometricdata {ObjectID} - reference to the anthropometric schema */
    anthropometric: AnthropometricDataSchema,
    /** dieteraydata {ObjectID} - reference value DIETDD - related value will have code fro YESNO..  */
    dietarydata: [{
        keyuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        datauid: { type: Schema.ObjectId, ref: 'ReferenceValue' }
    }],
    /** comments {String} - comments about the plan */
    comments: String,
    /** patientdietplanuid {ObjectId} - reference to the diet plan made during the assessment */
    patientdietplanuid: { type: Schema.ObjectId, ref: 'PatientDietPlan' }

});

PatientDietAssessmentSchema.plugin(resuable);

module.exports = mongoose.model('PatientDietAssessment', PatientDietAssessmentSchema);