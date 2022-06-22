
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var FavouriteProcedureSchema = new Schema({
  /** useruid {ObjectId} - reference to the User schema*/
  useruid: { type: Schema.ObjectId, ref: 'User' },
  /** Code {string} has to be unique - fill up with User code automatically */
  code: { type: String, required: true, index: true },
  /** Name {string} - fill up with User name automatically*/
  name: { type: String, required: true, index: true },
  /** procedurelist[{ObjectId}]  - list of procedure concepts */
  procedurelist: [{ type: Schema.ObjectId, ref: 'Procedure' }]
});

FavouriteProcedureSchema.plugin(resuable);

module.exports = mongoose.model('FavouriteProcedure', FavouriteProcedureSchema);
