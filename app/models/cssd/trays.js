// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TraysSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given for the orderset*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the trays */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the trays. */
    activeto: Date,
    /** locallangdesc {String} - local language for the trays*/
    locallangdesc: String,
    /** traytypeuid {ObjectId} - reference value code : TRYTYP*/
    traytypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** aliasnames {String} - alternative names for searching. defaults to empty - Chips control*/
    aliasnames: [{ type: String }],
    trayitems: [{
        itemmasteruid: { type: Schema.ObjectId, ref: 'ItemMaster' },
        quantity: Number,
        comments: String
    }],
    requirewashing: Boolean,
    requirepacking: Boolean,
    requireautoclave: Boolean
});

TraysSchema.plugin(resuable);

module.exports = mongoose.model('Trays', TraysSchema);