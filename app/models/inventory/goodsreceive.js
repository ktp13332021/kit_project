/**
 * Schema representing goods receive note document.
 * The goods receive note document containts the details for stock inwarding.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module goodsreceive
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var GoodsReceiveSchema = new Schema({
    /** grntypeuid {ObjectId} - reference value  code : 'GRNTYP' */
    grntypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue',
        required: true
    },
    /** grnnumber {String} - uniqueequence number for goods receive */
    grnnumber: String,
    /** ponumber {String} - the po number if external system is used for purchasing */
    ponumber: [{
        type: String
    }],
    /** purchaseorderuid {ObjectId} - reference to the purchase order if internal system is used */
    purchaseorderuids: [{
        type: Schema.ObjectId,
        ref: 'PurchaseOrder'
    }],
    /** vendoruid {ObjectId} - reference to the vendor master */
    vendoruid: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    /** storeuid {ObjectId} - reference to the receiving store */
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** receivedby {String} - the user who received the stock */
    receivedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** comments {String} - comments or remarks */
    comments: String,
    /** receivedate {Date} - date in which the goods were received */
    receivedate: Date,
    /** isdc {Boolean} - Whether the GRN is DC or an Invoice*/
    isdc: Boolean,
    /** invoicenumber {String} - the invoice number given by the vendor*/
    invoicenumber: String,
    /** invoicedate {Date} - the date of invoice */
    invoicedate: Date,
    /** deliverynumber {String} - the DC number given by the vendor */
    deliverynumber: String,
    /** discount {Number} - invoice level discount if any given by the vendor */
    discount: Number,
    /** netamount {Number} - the net amount of the delivery  */
    netamount: Number,
    /** usecurrentcost {Number} -Use Current Cost (flag) if == 'Y' >>> Create in app else if == 'N' get detail from Interface   */
    usecurrentcost: String,
    /** statusuid {ObjectId} - reference value code : INVSTS - RAISED, APPROVAL REQUIRED, COMPLETED, PARTIALLY COMPLETED, CANCELLED */
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
    /** itemdetails [] - the details of the items received */
    itemdetails: [{
        itemmasteruid: {
            type: Schema.ObjectId,
            ref: 'ItemMaster'
        },
        /** receivetypeuid {ObjectId} - reference value  code : 'GRCVTY' - PAID, FREE */
        receivetypeuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        quantity: Number,
        quantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        freequantity: Number,
        freequantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        batchid: String,
        expirydate: Date,
        /** manufacturedate {Date} - date in which the item manufactured, used to calculate shelf life */
        manufacturedate: Date,
        unitprice: Number,
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        taxamount: Number,
        discount: Number,
        netamount: Number,
        comments: String,
        purchaseorderuid: {
            type: Schema.ObjectId,
            ref: 'PurchaseOrder'
        },
        purchaseorderitemuid: {
            type: Schema.ObjectId
        },
        /** traceability to stock ledger */
        stockledgeruid: {
            type: Schema.ObjectId,
            ref: 'StockLedger'
        },
        stockledgeritemuid: {
            type: Schema.ObjectId
        },
        /** wac {Number} - Weighted average cost of the item just before approving*/
        wac: Number,
        /** nextwac {Number} - Weighted average cost of the item just after approving*/
        nextwac: Number,
        /** sequencenumber {Number} - Line Number in item details*/
        sequencenumber: Number,
        /** traceability to Stock Transfer */
        stocktransferuid: {
            type: Schema.ObjectId,
            ref: 'GoodsReceive'
        },
        stocktransferitemuid: {
            type: Schema.ObjectId
        },
        stocktransferraisedquantity: Number,
    }],
    /** iscancelled {Boolean} - Whether this GRN is cancelled or not*/
    iscancelled: Boolean,
    /** cancelcomments {String} - comments or remarks indicating why the GRN was cancelled*/
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
    cancelleddate: Date,
    /** roundoff - round off value on total net amount*/
    roundoff: Number,
    /** shippingcharge - Shipping charge */
    shippingcharge: Number
});

GoodsReceiveSchema.plugin(resuable);

module.exports = mongoose.model('GoodsReceive', GoodsReceiveSchema);