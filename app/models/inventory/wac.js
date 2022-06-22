/**
 * Schema representing Weighted Average Cost document.
 * The goods receive note document containts the details to ddetermine value of the stock.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module weighted average cost
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var inventoryEnums = require('../inventory/inventoryenums');    

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var WACSchema = new Schema({
    /** itemmasteruid {ObjectId} - reference to item master */
    itemmasteruid: {
        type: Schema.ObjectId,
        ref: 'ItemMaster',
        required: true
    },
    transactiontype: {
        type: String,
        enum: [
            inventoryEnums.ledgerTransactionType.goodsReceive,
            inventoryEnums.ledgerTransactionType.vendorReturn,
            inventoryEnums.ledgerTransactionType.manufacturing,
            inventoryEnums.ledgerTransactionType.repacking,
            inventoryEnums.ledgerTransactionType.manufacturingRepacking,
            inventoryEnums.ledgerTransactionType.adjustData
        ]
    },
    costingdate: Date,
    weightedavgcost: Number,
    qtyonhand: Number,
    lastavgcost: Number,
    qtyreceived: Number,
    unitcost: Number
});

WACSchema.plugin(resuable);

module.exports = mongoose.model('WeightedAverageCost', WACSchema);
