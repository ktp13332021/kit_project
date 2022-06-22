// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;


var RefractionItemSchema = new Schema({
    /** SPH {Number} - Spherical  SPH */
    spherical: Number,
    /** cylinder {Number} - Cylinder CYL */
    cylinder: Number,
    /** axis {Number} - reference to AXIS */
    axis: Number,
    /** prism {Number} - PRISM */
    prism: Number,
    /** vision {ObjectId} - VISN - reference value code : EYEVSN */
    vision: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

var RefractionDetailSchema = new Schema({

    lefteyenv: RefractionItemSchema, //near vision
    lefteyedv: RefractionItemSchema, //distant vision
    righteyenv: RefractionItemSchema, // near vision
    righteyedv: RefractionItemSchema //distant vision
});


// define schema
var GlassPrescriptionSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** careprovideruid {ObjectId} - reference to the doctor who saved this screen */
    careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true },
    /** refractiondetails  - embedded document for the refraction items */
    refractiondetail: RefractionDetailSchema,
    /** ipdfar {Number}  - IPD Far */
    ipdfar: Number,
    /** ipdnear {number} -- ipd near */
    ipdnear: Number,
    /** usageuid {ObjectId} - OUSAGE - reference value code : OUSAGE */
    usageuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** bifocaluid {ObjectId} - BIFOCL - reference value code : BIFOCL */
    bifocaluid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** tintuid {ObjectId} - OPTINT - reference value code : OPTINT */
    tintuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** progressiveuid {ObjectId} - OPPROG - reference value code : OPPROG */
    progressiveuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** comments {String} - comments  */
    comments: String,
    /** auditlog [] - array of the audit log*/
    auditlog: [{
        /** modifiedat {Date} - datetime at which this change was made */
        modifiedat: Date,
        /** modifiedby {ObjectId} - the logged in user who made the chagne to the record */
        modifiedby: { type: Schema.ObjectId, ref: 'User' },
        /** postaudit {String} - diff from previous to current*/
        postaudit: String
    }]


});

GlassPrescriptionSchema.plugin(resuable);

module.exports = mongoose.model('GlassPrescription', GlassPrescriptionSchema);