
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');
var Schema = mongoose.Schema;

//Departments defined the speciality

// create an export function to encapsulate the model creation

  // define schema

  
  var LoginSessionSchema = new Schema({
        loginname : String,
        useruid : { type: Schema.ObjectId, ref: 'User', index: true },
        roleuid : { type: Schema.ObjectId, ref: 'Role' },
        departmentuid : { type: Schema.ObjectId, ref: 'Department' },
        logindate : Date,
        lastactivitydate : Date,
        logoutdate : Date,
        ipaddress : String
        
  });
//need to add dept to service depts based on order categories.

LoginSessionSchema.plugin(resuable);
module.exports = mongoose.model('LoginSession', LoginSessionSchema);
