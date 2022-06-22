/**
 * Schema representing stockdispense document.
 * The stockdispense document containts the details for stock dispensed.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module stockdispense
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var StockDispenseSchema = new Schema({
    /** stockdispensenumber {String} - unique sequence number for dispense or prescription number */
    stockdispensenumber: String,
    /** fromstoreuid {ObjectId} - reference to the requesting store in case of TRANSFER */
    fromstoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: {
        type: Schema.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: {
        type: Schema.ObjectId,
        ref: 'PatientVisit'
    },
    /** patientorderuid {ObjectId} - reference to the patient order for dispensing */
    patientorderuid: {
        type: Schema.ObjectId,
        ref: 'PatientOrder'
    },
    /** dispensedby {ObjectId} - user who is dispensing it */
    dispensedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** dispensedate {Date} - date and time of dispense*/
    dispensedate: Date,
    /** comments {String} - comments or remarks */
    comments: String,
    /** itemdetails [] - the details of the items received */
    itemdetails: [{
        itemmasteruid: {
            type: Schema.ObjectId,
            ref: 'ItemMaster'
        },
        quantity: Number,
        quantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        batchid: String,
        expirydate: Date,
        comments: String,
        /** statusuid {ObjectId} - reference value code : INVSTS */
        statusuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /* iscancelled {Boolean} - Whether this item is cancelled or not */
        iscancelled: Boolean,
        patientorderuid: {
            type: Schema.ObjectId,
            ref: 'PatientOrder'
        },
        patientorderitemuid: {
            type: Schema.ObjectId
        },
        /** wac {Number} - Weighted average cost of the item just before allocating*/
        wac: Number,
        /** traceability to stock ledger */
        /*stockledgeruid: { type: Schema.ObjectId, ref: 'StockLedger' },
        stockledgeritemuid: { type: Schema.ObjectId }*/
    }]
});

StockDispenseSchema.plugin(resuable);

module.exports = mongoose.model('StockDispense', StockDispenseSchema);
