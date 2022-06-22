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
var frameworkenum = require('./frameworkenum');

var Schema = mongoose.Schema;

//  schema is self explanatory. each fields corresponds to the Patient Schema.

var EMRSettingSchema = new Schema({
    /** displayaddressinbanner {Boolean} - whether to display patient address in the banner. */
    displayaddressinbanner: Boolean,
    /** pacsviewerurl {String} - the URL for the PACS viewer */
    pacsviewerurl: String,
    /** dmsviewerurl {String} - the URL for the document management system */
    dmsviewerurl: String,
    /** displayvaccinetab {Boolean} - whether to display vaccine tab in emr view. */
    displayvaccinetab: Boolean,
    /** displaylabtab {Boolean} - whether to display lab results tab in emr view. */
    displaylabtab: Boolean,
    /** displayradiologytab {Boolean} - whether to display radiology tab in emr view. */
    displayradiologytab: Boolean,
    /** displaypathotab {Boolean} - whether to display pathology tab in emr view. */
    displaypathotab: Boolean,
    /** displaydftab {Boolean} - whether to display doctor fee tab in emr view. */
    displaydftab: Boolean,
    /** displaydftab {Boolean} - whether to display procedure tab in emr view. */
    displaypdtab: Boolean,
    /** displaycc {Boolean} - whether to display chief complaint in emr landing screen */
    displaycc: Boolean,
    /** displayhpi {Boolean} - whether to display present illness in emr landing screen */
    displayhpi: Boolean,
    /** displaypasthistory {Boolean} - whether to display past history in emr landing screen */
    displaypasthistory: Boolean,
    /** displayfamilyhistory {Boolean} - whether to display family history in emr landing screen */
    displayfamilyhistory: Boolean,
    /** displaypersonalhistory {Boolean} - whether to display personal history in emr landing screen */
    displaypersonalhistory: Boolean,
    /** displayexamination {Boolean} - whether to display examination in emr landing screen */
    displayexamination: Boolean,
    /** displaydiagnosis {Boolean} - whether to display diagnosis in emr landing screen */
    displaydiagnosis: Boolean,
    /** displayicd10 {Boolean} - whether to display ICD 10 in emr landing screen */
    displayicd10: Boolean,
    /** displayprocedure {Boolean} - whether to display procedure in emr landing screen */
    displayprocedure: Boolean,
    /** displayicd9 {Boolean} - whether to display ICD 9 in emr landing screen */
    displayicd9: Boolean,
    /** keepemrwidgetsclosed {Boolean} - whether to keep emr widgets closed in emr landing screen */
    keepemrwidgetsclosed: Boolean,
    /** defaultTab {enum} */
    defaultTab: {
        type: String,
        enum: [
            frameworkenum.emrTabs.freeText,
            frameworkenum.emrTabs.previousData,
            frameworkenum.emrTabs.search,
            frameworkenum.emrTabs.ticksheet,
            frameworkenum.emrTabs.favouriteTicksheet,
            frameworkenum.emrTabs.favouriteNote,
            frameworkenum.emrTabs.template,
            frameworkenum.emrTabs.annotation,
            frameworkenum.emrTabs.form,
        ]
    },
    /** allowmultiprimarydiagnosis {Boolean} - whether to allow multiple primary diagnosis */
    allowmultiprimarydiagnosis: Boolean,
    /** comorbiditymandatory  {Boolean} - whether to make mandatory if it is not Primary Diagnosis.  */
    comorbiditymandatory: Boolean,
    /** defaultdiagnosiscodingschemeuid {ObjectId} - reference domain - CODISC */
    defaultdiagnosiscodingschemeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** defaultprocedurecodingschemeuid {ObjectId} - reference domain - CODISC */
    defaultprocedurecodingschemeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** showdefaultdiagnosiscodingschemeonly {Boolean} - whether to show all codeing scheme or default scheme only */
    showdefaultdiagnosiscodingschemeonly: Boolean,
    /** showdefaultprocedurecodingschemeonly {Boolean} - whether to show all codeing scheme or default scheme only */
    showdefaultprocedurecodingschemeonly: Boolean,
});

EMRSettingSchema.plugin(resuable);
module.exports = mongoose.model('EMRSetting', EMRSettingSchema);