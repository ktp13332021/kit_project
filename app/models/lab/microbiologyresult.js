
/**
 * Schema representing master data for defining microbiology result. 
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module microbiologyresult
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the lab reports.
 * 
 */
var MBCultureResultDetailSchema = new Schema({
    /** culturehoursuid {ObjectId} - the culture time in hours such as 24, 48, 72, etc : MBHOUR */
    culturehoursuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** culture {ObjectId} - reference to the culter details code : MBCULT */
    cultureuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** colonycount {String} - details of the colony count */
    colonycount: String,
    /** colonycountuom {string} - details of the uom */
    colonycountuom: String,
    /** antibioticreactions - details of the antibiotics reactions */
    antibioticreactions: [{
        antibioticsuid: { type: Schema.ObjectId, ref: 'DrugMaster' },
        /** reaction {ObjectId} - reference value code : ANTRCT -  */
        reactionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** analyzer {String} - value from the analyzer  */
        analyzervalue: String
    }],
    /** internalcomments {String} - comments to be printed in the result */
    internalcomments: String,
    /** comments {String} - comments to be printed in the result */
    comments: String,
    /** observationdate{Date} - the datetime  of recording the  observation */
    observationdate: { type: Date, required: true },
});

var MBResultDetailSchema = new Schema({
    /** organismuid {ObjectId} - reference to the order result item schema */
    organismuid: { type: Schema.ObjectId, ref: 'OrderResultItem' },
    /** cultures [MBCultureResultDetailSchema] - embedded array for the culture */
    cultures: [MBCultureResultDetailSchema]
});

var MicrobiologyResultSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** patientorderuid  {ObjectId} - reference to the patient order */
    patientorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** patientorderitemuid  {ObjectId} - reference to the patient order item */
    patientorderitemuid: { type: Schema.ObjectId },
    /** resultdate {Date} - date for the result */
    resultdate: { type: Date },
    /** resultvalues [MBResultDetailSchema] - embedded array for the patient order items */
    resultvalues: [MBResultDetailSchema],
    /** userdepartmentuid {ObjectId} - the department logged in by the user while collecting the specimen */
    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** resultuseruid {ObjectId} - the logged in user who recorded the result */
    resultuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** statusuid {ObjectId} - status whether collected, accepted, rejected , etc. Referencevalue Code : SPMSTS  */
    statusuid: { type: Schema.ObjectId, ref: 'Referencevalue' },
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
    }]


});

/** plugin the framework attributes like createdat, createdby, etc. */
MicrobiologyResultSchema.plugin(resuable);
module.exports = mongoose.model('MicrobiologyResult', MicrobiologyResultSchema);

