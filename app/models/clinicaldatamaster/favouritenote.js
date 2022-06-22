
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var FavouriteNoteSchema = new Schema({
    /** useruid {ObjectId} - reference to the User schema*/
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** Code {string} has to be unique - fill up with User code automatically */
    code: { type: String, required: true, index: true },
    /** Name {string} - fill up with User name automatically*/
    name: { type: String, required: true, index: true },
    /** notetypeuid {ObjectId} - reference domain - FORMTY */
    notetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** notetext{String} - the note template in string format */
    notetext: { type: String, required: true }
});

FavouriteNoteSchema.plugin(resuable);

module.exports = mongoose.model('FavouriteNote', FavouriteNoteSchema);
