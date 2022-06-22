/**
 * Schema representing stockrequest document.
 * The stockrequest document containts the details for stock requested.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module stockrequest
 */

// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var inventoryEnums = require('./inventoryenums');


var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var StockRequestSchema = new Schema({
    /** stockrequesttype {enum} - stock request can be made by a store (TRANSFER) or non store (ISSUE) */
    stockrequesttype: {
        type: String,
        enum: [
            inventoryEnums.stockRequestTypes.transfer,
            inventoryEnums.stockRequestTypes.issue
        ]
    },
    /** stockreqnumber {String} - unique sequence number for request */
    stockreqnumber: String,
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
    }]
});

StockRequestSchema.plugin(resuable);

module.exports = mongoose.model('StockRequest', StockRequestSchema);
