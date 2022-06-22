/**
 * Schema for storing the photograph of the user 
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module UserImage
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var UserImageSchema = new Schema({
    /** userphoto {string} - photograph in a base64 format */  
    userphoto: String,
    usercode : String,
    comments : String
    
  });
  
 /** plugin the framework attributes like createdat, createdby, etc. */
 UserImageSchema.plugin(resuable);
 
 module.exports = mongoose.model('UserImage', UserImageSchema);
