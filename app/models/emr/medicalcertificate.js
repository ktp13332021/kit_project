/**
 * Schema representing Medical Certificate in EMR details.
 * The Certificate  contains filled up and completed medical details of the patient.
 * See {@tutorial form-tutorial} for an overview.
 *
 * @module MedicalCertificate
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var MedicalCertificateSchema = new Schema({
        /** patientuid {ObjectId} - reference to the patient schema */
        patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
        /** patientvisituid {ObjectId} - reference to the patient visit schema */
        patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
        /** departmentuid {ObjectId} - the department from the patient visit */
        departmentuid: { type: Schema.ObjectId, ref: 'Department' },
        /** careprovideruid {ObjectId} - the reference to the Doctor */
        careprovideruid: { type: Schema.ObjectId, ref: 'User' },
        /** templateuid {ObjectId} - the reference to the Certificate template */
        templateuid: { type: Schema.ObjectId, ref: 'CertificateTemplate', required: true },
        /** certdate {Date} - date of the certificate */
        certdate: { type: Date, required: true },
        /** certID {String} - sequence number for the certificate */
        certID: { type: String, required: true },
        /** certNumber {Number} - sequence number for the certificate with certificate code */
        certNumber: { type: Number, required: true },
        /** pagetype{String} - copied from the template */
        pagetype: { type: String, enum: ['A4', 'A5'] },
        /** pageorientation{String} - copied from the template*/
        pageorientation: { type: String, enum: ['Portrait', 'Landscape'] },
        /** certificateText{String} - the html  in string format */
        certificateText: { type: String, required: true },
        /** finalized {Boolean} - status whether the cert is locked or open - defaults true */
        finalized: { type: Boolean },
        /** certtypeuid {ObjectId} - reference domain - CERTTYP */
        certtypeuid: { type: Schema.ObjectId, ref: "ReferenceValue", required: true },
        /** auditlog - record log when user print template */
        auditlog: [{
                useruid: { type: Schema.ObjectId, ref: 'User' },
                roleuid: { type: Schema.ObjectId, ref: 'Role' },
                departmentuid: { type: Schema.ObjectId, ref: 'Department' },
                printdate: { type: Date },

        }]

});

MedicalCertificateSchema.plugin(resuable);

module.exports = mongoose.model('MedicalCertificate', MedicalCertificateSchema);