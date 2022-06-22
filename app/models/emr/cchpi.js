
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var emrenum = require('../emr/emrenum');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var CCHPISchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of the logged in user */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
      /** cchpis - links to the chief complaint masters */
    cchpis: [{
        cchpimasteruid: { type: Schema.ObjectId, ref: 'CCHPIMaster' },
        chiefcomplaint: { type: String }, // used for adhoc purposes
        bodysiteuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        duration: Number,
        /** checklists {ObjectId} - One or more checklist that need to be captured*/
        checklists: { type: Schema.ObjectId, ref: 'PatientForm' }
    }],
    presentillness: String,
    /** auditlog  */
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
        audittype: { type: String, enum: ['CC', 'HPI'] },
        status: { type: String, enum: emrenum.auditstatusenum }
    }]
});

CCHPISchema.plugin(resuable);

module.exports = mongoose.model('CCHPI', CCHPISchema);