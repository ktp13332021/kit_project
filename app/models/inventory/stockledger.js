/**
 * Schema representing ledger of a stock item.
 * The stock ledget works in a combination of store and item master.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module stockledger
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var inventoryEnums = require('../inventory/inventoryenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var StockLedgerSchema = new Schema({
    /**  itemmasteruid {ObjectId} - reference to the Item Master*/
    itemmasteruid: {
        type: Schema.ObjectId,
        ref: 'ItemMaster',
        required: true
    },
    /** storeuid {ObjectId} - reference to the receiving store */
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore',
        required: true
    },
    /** batchid {String} - batchid of the stock */
    batchid: String,
    /** expirtydate {Date} - the expiry date of the stock */
    expirydate: Date,
    /** manufacturedate {Date} - date in which the item manufactured */
    manufacturedate: Date,
    /** quantity {Number} - current quantity in this batch */
    quantity: Number,
    quantityuom: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** ledgerdetails [] - the details of the stock ledger  */
    ledgerdetails: [{
        transactiontype: {
            type: String,
            enum: [
                inventoryEnums.ledgerTransactionType.goodsReceive,
                inventoryEnums.ledgerTransactionType.transferOut,
                inventoryEnums.ledgerTransactionType.transferIn,
                inventoryEnums.ledgerTransactionType.stockIssue,
                inventoryEnums.ledgerTransactionType.stockDispense,
                inventoryEnums.ledgerTransactionType.IPFill,
                inventoryEnums.ledgerTransactionType.cancelDispense,
                inventoryEnums.ledgerTransactionType.dispenseReturn,
                inventoryEnums.ledgerTransactionType.vendorReturn,
                inventoryEnums.ledgerTransactionType.stockAdjust
            ]
        },
        transactionrefuid: {
            type: Schema.ObjectId
        },
        transactionrefitemuid: {
            type: Schema.ObjectId
        },
        transactiondate: Date,
        transactionuseruid: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        quantity: Number,
        quantityuom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /** statusuid {ObjectId} - reference value code : INVSTS */
        statusuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /** wac {Number} - Weighted average cost of this item just before making transaction*/
        wac: Number,
        /** nextwac {Number} - Weighted average cost of this item just after making transaction*/
        nextwac: Number
    }]
});

StockLedgerSchema.plugin(resuable);

module.exports = mongoose.model('StockLedger', StockLedgerSchema);
