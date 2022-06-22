/**
 * Schema representing master data for Patient Merge. 
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module patientmerge
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the PatientMerge.
 * 
 */
var MergedRecordDetailSchema = new Schema({

    /** documentname {String} - name of the mongo document that was merged **/
    documentname : String,
    /** recorduid {ObjectId} - reference to the updated record */
    recorduid : {type : Schema.ObjectId},
    /** isupdated {Boolean}  - whether the individual row was updated */
    isupdated : Boolean
});
var PatientMergeSchema = new Schema({

    /** mergeseqno {String} - unique seq number created for the merge */
    mergeseqno : String,
    /** mergedbyuseruid {ObjectId} - reference to the user who initiated merged */
    mergedbyuseruid : {type: Schema.ObjectId, ref : 'User'},
    /** approvedbyuseruid {ObjectId} - reference to the user who approved the merge */
    approvedbyuseruid : {type: Schema.ObjectId, ref : 'User'},
    /** mergedate {Date} - date and time of the merge */
    mergedate : Date,
    /** isunmerged {Boolean} - whether this merge has been unmerged back or cancelled*/
    isunmerged : Boolean,
    /** primarypatientuid {ObjectId} - reference to the retained patient */
    primarypatientuid : {type : Schema.ObjectId, ref: 'Patient'},
    /** secondarypatientuid {ObjectId} - reference to the merged patient */
    secondarypatientuid : {type : Schema.ObjectId, ref: 'Patient'},
    /** secondarypatientvisituid {ObjectId} - used in case of visit merge */
    secondarypatientvisituid : {type : Schema.ObjectId, ref: 'PatientVisit'},
    /** reasonuid {ObjectId} - reason for initiating the merge */
    reasonuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
    /** comments {String} - any comments for merge  */
    comments : String,
    /** mergedrecorddetails [] - details about the merge */
    mergedrecorddetails : [MergedRecordDetailSchema]

});


/** plugin the framework attributes like createdat, createdby, etc. */
PatientMergeSchema.plugin(resuable);
module.exports = mongoose.model('PatientMerge', PatientMergeSchema);