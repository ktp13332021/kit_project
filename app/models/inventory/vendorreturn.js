/**
 * Schema representing vendor return document.
 * The vendor return document containts the details for stock outwarding.
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
var VendorReturnSchema = new Schema({
    /** vendorreturnnumber {String} - unique sequence number for vendor return */
    vendorreturnnumber: String,
    /** returntypeuid {ObjectId} - refernce to VRETYP */
    returntypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** vendoruid {ObjectId} - reference to the vendor master */
    vendoruid: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    /** storeuid {ObjectId} - reference to the returning store */
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
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
    /** netamount {Number} - the net amount of the delivery  */
    netamount: Number,
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
    cancelleddate: Date,
    cancelcomments: String,
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    iscancelled: Boolean,
    grnuids: [{
        type: Schema.ObjectId,
        ref: 'GoodsReceive'
    }],
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
        unitprice: Number,
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        taxamount: Number,
        discount: Number,
        netamount: Number,
        comments: String,
        /** goodsreceiveuid {ObjectId} - reference to the goods receive if internal system is used */
        goodsreceiveuid: {
            type: Schema.ObjectId,
            ref: 'GoodsReceive'
        },
        /** goodsreceiveitemuid {ObjectId} - reference to the goods receive if internal system is used */
        goodsreceiveitemuid: {
            type: Schema.ObjectId
        },
        /** traceability to stock ledger (ledger from which stocks were returned.) */
        stockledgeruid: {
            type: Schema.ObjectId,
            ref: 'StockLedger'
        },
        stockledgeritemuid: {
            type: Schema.ObjectId
        },
        /** wac {Number} - The weighted average cost of this item just before approving the document*/
        wac: Number,
        /** nextwac {Number} - The weighted average cost of this item just after approving the document*/
        nextwac: Number
    }],
    /** creditnotenumber {String} - Credit note number of this return */
    creditnotenumber: String
});

VendorReturnSchema.plugin(resuable);

module.exports = mongoose.model('VendorReturn', VendorReturnSchema);