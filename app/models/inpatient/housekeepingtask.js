
/**
 * Schema representing data for the house keeping tasks . 
 * The tasks for house keeping activities in the ward view.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module bedoccupancy
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the housekeepingtask.
 * 
 */
var HouseKeepingTaskSchema = new Schema({
      /** locationuid {ObjectId} - optional location details */
      locationuid : { type: Schema.ObjectId, ref: 'Location'},
      /** warduid {ObjectId} - optional ward details */
      warduid : { type: Schema.ObjectId, ref: 'Ward'},
      /** beduid {ObjectId} - optional beddetails */
      beduid  : { type: Schema.ObjectId, ref: 'Bed'},
      /** raiseddate {Date} - task raised date and time */
      raiseddate : Date,
      /** raisedbyuseruid {ObjectId} - the task raised by  */
      raisedbyuseruid : { type: Schema.ObjectId, ref: 'User'},
      /** tasktypeuid {ObjectId} - reference value code : HSTTYP */
      tasktypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue'},
      /** taskdescription {String} - description or comments */
      taskdescription : String,
      /** taskstatusuid {ObjectId} - reference value code : TRFSTS */
      taskstatusuid : { type: Schema.ObjectId, ref: 'ReferenceValue'},
      /** comments {String} - comments for update */
      comments : String,
       /** auditlogs [] - the audit history of the record. */
      auditlogs : [{
       /** modifiedat {Date} - datetime at which this change was made */
        modifiedat : {type : Date, required:true},
        /** useruid {ObjectId} - the logged in user who made the chagne to the order */
        useruid : {type : Schema.ObjectId,ref : 'User'},
        /** comments {String} - any comments while changing the details*/
        comments : String,
        /** statusuid {ObjectId} - reference to the current status */
        statusuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
         
    }]
  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
HouseKeepingTaskSchema.plugin(resuable);
module.exports =  mongoose.model('HouseKeepingTask', HouseKeepingTaskSchema);

