// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var patientorderitem = require('./patientorderitem');

var Schema = mongoose.Schema;

// define schema
var PatientFutureOrderSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientorderitems [PatientOrderItem] - embedded array for the patient order items */
    patientorderitems: [{
        /** paitientvisituid {ObjectId} reference to the patient visit schema */
        patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit' },
        /** userdepartmentuid {ObjectId} - the department logged in by the user while placing the order */
        userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
        /** orderitemuid {ObjectId} - reference to the order item schema */
        orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem' },
        /** orderitemname {String} - denormallized name used in case of db inspection */
        orderitemname: String,
        /** startdate {Date} - the start datetime  of  the  order */
        startdate: { type: Date, required: true },
        /** enddate {Date} - the end datetime  of  the  order */
        enddate: { type: Date },
        /** statusuid {ObjectId} - reference to the status of the object ORDSTS */
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** careprovideruid {ObjectId} - the careprovider - mainly used for DF */
        careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true },
        /** isactive {Boolean} - defaults to true, false for cancel & discontinued order */
        isactive: { type: Boolean },
        /** instructionuid {ObjectId} - reference to the instruction such as Take, Apply */
        instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** frequencyuid {ObjectId} - reference to the frequency of the order item */
        frequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
        /** quantity {Number} - quantity of the order - can be fractional */
        quantity: Number,
        /** quantityUOM {ObjectId} - reference to the UOM of the quantity - nos, tablets, etc */
        quantityUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** routeuid {ObjectId} - reference to the route of the medicine-filled up only for medicine orders */
        routeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** dosage {Number} - dosage of the medicine - filled up only for medicine orders */
        dosage: Number,
        /** quantityUOM {ObjectId} - reference to the UOM of the dosage - ml, tablets, etc */
        dosageUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** duration {Number} - duration for the medicine - usually filled up for medicine orders */
        duration: Number,
        /** comments {String} - any comments while entering the order (Onbehalf of ) */
        comments: String,
        /** instructions {ObjectId} - various instructions given during the order */
        instructions: [{
            instructiontypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            instructiontext: String
        }],
        /** broughtfromoutside {Boolean} - Is it brought from outside order */
        broughtfromoutside: Boolean,
        /** infusionrate {Number} - enabled if isiv. rate of infusion */
        infusionrate: Number,
        /** infusionduration {Number} - infusion duration in minutes */
        infusionduration: Number,
        /** istaperingdose {Boolean} - whether it is tapering dosage */
        istaperingdose: Boolean,
        /** taperingdetails [{}] - details about the tapering */
        taperingdetails: [{
            dosenumber: Number,
            frequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
            frequencyname: String,
            dosage: Number,
            dosageUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            startdate: { type: Date },
            enddate: { type: Date },
            duration: Number,
            quantity: Number

        }],
        /** ordersetuid {ObjectId} - if placed as part of the orderset */
        ordersetuid: { type: Schema.ObjectId, ref: 'OrderSet' },
        /** linkedapptuid : used for future order links to appointment  */
        linkedapptuid: { type: Schema.ObjectId },
        /** ordertype {String} - whther ORDER or ORDERSET - used for future orders */
        ordertype: String,
        ordercattype: String,
        /** orderinguseruid {ObjectId} - the logged in user who placed the future order */
        orderinguseruid: { type: Schema.ObjectId, ref: 'User' },
        /** orderdate{Date} - the datetime  of placing the  future order */
        orderdate: { type: Date },
        /** priorityuid {ObjectId}  - priority for the patient order - routine , stat , etc. */
        priorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** specimenuid {ObjectId} - specimen associated - used for lab*/
        specimenuid: { type: Schema.ObjectId, ref: 'Specimen' },
        /** usepreviousspecimen - use previously collected specimen - used for lab */
        usepreviousspecimen: Boolean,
        /** lateralityuid {ObjectId} - laterality associated - used for radiology*/
        lateralityuid: { type: Schema.ObjectId },
        /** noofexposures - Number of Exposures - used for lab */
        noofexposures: Number,
    }]

});

PatientFutureOrderSchema.plugin(resuable);

module.exports = mongoose.model('PatientFutureOrder', PatientFutureOrderSchema);