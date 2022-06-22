// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var obstetricsummary = require('./obstetricsummary');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var CareTeam = new Schema({
    // obstetrician: { type: Schema.ObjectId, ref: 'User' },
    // obstetricianassistant: { type: Schema.ObjectId, ref: 'User' },
    // anaesthetist: { type: Schema.ObjectId, ref: 'User' },
    // scrubnurse: { type: Schema.ObjectId, ref: 'User' },
    // others: String

    /** membraneruptureuid {ObjectId} - reference value code 'CARETEAM' */
    typeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /**careprovideruid {ObjectId} - reference to the user in care team*/
    careprovideruid: { type: Schema.ObjectId, ref: 'User' }
});

var LabourOnsetDetail = new Schema({
    /** labouronsetdatetime {Date} - the onset date time of the labour */
    labouronsetdatetime: Date,
    /** membraneruptureuid {ObjectId} - reference value code 'MEMRPT' */
    membraneruptureuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** membranerupturedatetime {Date} - the date & time of membrane rupture */
    membranerupturedatetime: Date,
    /** membranemethod {ObjectId} - refernece value code 'MEMBRANEMETHOD' */
    membranemethod: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** amnioticfluid {ObjectId} - refernece value code 'AMFLUD' */
    amnioticfluid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** fulldilatationdatetime {Date} - the details of full dialatation */
    fulldilatationdatetime: Date,
    /** childbirthdatetime  {Date} - the date and time of child */
    childbirthdatetime: Date,
    /** placentabirthdatetime {Date} - the date and time of placenta */
    placentabirthdatetime: Date,
    /** stage1datetime {Date} - the date and time of stage 1 */
    stage1datetime: String,
    /** stage2datetime {Date} - the date and time of stage 2 */
    stage2datetime: String,
    /** stage3datetime {Date} - the date and time of stage 3 */
    stage3datetime: String,
    /** totallabourduration {String}  - the total hours & time of duration of labour*/
    totallabourduration: String,
    /** durationmembrane {String}  - the hours & time of duration of membrane*/
    durationmembrane: String,
    /** modeofdeliveryuid {ObjectId} - reference value code 'DLVYMD' */
    modeofdeliveryuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** modeofdeliveryremark {String}  - the hours & time of duration of labour*/
    modeofdeliveryremark: String,
    /** presentationuid {ObjectId} - reference value code 'PRSTTN' */
    presentationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** indicationuid {ObjectId} - reference value code 'INDCTN' */
    indicationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** complications {String} - details of complications if any */
    complications: String
});

var PregnacyDetail = new Schema({
    /** pastdeliverylast {Number} -  */
    pastdeliverylast: Number,
    /** pastpresenthistory {Number} -  */
    pastpresenthistory: Number,
    /** gravida {Number} -  */
    gravida: Number,
    /** para {Number} -  */
    para: Number,
    /** fullterm {Number} -  */
    fullterm: Number,
    /** premature {Number} -  */
    premature: Number,
    /** abortion {Number} -  */
    abortion: Number,
    /** living {Number} -  */
    living: Number,
    /** stillbirth {Number} -  */
    stillbirth: Number,
    /** typeofonset {ObjectId} - reference value code 'TYPEOFONSET' */
    typeofonset: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** istr {Boolean} - whether it is larceration */
    istr: Boolean,
    /** otherprocedure {ObjectId} - reference value code 'OTHERPROCEDURE' */
    otherprocedure: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** otherprocedureremark {String } - anyother remarks */
    otherprocedureremark: String,
    /** isepisiotomy {Boolean} - whether it is episiotomy */
    isepisiotomy: Boolean,
    /** episiotomyuid {ObjectId} - reference value code 'EPISMY' */
    episiotomyuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** islarceration {Boolean} - whether it is larceration */
    islarceration: Boolean,
    /** larcerationuid {ObjectId} - reference value code 'LRSRTN' */
    larcerationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** maternalcomplication {ObjectId} - reference value code 'MATERNALCOM' */
    maternalcomplication: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** deliverycomplication {ObjectId} - reference value code 'DELIVERYCOM' */
    deliverycomplication: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** grossappear {ObjectId} - reference value code 'GROSSAPPEAR' */
    grossappear: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** postpartum {ObjectId} - reference value code 'POSTPARTUM' */
    postpartum: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** postpartumremark {String } - anyother remarks */
    postpartumremark: String,
    /** ebl {String } - anyother remarks */
    ebl: Number,
    /** tear {ObjectId} - reference value code 'TEAR' */
    tear: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** durationstitches {Number } - duration of stitches */
    durationstitches: Number,
    /** anesthesia {ObjectId} - reference value code 'ANESTHESIA' */
    anesthesia: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** anestheticcomplications {String } - anyother remarks */
    anestheticcomplications: String,

});

var PlacentaRecord = new Schema({

    /** modeofplacenta {ObjectId} - reference value code 'MODEOFPLACENTA' */
    modeofplacenta: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** modeofplacentatext {String } - anyother remarks */
    modeofplacentatext: String,
    /** modeofplacenta {ObjectId} - reference value code 'PLACENTAPCS' */
    placentapcs: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** placentaweight {Number} - the weight of the placenta */
    placentaweight: Number,
    /** modeofplacenta {ObjectId} - reference value code 'TYPEOFPLACENTA' */
    typeofplacenta: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** modeofplacentatext {String } - anyother remarks */
    typeofplacentatext: String,
    /** cordlength {Number} - the details of the cord length */
    cordlength: Number
});

var LabourDetailSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** lmpdate {Date} - the date of the last menstrual period */
    lmpdate: Date,
    /** edcdate {Date} - the date of edc calculated */
    edcdate: Date,
    /** GAperiodinweeks {Number} - the GA period in weeks */
    gaperiodinweeks: String,
    /** GAperiodindays {Number} - the remaining period in days */
    gaperiodindays: String,
    /** obstetricsummary {ObjectId} - summary of hte obstetic histroy of the patient */
    obstetricsummary: obstetricsummary.ObstetricSummary,
    /** details about the team who are involved in managing the labour */
    careteam: [CareTeam],
    /** labouronsetdetail - details of the labour onset timings */
    labouronsetdetail: [LabourOnsetDetail],
    /** pregnacydetail - details of the labour onset timings */
    pregnacydetail: PregnacyDetail,
    /** placentarecord - details of the placenta */
    placentarecord: [PlacentaRecord],
    /** method {String } - EDC or US Method record */
    method: String,
    /** ultrasounddate {Date} - the date of the ultrasound scan period */
    ultrasounddate: Date,
    /** gabyus {String } - the GA period in Week and day Ultrasound*/
    gabyus: String,
    /** tribandnumber {String} - the number of the triband that is used for mother and baby */
    tribandnumber: String,
    /** comments {String } - anyother remarks */
    comments: String,
    /** istwin {Boolean} - if number of babies ar more than one*/
    istwin: Boolean,
    /** numberofbabies {Date} - the number of babies delivered */
    numberofbabies: Number,
    /** gabymanual  {String} - GA by Manual */
    gabymanual: String,
    /** outsidelabdetails {ObjectId} - reference to the observation object */
    outsidelabdetails: { type: Schema.ObjectId, ref: 'Observation' },
    /** medicationrecord {ObjectId} -  reference to the form in labour detail  */
    medicationrecord: { type: Schema.ObjectId, ref: 'PatientForm' }
});

LabourDetailSchema.plugin(resuable);

module.exports = mongoose.model('LabourDetail', LabourDetailSchema);