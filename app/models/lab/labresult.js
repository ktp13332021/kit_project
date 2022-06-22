/**
 * Schema representing master data for defining lab result. 
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module labresult
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the lab reports.
 * 
 */

var LabResultDetailSchema = new Schema({
    /** orderresultitemuid {ObjectId} - reference to the order item schema */
    orderresultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem', required: true },
    /** Name {string} defines the  name given for the result*/
    name: { type: String, required: true, index: true },
    /** shorttext {String} - short code result*/
    shorttext: String,
    /** resulttype {String} - Predefined type for the result. Mostly numeric */
    resulttype: { type: String, enum: ['NUMERIC', 'TEXTUAL', 'REFERENCEVALUE', 'ORGANISM', 'ANTIBIOTIC', 'NUTRITION', 'FREETEXT', 'ATTACHMENT'] },
    /** uomuid {ObjectId} - UOM for the result. Enabled only for resulttype = NUMERIC */
    uomuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** resultvalue {String} - value of the observation */
    resultvalue: String,
    /** HLN {String} - High, low or normal values */
    HLN: String,
    /** normal range {String} - normal range during the time of entry */
    normalrange: String,
    /** displayorder {Number} - display resultitem from setup in orderitem */
    displayorder: { type: Number },
    /** labdocumentsuid {ObjectId} - labdocumentsuid for the result. Enabled only for resulttype = ATTACHMENT */
    labdocumentsuid: { type: Schema.ObjectId, ref: 'LabDocument' },
    /** internalcomments {String} - comments to be printed in the result */
    internalcomments: String,
    /** comments {String} - comments to be printed in the result */
    comments: String
});

var LabResultSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** careprovideruid {ObjectId} - the doctor who created the order*/
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** patientorderuid  {ObjectId} - reference to the patient order */
    patientorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** patientorderitemuid  {ObjectId} - reference to the patient order item */
    patientorderitemuid: { type: Schema.ObjectId },
    /** orderitemuid  {ObjectId} - reference to the order item */
    orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem', required: true },
    /** resultdate {Date} - date for the result */
    resultdate: { type: Date },
    /** resultvalues [LabResultDetailSchema] - embedded array for the patient order items */
    resultvalues: [LabResultDetailSchema],
    /** microbiologyresultuid ObjectId - embedded array for the patient order items */
    microbiologyresultuid: { type: Schema.ObjectId, ref: 'MicrobiologyResult' },
    /** userdepartmentuid {ObjectId} - the department logged in by the user while collecting the specimen */
    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
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
    }],
    /** specimencollecteddate {Date} - date for the specimen collected */
    specimencollecteddate: { type: Date },
    /** specimenaccepteddate {Date} - date for the specimen accepted */
    specimenaccepteddate: { type: Date }

});

/** plugin the framework attributes like createdat, createdby, etc. */
LabResultSchema.plugin(resuable);
module.exports = mongoose.model('LabResult', LabResultSchema);