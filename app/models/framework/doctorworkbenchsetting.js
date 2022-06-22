/**
 * Schema representing settings of doctor workbench.
 * The record stored in this schema will affect the doctor workbench..
 * See {@tutorial emr-tutorial} for an overview.
 *
 * @module DoctorWorkbenchSetting
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

  //  schema is self explanatory. each fields corresponds to the Patient Schema.

  var DoctorWorkbenchSettingSchema = new Schema({
    
        /** displayopdpatientlist {Boolean} - whether the opd patient list should be displayed or not. */
        displayopdpatientlist : Boolean,
        /** displayipdpatientlist {Boolean} - whether the ipd patient list should be displayed or not. */
        displayipdpatientlist : Boolean,
        /** displayappointmentlist {Boolean} - whether to display appointmentlist*/
        displayappointmentlist : Boolean,
        /** displayreferrallist {Boolean} - whether to display referral list*/
        displayreferrallist : Boolean,
        /** displaylabresults {Boolean} - whether to display results list */
        displaylabresults : Boolean,
        /** displayapprovallist {Boolean} - whether to order approval list */
        displayapprovallist : Boolean,
        /** displaystatistics {Boolean} - whether to display results list */
        displaystatistics : Boolean,
        /** displaychatroom {Boolean} - whether to display chat room */
        displaychatroom : Boolean,
        /** displaynews {Boolean} - whether to display the news from hospital */
        displaynews : Boolean,
        /** displaybookmarks {Boolean} - whether to display the bookmarks from web browser */
        displaybookmarks : Boolean,
        /** displaydoctorfee {Boolean} - whether to display the doctorfee */
        displaydoctorfee : Boolean,
        /** displayradiologyreports {Boolean} - whether to display the report result list */
        displayradiologyreports : Boolean,
        /** displaylabreports {Boolean} - whether to display the report result list */
        displaylabreports : Boolean
  });  

DoctorWorkbenchSettingSchema.plugin(resuable);
module.exports = mongoose.model('DoctorWorkbenchSetting', DoctorWorkbenchSettingSchema);

