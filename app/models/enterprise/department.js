/**
 * Schema representing master data for defining a department (ex: Orthopedics, Pediatric, etc) 
 * The department can be defined within the hospital or in a parent hospital across the hospital group
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module Department
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;

/**
 * Schema defining the master data for department.
 * 
 */
  
  var DepartmentSchema = new Schema({
       /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
       /** Name {string} defines the  name given to the department*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** activefrom {Date} - start date for the department */ 
      activefrom : Date,
       /** activeto {Date} - end date or expiry date for the department. Can be null for active departments. */ 
      activeto : Date,
       /** isregistrationallowed {Boolean} - defines whether OPD visits are allowed for this department. 
        * (ex : some departments might be ancillary with no direct OPD visits*/
      isregistrationallowed : Boolean,
      /** isadmissionallowed {Boolean} - defines whether IPD admission is allowed */  
      isadmissionallowed : Boolean,
      /** isexcludemrdrequest {Boolean} - defines whether automatic MRD request for file should NOT be placed.*/  
      isexcludemrdrequest : Boolean,
       /** overrideorderfromdept {Boolean} - defines whether order from location should be overwritten or not.*/  
       overrideorderfromdept : Boolean,
      /** arealldoctorscheduled {Boolean} - defines whether the doctors are always scheduled in this department.
       * Will search only for doctors who have schedule today at this department*/  
      arealldoctorscheduled : Boolean,
      /** showapptstogether {Boolean} - denotes whether all appointments in this department to be shown together to OPD*/  
      showapptstogether : Boolean,
      /** isEmergencyDept {Boolean} - denotes whether this department is an emergency department*/  
      isEmergencyDept : Boolean,
      /** displayorder {Number} - denotes the sort order while displaying the list of departments*/  
      displayorder : Number,
      /** directions {Number} - comments or directions to reach the department hq. Can be printed in patient handouts*/  
      directions : String,
      /** phone {String} - phone number or extension number*/
      phone : String,
      /** parentdeptuid {ObjectId} - link to the parent department if this is a child department*/
      parentdeptuid : { type: Schema.ObjectId, ref: 'Department' },
       /** genderuid {ObjectId} -  denotes if the department has to be restricted to male or female patients , etc*/
      genderuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** agemasteruid {ObjectId} -  denotes if the departments has to be restricted to children or geriatric patients, etc*/ 
      agemasteruid : { type: Schema.ObjectId, ref: 'AgeMaster'},
      /** waitingtimegreen {Number} - the threshold waiting time - green colour*/  
      waitingtimegreen : Number,
      /** waitingtimeamber {Number} - the threshold waiting time - amber colour*/  
      waitingtimeamber : Number,
      /** waitingtimered {Number} - the threshold waiting time - red colour*/  
      waitingtimered : Number,
      /** Department Code {string} link to interface government*/
      departmentcode : String
  });
/** plugin the framework attributes like createdat, createdby, etc. */
DepartmentSchema.plugin(resuable);
module.exports = mongoose.model('Department', DepartmentSchema);
