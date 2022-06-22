// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var obstetricsummary = require('./obstetricsummary');
var ancenum = require('./ancenum');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var DeliveryHistory = new Schema({
    /** delivery date */
    deliverydate: Date,
    /** name of the hospital */
    hospitalname: String,
    /** reference value code : DLVYMD */
    deliverytypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** ga value */
    gavalue: Number,
    /** reference value code : BRTOCM */
    deliveryoutcomeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** reference value code  : GENDER */
    genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** weight at birth in kgs */
    birthweight: Number,
    /** any comments */
    comments: String,
    /** complications if any */
    complications: String
});


// define schema
var ANCRecordSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** cyclenumber {String} - incremental number generated as a series */
    cyclenumber: String,
    /** iscompleted {Boolean} - is the emergency record completed the duration */
    iscompleted: Boolean,
    /** trimester {Number} - the number of the trimester - calculated from LMP*/
    trimester: Number,
    /** lmpdate {Date} - the date of the last menstrual period */
    lmpdate: Date,
    /** edcdate {Date} - the date of edc calculated */
    edcdate: Date,
    /** edcmethod {enum} - LMP or US */
    edcmethod: {
        type: String,
        enum: [ancenum.edcMethod.LMP,
            ancenum.edcMethod.US,
            ancenum.edcMethod.MANUAL
        ]
    },
    /** gabylmp {String} - GA by lmp */
    gabylmp: String,
    /** gabyus  {String} - GA by U/S */
    gabyus: String,
    /** gabymanual  {String} - GA by Manual */
    gabymanual: String,
    /** ultrasounddate {Date} - date of ultrasound */
    ultrasounddate: Date,
    /** obstetricsummary {ObjectId} - summary of hte obstetic histroy of the patient */
    obstetricsummary: obstetricsummary.ObstetricSummary,
    /** deliveryhistories [{ObjectId}] - the history of all deliveries by this patient */
    deliveryhistories: [DeliveryHistory],
    /** medicalhistoryuid {ObjectId} - reference to the medical history object */
    medicalhistoryuid: { type: Schema.ObjectId, ref: 'MedicalHistory' },
    /** fathermedicalhistoryuid {ObjectId} - reference to the medical history object */
    fathermedicalhistoryuid: { type: Schema.ObjectId, ref: 'MedicalHistory' },
    /** fatherdetail {ObjectId} - summary of hte father details of the baby */
    fatherdetailuid: { type: Schema.ObjectId, ref: 'FatherDetail' },
    /** examination {ObjectId} - reference to the observation object */
    examinationdetails: [{ type: Schema.ObjectId, ref: 'Observation' }],
    /** outsidelabdetails {ObjectId} - reference to the observation object */
    outsidelabdetails: [{ type: Schema.ObjectId, ref: 'Observation' }],
    /** fatheroutsidelabdetails {ObjectId} - reference to the observation object */
    fatheroutsidelabdetails: [{ type: Schema.ObjectId, ref: 'Observation' }],
    /** historyformuid {ObjectId} - reference to the form if it is used in history */
    historyformuid: { type: Schema.ObjectId, ref: 'PatientForm' },
    /** labourdetail {ObjectId} - summary of hte labour details of the baby */
    labourdetailuid: { type: Schema.ObjectId, ref: 'LabourDetail' }
});

ANCRecordSchema.plugin(resuable);

module.exports = mongoose.model('ANCRecord', ANCRecordSchema);