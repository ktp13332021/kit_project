/**
 * Schema representing dispense return document.
 * The dispense return is used for returns from the ward.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module vendorreturn
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DispenseReturnSchema = new Schema({
    /** dispensereturnnumber {String} - unique sequence number for dispense return */
    dispensereturnnumber: String,
    /** storeuid {ObjectId} - reference to the returning store */
    storeuid: {
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
    /** returnedby {String} - the user who returned the stock */
    returnedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** comments {String} - comments or remarks */
    comments: String,
    /** returndate {Date} - date in which the goods were returned */
    returndate: Date,
    /** itemdetails [] - the details of the items received */
    /** approvedby {ObjectId} - user who approved it */
    approvedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    approvaldate: Date,
    approvalcomments: String,
    /** iscancelled {Boolean} - whether this item is cancelled or not.*/
    iscancelled: Boolean,
    cancelledby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    cancelldate: Date,
    statusuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
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
        patientorderuid: {
            type: Schema.ObjectId,
            ref: 'PatientOrder'
        },
        patientorderitemuid: {
            type: Schema.ObjectId
        },
        statusuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        wac: Number,
        /** traceability to stock ledger */
        /*stockledgeruid: {
            type: Schema.ObjectId,
            ref: 'StockLedger'
        },
        stockledgeritemuid: {
            type: Schema.ObjectId
        }*/
        /** sequencenumber {Number} - Line Number in item details*/
        sequencenumber: Number
    }]
});

DispenseReturnSchema.plugin(resuable);

module.exports = mongoose.model('DispenseReturn', DispenseReturnSchema);