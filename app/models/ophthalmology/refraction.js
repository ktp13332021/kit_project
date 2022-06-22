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
    /** addvalue {Number} - Add value ADVAL */
    addvalue: Number,
    /** addvision {ObjectId} - ADVSN - reference value code : EYEVSN */
    addvision: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

var RefractionDetailSchema = new Schema({
    /** refractiontype {ObjectId} - reference value code : RFRTYP  */
    /** values - AUTO REFRACTION (relatedvalue = 1), PATIENT GLASSES (relatedvalue = 2), UNAIDED VISION (relatedvalue =3)
     * AIDED VISION (relatedvalue = 3), SUBJECTIVE CORRECTION (relatedvalue = 2)
     */
    refractiontype: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    righteyeod: RefractionItemSchema,
    lefteyeos: RefractionItemSchema
});

var IOPItemSchema = new Schema({
    /** iopvalue {Number} - IOVAL - measurement of intraocular pressure */
    iopvalue: Number,
    /** vision {ObjectId} - IOVSN - reference value code : EYEVSN */
    vision: { type: Schema.ObjectId, ref: 'ReferenceValue' }
});

var IOPDetailSchema = new Schema({
    /** ioptype {ObjectId} - reference value code : IOPTYP  */
    /** values - NCT, SCH, AT
     */
    ioptype: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    righteyeod: IOPItemSchema,
    lefteyeos: IOPItemSchema
});

// define schema
var RefractionSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** optometrist {ObjectId} - reference to the user who saved this screen */
    optometrist: { type: Schema.ObjectId, ref: 'User', required: true },
    /** refractiondetails [] - embedded document for the refraction items */
    refractiondetails: [RefractionDetailSchema],
    /** iopdetails [] - embedded odcument for the iop*/
    iopdetails: [IOPDetailSchema],
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

RefractionSchema.plugin(resuable);

module.exports = mongoose.model('Refraction', RefractionSchema);