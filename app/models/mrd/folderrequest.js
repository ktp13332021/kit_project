
/**
 * Schema representing folder request. 
 * The folder ledger represents the collection of file requests, issues and transfers.
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module folderrequest
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the  folderrequest.
 * 
 */
var FolderRequestSchema = new Schema({
    /** date of the folder ledger */
    ledgerdate : {type : Date, required:true, index : true},
       /** mrdstorageuid {ObjectId} - the mrd storage at which it is created */
    mrdstorageuid : {type : Schema.ObjectId, ref: 'MRDStorage',required:true, index : true},
    /** collection for automated folder requests */
    automatedrequests : [{
           /** sequencenumber {String} - unique number generated using sequence number generation - for traceability purposes*/
            sequencenumber : { type: String, required: true},
            mrdfolderuid :  {type : Schema.ObjectId, ref: 'MRDFolder', required:true},
            requestingdeptuid : {type : Schema.ObjectId, ref: 'Department'},
            requestinguseruid  : {type : Schema.ObjectId, ref: 'User'},
            requestdate : Date,
            /** priorityuid {ObjectId} - linked to VisitPriority reference value code : VSTPRY. */
            priorityuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            /** statusuid {ObjectId} - reference domain code: FLDSTS - Requested, Issued, Cancelled */
            statusuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            comments : String,
            /** cancelreasonuid {ObjectId} - reason for cancellation*/
            cancelreasonuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            cancelledbyuseruid :  {type : Schema.ObjectId, ref: 'User'},
            canceldate : Date,
            cancelcomments : String

    }],
    /** collection for manual or adhoc folder requests */
    manualrequests : [{
            /** sequencenumber {String} - unique number generated using sequence number generation - for traceability purposes*/
            sequencenumber : { type: String, required: true},
            mrdfolderuid :  {type : Schema.ObjectId, ref: 'MRDFolder', required:true},
            requestingdeptuid : {type : Schema.ObjectId, ref: 'Department'},
            requestinguseruid  : {type : Schema.ObjectId, ref: 'User'},
            requestdate : Date,
            /** purposeuid {ObjectId} - Reference value FLDRQP: For research, Followup, Rectify Error. */
            purposeuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            /** priorityuid {ObjectId} - linked to VisitPriority reference value code : VSTPRY. */
            priorityuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            /** statusuid {ObjectId} - reference domain code: FLDSTS - Requested, Issued, Cancelled */
            statusuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            comments : String,
            /** cancelreasonuid {ObjectId} - reason for cancellation*/
            cancelreasonuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
            cancelledbyuseruid :  {type : Schema.ObjectId, ref: 'User'},
            canceldate : Date,
            cancelcomments : String

    }]
   

  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
FolderRequestSchema.plugin(resuable);
module.exports =  mongoose.model('FolderRequest', FolderRequestSchema);

