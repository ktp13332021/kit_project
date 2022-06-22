/**
 * Schema representing master data for defining radiology result. 
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module radiologyresult
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the radiology reports.
 * 
 */

var RadiologyResultSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** patientorderuid  {ObjectId} - reference to the patient order */
    patientorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** patientorderitemuid  {ObjectId} - reference to the patient order item */
    patientorderitemuid: { type: Schema.ObjectId },
    /** orderitemuid  {ObjectId} - reference to the order item */
    orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem' },
    /** resultdate {Date} - date for the result */
    resultdate: { type: Date },
    /** resulttext {String} - large textual results  */
    resulttext: String,
    /** impressiontext {String} - impression or diagnosis text */
    impressiontext: String,
    /** radstsuid result {ObjectId} - whether the result is normal or abnormal */
    radstsuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** userdepartmentuid {ObjectId} - the department logged in by the user while collecting the specimen */
    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** radiologistuid {ObjectId} - the radiologist who studied the report */
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** radiologistuid {ObjectId} - the radiologist who studied the report */
    radiologistuid: { type: Schema.ObjectId, ref: 'User' },
    /** resultuseruid {ObjectId} - the logged in user who recorded the result */
    resultuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** statusuid {ObjectId} - status whether collected, accepted, rejected , etc. Referencevalue Code : SPMSTS  */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** approvaldate {Date} - date for the approval */
    approvaldate: { type: Date },
    /** approvaluseruid {ObjectId} - the logged in user who approved the user */
    approvaluseruid: { type: Schema.ObjectId, ref: 'User' },
    /** auditlog [{}] - auditlog details */
    auditlogs: [{
        /** modifiedat {Date} - datetime at which this change was made */
        modifiedat: { type: Date, required: true },
        /** useruid {ObjectId} - the logged in user who made the chagne to the order */
        useruid: { type: Schema.ObjectId, ref: 'User' },
        /** comments {String} - any comments while changing the specimen*/
        comments: String,
        /** reasonuid {ObjectId} - reference to the reason why the specimen was changed */
        reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** statusuid {ObjectId} - reference to the current status */
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** resulttext {String} - large textual results  */
        resulttext: String,
        /** impressiontext {String} - impression or diagnosis text */
        impressiontext: String,
    }]


});

/** plugin the framework attributes like createdat, createdby, etc. */
RadiologyResultSchema.plugin(resuable);
module.exports = mongoose.model('RadiologyResult', RadiologyResultSchema);