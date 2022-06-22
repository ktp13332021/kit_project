
// import the necessary modules
var mongoose = require('../../lib');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
  var OrganisationSchema = new Schema({
    code : String,
    name : String,
    description : String
  });
  mongoose.model('Organisation', OrganisationSchema);
};
