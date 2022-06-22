/**
 * Schema representing Manufacturing details.
 * The manufacturing can be Manufacturing, Repacking , manufacturing and repacking.
 * See {@tutorial druggroup-tutorial} for an overview.
 *
 * @module ManufactureDetail
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var inventoryEnums = require('./inventoryenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ManufactureDetailSchema = new Schema({
    /** manufacturetype {enum} - the manufacture type can be MANUFACTURING, REPACKING, MANUFACTURING & REPACKING*/
    manufacturetype: {
        type: String,
        enum: [
            inventoryEnums.manufacturingTypes.manufacturing,
            inventoryEnums.manufacturingTypes.repacking,
            inventoryEnums.manufacturingTypes.manufacturingrepacking
        ]
    },
    /** manufacturingnumber {String} - unique sequence number for manufacturing process */
    manufacturingnumber: String,
    /** storeuid {ObjectId} - reference to the  store in which manufacturing takes place */
    storeuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** manufacturedby {ObjectId} - user who is manufacturing it */
    manufacturedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** manufacturedate {Date} - date and time of manufacturing*/
    manufacturedate: Date,
    /** comments {String} - comments or remarks */
    comments: String,
    /** preparationmodeuid {ObjectId} - reference value code : MNFMOD -  */
    preparationmodeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** statusuid {ObjectId} - reference value code : INVSTS - RAISED,  COMPLETED */
    statusuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** approvedby {ObjectId} - user who approved it */
    approvedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    completiondate: Date,
    completioncomments: String,
    /** iscancelled {Boolean} - Whether this manufacturing is cancelled or not*/
    iscancelled: Boolean,
    /** cancelcomments {String} - comments or remarks indicating why the manufacturing was cancelled*/
    cancelcomments: String,
    /** cancelreasonuid {ObjectId} - reference value code : INVCNL - values: */
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** printlabelqty {Number} - the number of labels to print */
    printlabelqty: Number,
    /** isautobatch {Boolean} - Whether this manufacturing is autobatch or not*/
    isautobatch: Boolean,
    /** outputdetails [] - the details of the items manufactured */
    outputdetails: [{
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
        additionalprice: Number,
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        taxamount: Number,
        netamount: Number,
        comments: String,
        /** wac {Number} - Weighted average cost of the item just before approving*/
        wac: Number,
        /** nextwac {Number} - Weighted average cost of the item just after approving*/
        nextwac: Number
    }],
    /** inputdetails [] - the details of the items used as ingredients */
    inputdetails: [{
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
        additionalprice: Number,
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        taxamount: Number,
        netamount: Number,
        comments: String,
        /** wac {Number} - Weighted average cost of the item just before approving*/
        wac: Number,
        /** nextwac {Number} - Weighted average cost of the item just after approving*/
        nextwac: Number
    }],
    /** repackoutputdetails [] - the details of the items used as repacking */
    repackoutputdetails: [{
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
        additionalprice: Number,
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        taxamount: Number,
        netamount: Number,
        comments: String,
        /** wac {Number} - Weighted average cost of the item just before approving*/
        wac: Number,
        /** nextwac {Number} - Weighted average cost of the item just after approving*/
        nextwac: Number,
        /** sequencenumber {Number} - Line Number in item details*/
        sequencenumber: Number
    }]
});

ManufactureDetailSchema.plugin(resuable);

module.exports = mongoose.model('ManufactureDetail', ManufactureDetailSchema);