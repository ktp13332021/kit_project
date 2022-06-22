/**
 * Schema representing folder issue. 
 * The folder ledger represents the collection of file requests, issues and transfers.
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module folderissue
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the  folderissue.
 * 
 */
var FolderIssueSchema = new Schema({
  /** date of the folder ledger */
  ledgerdate: { type: Date, required: true, index: true },
  /** mrdstorageuid {ObjectId} - the mrd storage at which it is created */
  mrdstorageuid: { type: Schema.ObjectId, ref: 'MRDStorage', required: true, index: true },
  /** collection for issue of files (voluntary issue or issue for manual request). Issue for automated requests will not be here. */
  manualissues: [{
    /** sequencenumber {String} - unique number generated using sequence number generation - for traceability purposes*/
    sequencenumber: { type: String, required: true },
    mrdfolderuid: { type: Schema.ObjectId, ref: 'MRDFolder', required: true },
    requestledgeruid: { type: Schema.ObjectId,ref: 'FolderRequest' },
    requestuid: { type: Schema.ObjectId },
    ismanual: { type: Boolean },
    issuedate: Date,
    issuinguseruid: { type: Schema.ObjectId, ref: 'User' },
    issuedtodeptuid: { type: Schema.ObjectId, ref: 'Department' },
    issuedtouseruid: { type: Schema.ObjectId, ref: 'User' },
    /** statusuid {ObjectId} - reference domain code: FLDSTS -  Issued, Cancelled */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    comments: String,
    /** cancelreasonuid {ObjectId} - reason for cancellation code : MRDCAN */
    cancelreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    cancelledbyuseruid: { type: Schema.ObjectId, ref: 'User' },
    canceldate: Date,
    cancelcomments: String
  }]
});

/** plugin the framework attributes like createdat, createdby, etc. */
FolderIssueSchema.plugin(resuable);
module.exports = mongoose.model('FolderIssue', FolderIssueSchema);

