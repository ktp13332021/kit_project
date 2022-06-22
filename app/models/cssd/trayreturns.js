// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TrayReturnSchema = new Schema({
    /** returnedtraystockuid {ObjectId} - assigned tray stock uid */
    returnedtraystockuid: { type: Schema.ObjectId, ref: 'TrayStock' },

    returningdeptuid: { type: Schema.ObjectId, ref: 'Department' },
    returninglocationuid: { type: Schema.ObjectId, ref: 'Location' },
    returninguseruid: { type: Schema.ObjectId, ref: 'User' },
    returndate: Date,
    /** owningdeptuid {ObjectId} - the owning department holding this traystock */
    owningdeptuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /** owningstoreuid {ObjectId} - the cssd store at which it is created */
    owningstoreuid: { type: Schema.ObjectId, ref: 'InventoryStore', required: true },
    /** statusuid {ObjectId} - reference domain code: FLDSTS - Requested, Issued, Cancelled */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    comments: String,
    /** cssdprocessuid {ObjectId} - assigned cssd process uid */
    cssdprocessuid: { type: Schema.ObjectId, ref: 'CSSDProcess' },
});

TrayReturnSchema.plugin(resuable);

module.exports = mongoose.model('TrayReturn', TrayReturnSchema);