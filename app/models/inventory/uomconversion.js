/**
 * Schema representing UOM Conversion in the inventory store.
 * The UOMConversion schema conversion value between two UOMs.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module uomconversion
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var UOMConversionSchema = new Schema({
    /** fromuom {ObjectId} - source uom to be converted  */
    fromuom: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue',
        required: true
    },
    conversionratio: [{
        touom: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue',
            required: true
        },
        convfactor: {
            type: Number,
            required: true
        }
    }]
});

UOMConversionSchema.plugin(resuable);

module.exports = mongoose.model('UOMConversion', UOMConversionSchema);
