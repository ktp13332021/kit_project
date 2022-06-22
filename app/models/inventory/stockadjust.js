/**
 * Schema representing stockadjust document.
 * The stockadjust document containts the details for stock adjusted.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module stocktransfer
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var StockAdjustSchema = new Schema({
    /** stockadjustnumber {String} - unique sequence number for stock adjustment */
    stockadjustnumber: String,
    /** adjusttype {ObjectId} - reference to ADJTYP reference domains */
    adjusttype: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** storeuid {ObjectId} - reference to the  store */
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** adjustedby {ObjectId} - user who is adjusting the stock */
    adjustedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** adjusteddate {Date} - date and time of adjustment*/
    adjusteddate: Date,
    /** comments {String} - comments or remarks */
    comments: String,
    /** statusuid {ObjectId} - reference value code : INVSTS */
    statusuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** approvedby {ObjectId} - user who approved it */
    approvedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    approvaldate: Date,
    approvalcomments: String,
    /** cancelledby {ObjectId} - user who cancelled it */
    cancelledby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** statusuid {ObjectId} - reference value code : INVCNL */
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    canceldate: Date,
    cancelcomments: String,
    iscancelled: Boolean,
    /** itemdetails [] - the details of the items received */
    itemdetails: [{
        itemmasteruid: {
            type: Schema.ObjectId,
            ref: 'ItemMaster'
        },
        adjustquantity: Number,
        quantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        batchid: String,
        expirydate: Date,
        comments: String,
        /** traceability to stock ledger */
        stockledgeruid: {
            type: Schema.ObjectId,
            ref: 'StockLedger'
        },
        wac: Number,
        stockinhand: Number,
        /*,
                stockledgeritemuid: {
                    type: Schema.ObjectId
                }*/
    }],
    /** stockcountuid - Reference of stock count from which this stock adjust was created.*/
    stockcountuid: {
        type: Schema.ObjectId,
        ref: 'StockCount'
    }
});

StockAdjustSchema.plugin(resuable);

module.exports = mongoose.model('StockAdjust', StockAdjustSchema);