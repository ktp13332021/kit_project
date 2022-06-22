// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TrayStockSchema = new Schema({
    /** traynumber {String} - unique sequence number for the tray stock */
    traynumber: { type: String, required: true },
    /** traysuid {ObjectId} - reference to the tray definition */
    traysuid: { type: Schema.ObjectId, ref: 'Trays' },
    /** activefrom {Date} - start date for the traystock */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the traystock. */
    activeto: Date,
    /** actual quantity of tray items */
    trayitems: [{
        itemmasteruid: { type: Schema.ObjectId, ref: 'ItemMaster' },
        quantity: Number,
        comments: String
    }],
    /** isactive {Boolean} - whether the traystock is active or not. */
    isactive: Boolean,
    /** creationdate {Date} - the date time of creation of the traystock */
    creationdate: Date,
    /** createdbyuseruid {ObjectId} - the user who created the traystock */
    createdbyuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** owningdeptuid {ObjectId} - the owning department holding this traystock */
    owningdeptuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /** owningstoreuid {ObjectId} - the cssd store at which it is created */
    owningstoreuid: { type: Schema.ObjectId, ref: 'InventoryStore', required: true },
    /** currentdeptuid {ObjectId} - the current department holding this traystock */
    currentdeptuid: { type: Schema.ObjectId, ref: 'Department' },
    /** currentlocationuid {ObjectId} - the current OR Location holding this traystock */
    currentlocationuid: { type: Schema.ObjectId, ref: 'Location' },
    /** comments {String} - any comments */
    comments: String,
    /** statusuid {ObjectId} - code : TRYSTS current status of the traystock (sterile, washed, packed, dirty) */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** auditlogs [] - the movement history of the traystock. */
    auditlog: [{
        fromdeptuid: { type: Schema.ObjectId, ref: 'Department' },
        issuinguseruid: { type: Schema.ObjectId, ref: 'User' },
        todeptuid: { type: Schema.ObjectId, ref: 'Department' },
        tolocationuid: { type: Schema.ObjectId, ref: 'Location' },
        transtype: String,
        auditdate: Date,
        comments: String
    }]
});

TrayStockSchema.plugin(resuable);

module.exports = mongoose.model('TrayStock', TrayStockSchema);