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
    /** departmentuid {ObjectId} - the department of the logged in user */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** diagnosistext - free text for diagnosistext  */
    diagnosistext: String,
    textauditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
    }],
    /** diagnosis - links to the problems */
    diagnosis: [{

        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        /** careprovideruid {ObjectId} - the doctor who diagnosed*/
        careprovideruid: { type: Schema.ObjectId, ref: 'User' },
        /** referencedomain code : ENTSTG - Admission, Discharge, Pre-Op, Post-Op */
        encounterstageuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        comments: String,
        onsetdate: Date,
        closuredate: Date,
        isprimary: Boolean,
        /** reference code : SEVRTY - mild, moderate, severe**/
        severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** comorbidityuid {ObjectId} - comorbidity - referencedomaincode : COMORB  */
        comorbidityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** reference domain code : DIAGCF - Provisional, Final */
        confirmationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** cancerstaging - reference value 'CANCRS' - values 'Stage I', 'Stage II', 'Stage III', 'Stage IV' */
        cancerstaging: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** isactive{Boolean} - whether active or not */
        isactive: Boolean,
        /** isrepeatdiagnosis {Boolean} - whether the diagnosis is repeated or not */
        isrepeatdiagnosis: Boolean,
        /** reference domain code : TYPEDISCH */
        diagnosistypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** externalcause - external cause */
        externalcause: String,
        createdby: { type: Schema.ObjectId, ref: 'User', required: true },
        createdat: { type: Date, required: true },
        auditlog: [{
            useruid: { type: Schema.ObjectId, ref: 'User' },
            activestatus: Boolean,
            modifiedat: Date,
            comments: String
        }],
    }],

    codeddiagnosis: [{
        codingtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        problemcode: String,
        problemname: String,
        /** coderuid {ObjectId} - the user who coded the diagnosis*/
        coderuid: { type: Schema.ObjectId, ref: 'User' },
        codingdate: Date,
        /** referencedomain code : ENTSTG - Admission, Discharge, Pre-Op, Post-Op */
        encounterstageuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        comments: String,
        onsetdate: Date,
        closuredate: Date,
        isprimary: Boolean,
        /** reference code : SEVRTY - mild, moderate, severe**/
        severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** comorbidityuid {ObjectId} - comorbidity - referencedomaincode : COMORB  */
        comorbidityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** reference domain code : DIAGCF - Provisional, Final */
        confirmationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** cancerstaging - reference value 'CANCRS' - values 'Stage I', 'Stage II', 'Stage III', 'Stage IV' */
        cancerstaging: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** isactive{Boolean} - whether active or not */
        isactive: Boolean,
        /** isrepeatdiagnosis {Boolean} - whether the diagnosis is repeated or not */
        isrepeatdiagnosis: Boolean,
        /** reference domain code : TYPEDISCH */
        diagnosistypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** externalcause - external cause */
        externalcause: String,
    }],
    /** uncharteddiagnosis - links to the problems */
    uncharteddiagnosis: [{
        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        /** careprovideruid {ObjectId} - the doctor who diagnosed*/
        careprovideruid: { type: Schema.ObjectId, ref: 'User' },
        /** referencedomain code : ENTSTG - Admission, Discharge, Pre-Op, Post-Op */
        encounterstageuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        comments: String,
        onsetdate: Date,
        closuredate: Date,
        isprimary: Boolean,
        /** reference code : SEVRTY - mild, moderate, severe**/
        severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** comorbidityuid {ObjectId} - comorbidity - referencedomaincode : COMORB  */
        comorbidityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** reference domain code : DIAGCF - Provisional, Final */
        confirmationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** cancerstaging - reference value 'CANCRS' - values 'Stage I', 'Stage II', 'Stage III', 'Stage IV' */
        cancerstaging: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** isactive{Boolean} - whether active or not */
        isactive: Boolean,
        /** isrepeatdiagnosis {Boolean} - whether the diagnosis is repeated or not */
        isrepeatdiagnosis: Boolean,
        /** reference domain code : TYPEDISCH */
        diagnosistypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** externalcause - external cause */
        externalcause: String,
        createdby: { type: Schema.ObjectId, ref: 'User', required: true },
        createdat: { type: Date, required: true },
        auditlog: [{
            useruid: { type: Schema.ObjectId, ref: 'User' },
            activestatus: Boolean,
            modifiedat: Date,
            comments: String
        }]
    }]

});

DiagnosisSchema.plugin(resuable);

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);