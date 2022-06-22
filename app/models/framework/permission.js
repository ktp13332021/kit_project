
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

  // define schema



  var PermissionSchema = new Schema({
    code : {type : String, required:true, index: true},
    name : {type : String, required:true, index: true},
    description : String,
    activefrom : Date,
    activeto : Date
    
  });  

PermissionSchema.plugin(resuable);
module.exports = mongoose.model('Permission', PermissionSchema);

