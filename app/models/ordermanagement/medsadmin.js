// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

/** schema for patient order item */
var MedsAdminLogSchema = new Schema({
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: { type: Date, required: true },
    /** useruid {ObjectId} - the logged in user who made the chagne to the order */
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** cosignuseruid {ObjectId} - the logged in user who cosigned the order */
    cosignuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** comments {String} - any comments while changing the order*/
    comments: String,
    /** reasonuid {ObjectId} - reference to the reason why the order was changed */
    reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** statusuid {ObjectId} - reference to the current status */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

// define schema
var MedsAdminSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** patientorderuid {ObjectId} - reference to the patient order or patient package for traceability purposes */
    patientorderuid: { type: Schema.ObjectId, required: true },
    /** patientorderitemuid {ObjectId} - refernece to the patient order items or patient package for traceability purposes*/
    patientorderitemuid: { type: Schema.ObjectId, required: true },
    /** orderitemuid {ObjectId} - reference to the order item schema */
    orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem'},
    /** drugmasteruid {ObjectId} -reference to the drug master schema - used for complex querying purposes */
    drugmasteruid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    /** departmentuid {ObjectId} - the department of patient visit */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** careprovideruid {ObjectId} - the doctor who did the examination */
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** iscosignrequired {Boolean} - whether co-signing by doctor is required for processing this order item - default false */
    iscosignrequired: Boolean,
    /** isprnorder {Boolean} - whether the order is for PRN or STAT - default false */
    isprnorder: Boolean,
    /** isstatorder {Boolean} - whether the order is for PRN or STAT - default false */
    isstatorder: Boolean,
    /** isivinfusion {Boolean} - whether the order is for IV Infusion - default false */
    isivinfusion: Boolean,
    /** dosagedate {Date} - the due date of admin based on frequency */
    dosagedate: { type: Date },
    /** dosage {Number} - dosage of the medicine - filled up only for medicine orders */
    dosage: Number,
    /** quantityUOM {ObjectId} - reference to the UOM of the dosage - ml, tablets, etc */
    dosageUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** adminqty {Number} - dosage of the medicine - filled up only for medicine orders */
    adminqty: Number,
    /** infusionrate {Number} - enabled if isiv. rate of infusion during administration*/
    infusionrate: Number,
    /** TRUE or FALSE */
    isactive: Boolean,
    /** statusuid {ObjectId} - reference to the current status */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** admindate {Date} - the actual date of admin based on frequency */
    admindate: { type: Date },
    /** endtime {Date} - end of iv infusion */
    endtime: Date,
    /** adminuseruid {ObjectId} - the logged in user who administered the order */
    adminuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** cosignuseruid {ObjectId} - the logged in user who cosigned the order */
    cosignuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** comments {String} - any comments while accepting the alert*/
    comments: String,
    /** reasonuid {ObjectId} - reference to the reason for not administering the medcine */
    reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** reference to the patient order item status chagne log */
    medsadminlogs: [MedsAdminLogSchema],

});

MedsAdminSchema.plugin(resuable);

module.exports = mongoose.model('MedsAdmin', MedsAdminSchema);