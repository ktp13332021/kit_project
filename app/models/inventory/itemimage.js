/**
 * Schema representing Inventory item Image.
 * The ItemImage schema stores photograph of the item.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module ItemImage
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ItemImageSchema = new Schema({
    itemphoto: String,
    filetype: String,
    itemname: String,
    itemcode: String,
    comments: String
});


ItemImageSchema.plugin(resuable);

module.exports = mongoose.model('ItemImage', ItemImageSchema);
