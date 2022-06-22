/**
 * Schema representing Pharmacy Setting.
 * The Pharmacy Setting schema is used to record the workflow for the pharmacy.
 * See {@tutorial druggroup-tutorial} for an overview.
 *
 * @module PharmacySetting
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var PharmacySettingSchema = new Schema({
    /** invstoreuid {ObjectId} - reference to the inventorystore */
    invstoreuid: { type: Schema.ObjectId, ref: 'InventoryStore' },
    /** enableAllocateDispense {Boolean} - Enable the Allocate & Dispense Step */
    enableallocatedispense: Boolean,
    /** enableRegister {Boolean} - Enable the Register Step */
    enableregister: Boolean,
    /** enableAllocate {Boolean} - Enable the Allocate Step */
    enableallocate: Boolean,
    /** enableVerify {Boolean} - enable Verify Step */
    enableverify: Boolean,
    /** enableDispense {Boolean} - enable Dispense Step */
    enabledispense: Boolean,
    /** enableIPFill {Boolean} - enable the IP Fill */
    enableipfill: Boolean,
    /** ipfilltime [{Date}[] - the time part at which time the IP fill usually done */
    ipfilltime: [Date],
    /** noofdays: Number - default number of days for IP Filling */
    noofdays: Number,
    /** enableunitdosedispensing - whether to enable unit dose dispensing */
    enableunitdosedispensing: Boolean,
    /** dispenseworklistduration {Number} - the number of days to default the dispensing worklist */
    dispenseworklistduration: Number,
    /** printatstep {String} - enum field to determine where the print has to be launched */
    printatstep: { type: String, enum: ['REGISTER', 'ALLOCATE', 'VERIFY', 'DISPENSE', 'ALLOCATE DISPENSE'] },
    /** Ipfill days for the stores based on ward level. It will enable while enableipfill set as true */
    ipfilldays: [{
        warduid: { type: Schema.ObjectId, ref: 'Ward' },
        noofdays: Number
    }],
    /** dispenseworklistduration {Number} - refresh the dispensing worklist by seconds */
    worklistrefreshduration: Number

});

PharmacySettingSchema.plugin(resuable);

module.exports = mongoose.model('PharmacySetting', PharmacySettingSchema);