
/**
 * Schema representing folder transfer. 
 * The folder ledger represents the collection of file requests, issues and transfers.
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module foldertransfer
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the  foldertransfer.
 * 
 */
var FolderTransferSchema = new Schema({
    /** date of the folder ledger */
    ledgerdate : {type : Date, required:true, index : true},
    /** collection for transfer of files between departments */
    transfers : [{
            /** sequencenumber {String} - unique number generated using sequence number generation - for traceability purposes*/
            sequencenumber : { type: String, required: true},
            mrdfolderuid :  {type : Schema.ObjectId, ref: 'MRDFolder', required:true},
            transferdate : Date,
            fromdeptuid : {type : Schema.ObjectId, ref: 'Department'},
            fromuseruid  : {type : Schema.ObjectId, ref: 'User'},
            todeptuid : {type : Schema.ObjectId, ref: 'Department'},
            touseruid  : {type : Schema.ObjectId, ref: 'User'},
            /** statusuid {ObjectId} - reference domain code: FLDSTS -  Transferred, Received */
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
FolderTransferSchema.plugin(resuable);
module.exports =  mongoose.model('FolderTransfer', FolderTransferSchema);

