// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DiagnosisSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** statusuid {Boolean} - mrd coding status - referencedomain code : CODSTS */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** coderuid {ObjectId} - the coder who done the MRD coding */
    coderuid: { type: Schema.ObjectId, ref: 'User' },
    /** comments */
    comments: String,
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        modifiedat: Date,
        comments: String
    }]
});

DiagnosisSchema.plugin(resuable);

module.exports = mongoose.model('MrdCoding', DiagnosisSchema);