// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var CSSDProcessSchema = new Schema({
    /** returnedtraystockuid {ObjectId} - assigned tray stock uid */
    returnedtraystockuid: { type: Schema.ObjectId, ref: 'TrayStock' },
    /** owningdeptuid {ObjectId} - the owning department holding this traystock */
    owningdeptuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /** owningstoreuid {ObjectId} - the cssd store at which it is created */
    owningstoreuid: { type: Schema.ObjectId, ref: 'InventoryStore', required: true },
    processdate: Date,
    /** statusuid {ObjectId} - code : TRYSTS current status of the traystock (sterile, washed, packed, dirty) */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    comments: String,
    washcomments: String,
    packcomments: String,
    sterilecomments: String,
    /** auditlogs [] - the movement history of the traystock. */
    auditlog: [{
        userid: { type: Schema.ObjectId, ref: 'User' },
        /** statusuid {ObjectId} - code : TRYSTS current status of the traystock (sterile, washed, packed, dirty) */
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        auditdate: Date,
        comments: String
    }]

});

CSSDProcessSchema.plugin(resuable);

module.exports = mongoose.model('CSSDProcess', CSSDProcessSchema);