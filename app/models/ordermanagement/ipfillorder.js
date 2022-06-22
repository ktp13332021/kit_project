// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var patientorderitem = require('./patientorderitem');

var Schema = mongoose.Schema;


/** schema for patient order item */
var IPFillOrderLogSchema = new Schema({
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: { type: Date, required: true },
    /** useruid {ObjectId} - the logged in user who made the chagne to the order */
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** comments {String} - any comments while changing the order*/
    comments: String,
    /** reasonuid {ObjectId} - reference to the reason why the order was changed */
    reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** statusuid {ObjectId} - reference to the current status */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

var IPFillOrderItem = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** bed {ObjectId}  - filled up in the case of inpatients*/
    beduid : {type : Schema.ObjectId, ref : 'Bed'},
    /** patientorderuid {ObjectId} - reference to the patient order for dispensing */
    patientorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    patientorderitemuid: { type: Schema.ObjectId },
    /** orderitemuid {ObjectId} -reference to the order item schema - used for complex querying purposes */
    orderitemuid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    /** drugmasteruid {ObjectId} -reference to the drug master schema - used for complex querying purposes */
    drugmasteruid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    /** billingtype {String} - the type for billing - on raising, on order, no charges */
    billingtype: { type: String, enum: ['ON RAISING', 'ON EXECUTION', 'NO CHARGES'] },
    /** startdate {Date} - the start datetime  of  the  order */
    startdate: { type: Date, required: true },
    /** enddate {Date} - the end datetime  of  the  order */
    enddate: { type: Date },
    /** statusuid {ObjectId} - reference to the status of the object ORDSTS */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** quantity {Number} - quantity of the order - can be fractional */
    quantity: Number,
    /** ipfillquantity {Number} - ipfillquantity of the order - can be fractional */
    ipfillquantity: Number,
    /** quantityUOM {ObjectId} - reference to the UOM of the quantity - nos, tablets, etc */
    quantityUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dosage {Number} - dosage of the medicine - filled up only for medicine orders */
    dosage: Number,
    /** quantityUOM {ObjectId} - reference to the UOM of the dosage - ml, tablets, etc */
    dosageUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** frequencyuid {ObjectId} - reference to the frequency of the order item */
    frequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
    /** statusuid {ObjectId} - reference to the status of the object ORDSTS */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    careprovideruid: { type: Schema.ObjectId, ref: 'User'},
    /** instructionuid {ObjectId} - reference to the instruction such as Take, Apply */
    instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** routeuid {ObjectId} - reference to the route of the medicine - filled up only for medicine orders */
    routeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** formuid {ObjectId} - reference to the form of the medicine - filled up only for medicine orders */
    formuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** duration {Number} - duration for the medicine - usually filled up for medicine orders */
    duration: Number,
    infusionrate: Number,
    /** infusionduration {Number} - infusion duration in minutes */
    infusionduration: Number,
    /** infusionrateuom {Object} - UOM of infusion rate*/
    infusionrateuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** infusionduration {Object} - UOM of infusion duration */
    infusiondurationuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** patientvisitpayoruid {ObjectId} - reference to the patientvisit payor who is covering this item */
    patientvisitpayoruid: { type: Schema.ObjectId },
    /** administrationinstruction - String */
    administrationinstruction: String
    
});


// define schema
var IPFillOrderSchema = new Schema({
    /** orderdate{Date} - the datetime  of placing the  order */
    orderdate: { type: Date, required: true },
    /** departmentuid {ObjectId} - the department - based on patient department of the pharmacy*/
    departmentuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /** invstoreuid {ObjectId} - reference to the pharmacy store */
    invstoreuid: { type: Schema.ObjectId, ref: 'InventoryStore' },
    /** careprovideruid {ObjectId} - the careprovider who or for who initiated the IP Fill */
    careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true },
    /** ipfillnumber {String} - unique sequence number generated for the IP Fill */
    ipfillnumber: { type: String, required: true },
    /** warduid {ObjectId}  - filled up in the case of inpatients*/
    warduid: { type: Schema.ObjectId, ref: 'Ward' },
    /** numberofdays {Number} - the number of days to fill - default to 1 */
    numberofdays: Number,
    /** cutofftime {Date} - the timepart upto which the cutoff was taken adn the document generated */
    cutofftime: Date,
    /** comments{String} - remarks if any */
    comments: String,
    /** ipfillorderitems [IPFillOrderItem] - embedded array for the ipfill order items */
    ipfillorderitems: [IPFillOrderItem],
    /** statusuid {ObjectId} - reference to the status of the object ORDSTS */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** reference to the status chagne log */
    ipfillorderlogs: [IPFillOrderLogSchema]

});

IPFillOrderSchema.plugin(resuable);

module.exports = mongoose.model('IPFillOrder', IPFillOrderSchema);