
/**
 * Schema representing master data for defining pathology result. 
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module pathologyresult
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the pathology reports.
 * 
 */

var PathologyResultSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** patientorderuid  {ObjectId} - reference to the patient order */
    patientorderuid :  { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** patientorderitemuid  {ObjectId} - reference to the patient order item */
    patientorderitemuid :  { type: Schema.ObjectId},
    /** resultdate {Date} - date for the result */
    resultdate : {type : Date},
    /** resulttext {String} - large textual results  */
    resulttext: String,
    /** impressiontext {String} - impression or diagnosis text */
    impressiontext : String,
    /** userdepartmentuid {ObjectId} - the department logged in by the user while collecting the specimen */
    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** resultuseruid {ObjectId} - the logged in user who recorded the result */
    resultuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** statusuid {ObjectId} - status whether collected, accepted, rejected , etc. Referencevalue Code : SPMSTS  */
    statusuid : { type: Schema.ObjectId, ref: 'Referencevalue' },
     /** approvaldate {Date} - date for the approval */
    approvaldate : {type : Date},
    /** approvaluseruid {ObjectId} - the logged in user who approved the user */
    approvaluseruid: { type: Schema.ObjectId, ref: 'User' },
    /** auditlog [{}] - auditlog details */
    auditlogs : [{
                        /** modifiedat {Date} - datetime at which this change was made */
                        modifiedat : {type : Date, required:true},
                        /** useruid {ObjectId} - the logged in user who made the chagne to the order */
                        useruid : {type : Schema.ObjectId,ref : 'User'},
                        /** comments {String} - any comments while changing the specimen*/
                        comments : String,
                        /** reasonuid {ObjectId} - reference to the reason why the specimen was changed */
                        reasonuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
                        /** statusuid {ObjectId} - reference to the current status */
                        statusuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
                        /** resulttext {String} - large textual results  */
                        resulttext: String,
                        /** impressiontext {String} - impression or diagnosis text */
                        impressiontext : String,
                    }]

   
  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
PathologyResultSchema.plugin(resuable);
module.exports =  mongoose.model('PathologyResult', PathologyResultSchema);

