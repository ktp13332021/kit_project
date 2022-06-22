// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TrayRequestSchema = new Schema({
    /** requestnumber {String} - unique sequence number for the tray stock */
    requestnumber: { type: String, required: true },
    /** traysuid {ObjectId} - reference to the tray definition */
    traysuid: { type: Schema.ObjectId, ref: 'Trays' },
    quantity: { type: Number, required: true },
    requestingdeptuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    requestinglocationuid: { type: Schema.ObjectId, ref: 'Location' },
    requestinguseruid: { type: Schema.ObjectId, ref: 'User', required: true },
    requestdate: Date,
    /** owningdeptuid {ObjectId} - the owning department holding this traystock */
    owningdeptuid: { type: Schema.ObjectId, ref: 'Department' },
    /** owningstoreuid {ObjectId} - the cssd store at which it is created */
    owningstoreuid: { type: Schema.ObjectId, ref: 'InventoryStore' },
    /** priorityuid {ObjectId} - linked to VisitPriority reference value code : VSTPRY. */
    priorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** statusuid {ObjectId} - reference domain code: FLDSTS - Requested, Issued, Cancelled */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    comments: String,
    /** cancelreasonuid {ObjectId} - reason for cancellation. reference value code : CANRSN*/
    cancelreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    cancelledbyuseruid: { type: Schema.ObjectId, ref: 'User' },
    canceldate: Date,
    cancelcomments: String,

    /** issuedtrackstockuid {ObjectId} - assigned tray stock uid */
    issuedtraystockuid: [{ type: Schema.ObjectId, ref: 'TrayStock' }],
    /** issueddate {ObjectId} - issued date and time */
    issueddate: Date,
    issuedbyuseruid: { type: Schema.ObjectId, ref: 'User' },
    issuecomments: String

});

TrayRequestSchema.plugin(resuable);

module.exports = mongoose.model('TrayRequest', TrayRequestSchema);