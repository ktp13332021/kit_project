/**
 * Schema representing settings at organization level.
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module OrgSetting
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;

var OrgSetting = new Schema({
    /** inventorydecimals {string} Decimal digits upto which the amount and quantity values in Inventory, should rounded to. */
    inventorydecimals: Number,
    /** showopdastable {Boolean} - whether to show the OPD list as table */
    showopdastable: Boolean,
    /** showdispensingastable {Boolean} - whether to show the dispensing worklist as table*/
    showdispensingastable: Boolean,
    /** diabledischargeclearancestep {Boolean} - whether to disable discharge clearance step */
    diabledischargeclearancestep: Boolean,
    /** allowopenordersatdischarge {Boolean} - whether to allow discharge if open order is present */
    allowopenordersatdischarge: Boolean,
});

/** plugin the framework attributes like createdat, createdby, etc. */
OrgSetting.plugin(resuable);
module.exports = mongoose.model('OrgSetting', OrgSetting);