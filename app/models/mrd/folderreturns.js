/**
 * Schema representing folder returns to MRD. 
 * The folder ledger represents the collection of folder returns.
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
var FolderReturnsSchema = new Schema({
        /** date of the folder ledger */
        ledgerdate: { type: Date, required: true, index: true },
        /** mrdstorageuid {ObjectId} - the mrd storage at which it is created */
        mrdstorageuid: { type: Schema.ObjectId, ref: 'MRDStorage', required: true, index: true },
        /** collection for returns by various departments */
        mrdreturns: [{
                /** sequencenumber {String} - unique number generated using sequence number generation - for traceability purposes*/
                sequencenumber: { type: String, required: true },
                mrdfolderuid: { type: Schema.ObjectId, ref: 'MRDFolder', required: true },
                returningdeptuid: { type: Schema.ObjectId, ref: 'Department' },
                returninguseruid: { type: Schema.ObjectId, ref: 'User' },
                returndate: Date,
                /** priorityuid {ObjectId} - linked to VisitPriority reference value code : VSTPRY. */
                priorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
                /** statusuid {ObjectId} - reference domain code: FLDSTS - Returned, Received */
                statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
                comments: String,
                /** cancelreasonuid {ObjectId} - reason for cancellation*/
                cancelreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
                cancelledbyuseruid: { type: Schema.ObjectId, ref: 'User' },
                canceldate: Date,
                cancelcomments: String
        }],
});

/** plugin the framework attributes like createdat, createdby, etc. */
FolderReturnsSchema.plugin(resuable);
module.exports = mongoose.model('FolderReturns', FolderReturnsSchema);