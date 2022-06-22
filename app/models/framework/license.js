
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var LicenseSchema = new Schema({
        /** nuserlicenes - number of named users */
        nuserlicenses : Number,
        /** nconcurrentlicenses - number of concurrent users  */
        nconcurrentlicenses : Number,
        /** nbedlicenses - number of bed licenses */
        nbedlicenses : Number,
        /** licensekey - the license key given by incarnus */
        licensekey : Number,
        /** validupto - license validity date */
        validupto : Date
  });
  
 LicenseSchema.plugin(resuable);
 
 module.exports = mongoose.model('License', LicenseSchema);
