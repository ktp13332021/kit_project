/**
 * Schema representing Patient Visit.
 * The PatientVisit schema stores the all the detail such as department, doctor, payor etc of each OPD or IP visit of the patient.
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module PatientVisit
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
var PatientVisitCareprovider = new Schema({
    departmentuid: { type: Schema.ObjectId, ref: 'Department', required: true, },
    visittypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    startdate: { type: Date},
    clinicuid: { type: Schema.ObjectId, ref: 'Location' },
    priorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    linkedapptuid: { type: Schema.ObjectId },
    comments: { type: String },
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    outcomeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** entypeuid {ObjectId} - type of the encounter - referencedomain code : ENTYPE  */
    entypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    queuenumber: { type: String }
});


var PatientVisitBeds = new Schema({
    /** warduid {ObjectId} - optional ward to reserve */
    warduid: { type: Schema.ObjectId, ref: 'Ward' },
    /** beduid {ObjectId} - optional bed to reserve */
    beduid: { type: Schema.ObjectId, ref: 'Bed' },
    /** startdate {Date} - date of patient occupancy */
    startdate: Date,
    /** enddate {Date} - date of patient occupancy */
    enddate: Date,
    /** istemporarybed {Boolean} - whether temp bed or basinet */
    istemporarybed: Boolean,
    /** parentbeduid {ObjectId} - parent beduid in case of temporary bed */
    parentbeduid: { type: Schema.ObjectId, ref: 'Bed' },
    /** bedcategoryuid {ObjectId} - reference to the bed */
    bedcategoryuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** bedpackageuid {ObjectId} - reference to the bed package */
    bedpackageuid: { type: Schema.ObjectId, ref: 'OrderSet' },
    /** useruid {ObjectId} - reference to the user who updated */
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** visitstatusuid {ObjectId} - reference to the visit status */
    //statusuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isactive {Boolean} - whether the bed is actively used */
    isactive: Boolean,
    /** islodgerbed {Boolean} - whether the bed is used by patient or by nok */
    islodgerbed: Boolean,
    /** isolatedbed {Boolean} - whether the bed is used by patient or by nok */
    isolatedbed: Boolean,
    /** comments {String} - comments from bed assign, transfer, release */
    comments: String
});
var ReferralSourceSchema = new Schema({
    /** reftypeuid {ObjectId} - type of the referral - referencedomain code : REFTYP  */
    reftypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    referringorguid: { type: Schema.ObjectId, ref: 'ReferringOrg' },
    referreddate: { type: Date },
    comments: { type: String }
});

var PatientVisitPayor = new Schema({
    /** orderofpreference {Number} - preferential order for this payor  */
    orderofpreference: { type: Number, required: true },
    /** payoruid {ObjectId} - link to the payor schema */
    payoruid: { type: Schema.ObjectId, required: true, ref: 'Payor' },
    /** payoragreementuid {ObjectId} - link to the payoragreement schema */
    payoragreementuid: { type: Schema.ObjectId, required: true, ref: 'PayorAgreement' },
    /** tpauid  */
    tpauid: { type: Schema.ObjectId, ref: 'TPA' },
    /** activefrom {Date} - start date for the payor for this patient */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the patient payor */
    activeto: Date,
    /**   policydetails {String} - Details about the policy */
    policydetails: String,
    /** opdcoverperday {Number} - OPD Cover max amount per day */
    opdcoverperday: Number,
    /** claimpercentage {Number} - Claim Percentage  */
    claimpercentage: Number,
    /** fixedcopayamount {Number} - fixed copay amount to be paid by the patient*/
    fixedcopayamount: Number,
    /** comments {String} - any comments */
    comments: String,
    gldetailsuid : { type: Schema.ObjectId, ref: 'PayorGuaranteeLetter' },
    //we can deprecate this field and remove it from the database in future release.
    gldetails: {
        /** glrefnumber {String} - the GL reference Number */
        glrefnumber: String,
        /** glvalidupto {Date} - the validity period for the GL */
        glvalidupto: Date,
        /** creditlimit {Number} - the credit limit amount */
        creditlimit: Number
    }
});

var PatientVisitJourney = new Schema({
    /** departmentuid {ObjectId} - the department of the visit careprovider */
    departmentuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /** useruid {ObjectId} - the user who updated the patient tracking status */
    useruid: { type: Schema.ObjectId, ref: 'User', required: true },
    /** careprovideruid {ObjectId} - the doctor at the time of sttatus change. */
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** statusuid {ObjectId} - the status which as updated */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** modifiedat {Date} - the date time at which the status was updated */
    modifiedat: Date,
    /** comments {String} - provision to record comments in future */
    comments: String
});

var PatientVisitSchema = new Schema({
    /** patientuid {ObjectId} - reference to the Patient Schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** entypeuid {ObjectId} - type of the encounter - referencedomain code : ENTYPE  */
    entypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** patientepisodeuid {ObjectId} - reference to the patient episode  */
    patientepisodeuid: { type: Schema.ObjectId, ref: 'PatientEpisode' },
    /** visitid {String} - unique sequence number generated for this visit */
    visitid: { type: String, required: true },
    /** visitstatusuid {ObjectId} - status of the visit - referencedomain code : VSTSTS */
    visitstatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** startdate {Date} - date time stamp made when the patient visit is created (registration / admission) */
    startdate: { type: Date, required: true, },
    /** enddate {Date} - date time stamp when the patient is discharged */
    enddate: { type: Date },
    /** isreadmission {Boolean} - whether the patient has visited the hospital within 72 hours (for same problen) - defaults false */
    isreadmission: { type: Boolean },
    /** ispatientpregnant {Boolean} - whether the patient is pregnant - defaults false - disabled for Male patients */
    ispatientpregnant: { type: Boolean },
    /** transfermode {ObjectId} - mode of transfer Stretcher, Amubulance, WheelChair - referencedomain code : TRNSMD  */
    transfermode: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** visitcareproviders {PatientVisitCareprovider}  - contains the associated department, doctor details  for this patient visit */
    visitcareproviders: [PatientVisitCareprovider],
    /** refererdetail {ReferralSourceSchema} - the clinic / gp who referred this patient visit */
    refererdetail: ReferralSourceSchema,
    /** visitpayors {PatientVisitPayor} - the payor details for this patient visit */
    visitpayors: [PatientVisitPayor],
    /** visitjourney {PatientVisitJourney} - the details of where all the patient went in this visit.*/
    visitjourneys: [PatientVisitJourney],
    /** these attribtues are used only for ipd admissions */
    bedoccupancy: [PatientVisitBeds],
    /** expectedlos {number} - expected length of stay */
    expectedlos: Number,
    /** bedbookinguid {ObjectId} - reference to the bed booking */
    bedbookinguid: { type: Schema.ObjectId },
    /** admissionrequestuid {ObjectId} -reference to the admissino request */
    admissionrequestuid: { type: Schema.ObjectId, ref: 'AdmissionRequest' },
    /** patientnok {String} - name of the patient attender */
    patientnok: String,
    /** patientnokcontact {String} - phone number of the nok */
    patientnokcontact: String,
    /** isolationrequired { Boolean}  - whether the patient needs isolation*/
    isolationrequired: Boolean,
    /** converted from OPD to IPD */
    isconvertedfromopd: Boolean,
    /** visitidbeforeconvert {String} - visit id before converted to IPD */
    visitidbeforeconvert: String,
    /** expecteddischargedate {Date} - set once discharge planning is initiated */
    expecteddischargedate: Date,
    /** ismedicolegalcase {Boolean} - whether the admission is related to medico legal case */
    ismedicolegalcase: Boolean,
    /** complaintnumber {String} - the legal complaint number */
    complaintnumber: String,
    /** incidentdetails {String} - details about the incident */
    incidentdetails: String,
    /** ismrdcoded {Boolean} - whether the MRD is coded */
    ismrdcoded: Boolean,
    /** medicaldischargedate {Date} - Date time at which the visit status was modified to medical discharge*/
    medicaldischargedate: Date,
    /** optypeuid {ObjectId} - op type - referencedomain code : OPTYPE -- opbkk government  */
    optypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** statusbeforelock {StatusBeforeLock} - List of visit status for all visitcareproviders and outer field before billing lock */
    statusbeforelock: {
        visitstatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        visitcareproviders: [{
            departmentuid: { type: Schema.ObjectId, ref: 'Department' },
            careprovideruid: { type: Schema.ObjectId, ref: 'User' },
            statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' }
        }]
    }
});


PatientVisitSchema.plugin(resuable);
module.exports = mongoose.model('PatientVisit', PatientVisitSchema);