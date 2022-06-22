/**
 * Schema representing approval matrix  document.
 * The approval matrix document containts the details for approving users for PO.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module contract
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var inventoryEnums = require('../inventory/inventoryenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ApprovalMatrixSchema = new Schema({
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    approverdetails: [{
        /** approvalfor {enum} - Purchase Request or Purchase Order*/
        approvalfor: {
            type: String,
            enum: [
                inventoryEnums.restrictStoreFunctions.purchaseReq,
                inventoryEnums.restrictStoreFunctions.purchaseOrder
            ]
        },
        /** potypeuid {ObjectId} - reference domain code : POTYPE */
        potypeuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        minpovalue: Number,
        maxpovalue: Number,
        /** number of levels of approval - should be 1 or 2 */
        numberoflevels: Number,
        useruids: [{
            useruid: { type: Schema.ObjectId, ref: 'User' },
            leveluid: Number
        }],
        /** activefrom {Date} - start date for the delegation */
        activefrom: Date,
        /** activeto {Date} - end date or expiry date for the delegation. Can be null for active delegations. */
        activeto: Date,
        /** comments */
        comments: String,

    }]

});

ApprovalMatrixSchema.plugin(resuable);

module.exports = mongoose.model('ApprovalMatrix', ApprovalMatrixSchema);