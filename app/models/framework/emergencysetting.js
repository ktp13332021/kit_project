// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var EmergencySettingSchema = new Schema({
    /** departmentuid {ObjectId} - reference to the departent schema in case there are multiple departments */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** warduid {ObjectId} - reference to the ward schema */
    warduid: { type: Schema.ObjectId, ref: 'Ward' },
    /** triageformuid {ObjectId} - reference to the triage form */
    triangeformuid: { type: Schema.ObjectId, ref: 'FormTemplate' },
    /** observationpaneluid {ObjectId} - reference to the observation panel */
    observationpaneluid: { type: Schema.ObjectId, ref: 'OrderItem' },
    /** allowmanualesilevelselection {Boolean} - allow user to select ESI level manually */
    allowmanualesilevelselection: Boolean,
});

EmergencySettingSchema.plugin(resuable);

module.exports = mongoose.model('EmergencySetting', EmergencySettingSchema);