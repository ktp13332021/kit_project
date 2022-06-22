
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var FavouriteProblemSchema = new Schema({
  /** useruid {ObjectId} - reference to the User schema*/
  useruid: { type: Schema.ObjectId, ref: 'User' },
  /** Code {string} has to be unique - fill up with User code automatically */
  code: { type: String, required: true, index: true },
  /** Name {string} - fill up with User name automatically*/
  name: { type: String, required: true, index: true },
  /** problemlist[{ObjectId}]  - list of problem concepts */
  problemlist: [{ type: Schema.ObjectId, ref: 'Problem' }]
});

FavouriteProblemSchema.plugin(resuable);

module.exports = mongoose.model('FavouriteProblem', FavouriteProblemSchema);
