/**
 * Schema representing stocktransfer document.
 * The stockrequest document containts the details for stock transferred.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module stocktransfer
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var inventoryEnums = require('./inventoryenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var StockTransferSchema = new Schema({
    /** stockrequesttype {enum} - stock request can be made by a store (TRANSFER) or non store (ISSUE) */
    stockrequesttype: {
        type: String,
        enum: [
            inventoryEnums.stockRequestTypes.transfer,
            inventoryEnums.stockRequestTypes.issue
        ]
    },
    /** issuetypeuid {ObjectId} - reference to the issue type for stock issue */
    issuetypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** stocktransfernumber {String} - unique sequence number for transfer or issue */
    stocktransfernumber: String,
    /** fromstoreuid {ObjectId} - reference to the requesting store in case of TRANSFER */
    fromstoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** tostoreuid {ObjectId} - reference to the parent store */
    tostoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** todeptuid {ObjectId} - reference to the requesting department in case of ISSUE */
    todeptuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** transferredby {ObjectId} - user who is tranferring it */
    transferredby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** transferdate {Date} - date and time of transfer*/
    transferdate: Date,
    /** isreplenish {Boolean} - Whether this document was created due to replenishment or not*/
    isreplenish: Boolean,
    /** comments {String} - comments or remarks */
    comments: String,
    /** approvalcomments {String} - comments or remarks for approving*/
    approvalcomments: String,
    /** cancelcomments {String} - comments or remarks for cancelling*/
    cancelcomments: String,
    /** cancelreasonuid {ObjectId} - Cancel reason - reference to INVCNL*/
    cancelreasonuid: Schema.ObjectId,
    /** disposereasonuid {ObjectId} - Dispense reason - reference to DISRSN*/
    disposereasonuid: Schema.ObjectId,
    /** issuetopatientuid {ObjectId} - issue to patient*/
    issuetopatientuid: {
        type: Schema.ObjectId,
        ref: 'Patient',
    },
    /** vendoruid {ObjectId} - Loan Return / Loan Out Vendor*/
    vendoruid: {
        type: Schema.ObjectId,
        ref: 'Vendor',
    },
    /** todonee {String} - issue to donee*/
    todonee: String,
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
        stockrequestuid: {
            type: Schema.ObjectId,
            ref: 'StockRequest'
        },
        stockrequestitemuid: {
            type: Schema.ObjectId
        },
        /** approvedby {ObjectId} - user who approved it */
        approvedby: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        approvaldate: Date,
        /** cancelledby {ObjectId} - user who cancelled it */
        cancelledby: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        /** cancelldate {Date} - Date at which this item was cancelled */
        cancelldate: Date,
        iscancelled: Boolean,
        /** wac {Number} - Weighted average cost of the item just before approving*/
        wac: Number,
        /** unitprice {Number} - Unitprice of the item */
        unitprice: Number,
        /** traceability to GRN */
        grnuid: {
            type: Schema.ObjectId,
            ref: 'GoodsReceive'
        },
        grnitemuid: {
            type: Schema.ObjectId
        },
        grnraisedquantity: Number,
        /** traceability to stock ledger */
        /*stockledgeruid: {
            type: Schema.ObjectId,
            ref: 'StockLedger'
        },
        stockledgeritemuid: {
            type: Schema.ObjectId
        }*/
    }]
});

StockTransferSchema.plugin(resuable);

module.exports = mongoose.model('StockTransfer', StockTransferSchema);