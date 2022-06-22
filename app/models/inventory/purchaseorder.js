/**
 * Schema representing purchaseorder document.
 * The purchaseorder document containts the details for stock to be purchased.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module purchaseorder
 */

// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var inventoryEnums = require('./inventoryenums');
var purchasingdocument = require('./purchasingdocuments');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

/** schema for patient order item */
var PurchaseOrderLogSchema = new Schema({
    purchaseorderitemuid: { type: Schema.ObjectId },
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: { type: Date, required: true },
    /** useruid {ObjectId} - the logged in user who made the chagne to the order */
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** comments {String} - any comments while changing the order*/
    comments: String,
    /** statusuid {ObjectId} - reference to the current status */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

// define schema
var PurchaseOrderSchema = new Schema({
    purchaseordertypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** isnoninventoryitem {Boolean} - whether the item is non inventory (only used for purchasing, such as TV, Computer,etc) - defaults to false */
    isnoninventoryitem: Boolean,
    /** purchaseordernumber {String} - unique sequence number for po */
    purchaseordernumber: String,
    /** fromstoreuid {ObjectId} - reference to the store that is raising the PO */
    fromstoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },

    /** deliverystoreuid {ObjectId} - reference to the  store where it has to be delivered */
    deliverystoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** raisedby {ObjectId} - user who is raising it */
    raisedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** vendoruid - selected vendor from UI for the PO */
    vendoruid: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    /** purchaseorderdate {Date} - date and time of PO*/
    purchaseorderdate: Date,
    /** expdeliverydate {Date} - date and time of expected delivery*/
    expdeliverydate: Date,
    /** priorityuid {ObjectId} - reference value*/
    priorityuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** comments {String} - comments or remarks */
    comments: String,
    /** approvecomments {String} - approve comments or remarks*/
    approvecomments: String,
    /** cancelcomments {String} - cancel comments or remarks*/
    cancelcomments: String,
    /** closecomments {String} - close comments or remarks*/
    closecomments: String,
    /** rejectcomments {String} - reject comments or remarks*/
    rejectcomments: String,
    /** cancelreasonuid {String} - cancel reason*/
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'RereferenceValue'
    },
    /** netamount {Number} - the net amount of the purchase order  */
    netamount: Number,
    /** discount {Number} - invoice level discount if any given by the vendor */
    discount: Number,
    /** statusuid {ObjectId} - reference value code : INVSTS - RAISED, APPROVAL REQUIRED, COMPLETED, PARTIALLY COMPLETED, CANCELLED */
    statusuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** credittermuid - reference value code 'CRDTRM' */
    credittermuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
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
        freequantity: Number,
        freequantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        unitprice: Number,
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        taxamount: Number,
        discount: Number,
        netamount: Number,
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
        /** approvaldate {Date} - Date at which this item was approved */
        approvaldate: Date,
        /** cancelledby {ObjectId} - user who cancelled it */
        cancelledby: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        /** cancelldate {Date} - Date at which this item was cancelled */
        cancelldate: Date,
        /** closedby {ObjectId} - user who closed it */
        closedby: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        /** closeddate {Date} - Date at which this item was closed */
        closeddate: Date,
        /** iscancelled {Boolean} - whether this item is cancelled or not */
        iscancelled: Boolean,
        purchaserequestuid: {
            type: Schema.ObjectId,
            ref: 'PurchaseRequest'
        },
        purchaserequestitemuid: {
            type: Schema.ObjectId,
            ref: 'PurchaseRequest'
        }
    }],
    /** reference to the purchase order status change log */
    purchaseorderlogs: [PurchaseOrderLogSchema]
});

PurchaseOrderSchema.plugin(resuable);

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);