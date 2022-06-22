/**
 * Schema representing purchaserequest document.
 * The purchaserequest document containts the details for stock to be purchased.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module purchaserequest
 */

// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var inventoryEnums = require('./inventoryenums');
var purchasingdocument = require('./purchasingdocuments');


var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

/** schema for patient order item */
var PurchaseRequestLogSchema = new Schema({
    purchaserequestitemuid: { type: Schema.ObjectId },
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
var PurchaseRequestSchema = new Schema({
    purchaserequesttype: {
        type: String,
        enum: [
            inventoryEnums.stockRequestTypes.transfer,
            inventoryEnums.stockRequestTypes.issue
        ]
    },
    /** isnoninventoryitem {Boolean} - whether the item is non inventory (only used for purchasing, such as TV, Computer,etc) - defaults to false */
    isnoninventoryitem: Boolean,
    /** purchaserequestnumber {String} - unique sequence number for request */
    purchaserequestnumber: String,
    /** fromstoreuid {ObjectId} - reference to the requesting store in case of TRANSFER */
    fromstoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** fromdeptuid {ObjectId} - reference to the requesting department in case of ISSUE */
    fromdeptuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** tostoreuid {ObjectId} - reference to the parent store */
    tostoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** requestedby {ObjectId} - user who is requesting it */
    requestedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** requestdate {Date} - date and time of request*/
    requestdate: Date,
    /** expdeliverydate {Date} - date and time of expected delivery*/
    expdeliverydate: Date,
    /** priorityuid {ObjectId} - reference value code : INVPRT*/
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
    /** cancelreasonuid {String} - cancel reason*/
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'RereferenceValue'
    },
    /** netamount {Number} - the net amount of the purchase request  */
    netamount: Number,
    /** itemdetails [] - the details of the items received */
    itemdetails: [{
        /** vendoruid - to be selected based on the item master, preferred vendor */
        vendoruid: {
            type: Schema.ObjectId,
            ref: 'Vendor'
        },
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
        iscancelled: Boolean
    }],
    /** reference to the request status change log */
    purchaserequestlogs: [PurchaseRequestLogSchema]
});

PurchaseRequestSchema.plugin(resuable);

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);