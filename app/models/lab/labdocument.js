
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var LabDocumentDetailSchema = new Schema({
    /** document {string} - base64 */
    document: String,
    /** documentname {string}  */
    documentname: String,
    /** documenttype {string}  */
    documenttype: String,
    /** documenttype {Number}  */
    documentsize: Number
});

// define schema
var LabDocumentSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** patientorderuid  {ObjectId} - reference to the patient order */
    patientorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** patientorderitemuid  {ObjectId} - reference to the patient order item */
    patientorderitemuid: { type: Schema.ObjectId },
    /** orderresultitemuid {ObjectId} - reference to the order item schema */
    orderresultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem', required: true },
    /** userdepartmentuid {ObjectId} - the department logged in by the user while collecting the specimen */
    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** uploaddate {Date} - the date in which the file was uplaoded */
    uploaddate: Date,
    /** uploadedby {Schema.ObjectId} - the user who uploaded */
    uploadedby: { type: Schema.ObjectId, ref: 'User' },
    /** documents [LabResultDetailSchema] - embedded array for the documents*/
    documents: [LabDocumentDetailSchema]
});

LabDocumentSchema.plugin(resuable);

module.exports = mongoose.model('LabDocument', LabDocumentSchema);