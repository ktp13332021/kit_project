
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

  // define schema



  var SecurityPolicySchema = new Schema({
    minloginlength : Number,
    maxloginlength : Number,
    requiredigitsinlogin : Boolean,
    requirespecialcharsinlogin : Boolean,
    minpasswordlength : Number,
    maxpasswordlength : Number,
    requiredigitsinpassword : Boolean,
    requirespecialcharsinpassword : Boolean,
    passwordrenewalperiod : Number,
    noofinvalidloginsallowed : Number,
    idletimeout : Number,
    defaultpassword : String
    
  });  

SecurityPolicySchema.plugin(resuable);
module.exports = mongoose.model('SecurityPolicy', SecurityPolicySchema);

