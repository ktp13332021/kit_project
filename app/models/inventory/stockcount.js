/**
 * Schema representing stock count taken during the stock audit process.
 * The stock count works in a combination of store and item master.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module stockcount
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var StockCountSchema = new Schema({
    /** stockcountnumber {String} - unique sequence number for stock count */
    stockcountnumber: String,
    /** storeuid {ObjectId} - reference to the receiving store */
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore',
        required: true
    },
    /** snapshotdate {Date} - the date of snapshot was taken */
    snapshotdate: Date,
    /** stockcountdate {Date} - the date of stock count */
    stockcountdate: Date,
    /** countedby {ObjectId} - the user who is doing the stock count */
    countedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
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
    /** iscancelled {Boolean} - Whether this Stock count is cancelled or not*/
    iscancelled: Boolean,
    /** cancelcomments {String} - comments or remarks indicating why the stock count was cancelled*/
    cancelcomments: String,
    /** cancelreasonuid {ObjectId} - reference value code : INVCNL - values: */
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    cancelledby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    canceldate: Date,
    /** ledgerdetails [] - the details of the stock ledger  */
    ledgerdetails: [{
        itemmasteruid: {
            type: Schema.ObjectId,
            ref: 'ItemMaster'
        },
        /** snapshotquantity {Number} - Ledger quantity while snapshot was taken*/
        snapshotquantity: Number,
        quantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        batchid: String,
        expirydate: Date,
        comments: String,
        countquantity: Number,
        stockledgeruid: {
            type: Schema.ObjectId,
            ref: 'StockLedger'
        }
    }]
});

StockCountSchema.plugin(resuable);

module.exports = mongoose.model('StockCount', StockCountSchema);
