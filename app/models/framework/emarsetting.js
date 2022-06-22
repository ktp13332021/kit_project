/**
 * Schema representing settings of emr view and patient banner.
 * The record stored in this schema will affect the emr view and patient banner..
 * See {@tutorial emr-tutorial} for an overview.
 *
 * @module EMRSetting
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

  //  schema is self explanatory. each fields corresponds to the Patient Schema.

  var EMARSettingSchema = new Schema({
    /** linktoorder - whether to link order status to eMAR */
    linktoorder : Boolean,
    /** starting time for timeslot 1 window */  
    timeslot1start : Date,
    /** ending time for timeslot 1 window */
    timeslot1end   : Date,
    /** starting time for timeslot 2 window */
    timeslot2start : Date,
    /** end time for timeslot 2 window */
    timeslot2end   : Date,
    /** starting time for timeslot 3 window */
    timeslot3start : Date,
    /** ending time for timeslot 1 window */
    timeslot3end   : Date,
    /** delayedadminduration - time duration after which the administration will be marked as delayed */
    delayedadminduration : Number,
    /** orderexpiryperiod - the days after which the validity period for the order ends and it expires */
    orderexpiryperiod : Number,
    /** mustauthenticate - whether to authenticate for every save */
    mustauthenticate : Boolean,
    /** scanpatientmrn - whether to scan the patient mrn for validating */
    validatepatientmrn : Boolean,
    /** checkinmandatory - whether the checkin step is mandatory or not */
    checkinmandatory : Boolean
   
  });  

EMARSettingSchema.plugin(resuable);
module.exports = mongoose.model('EMARSetting', EMARSettingSchema);

