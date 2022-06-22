/**
 * Schema representing master data for creating a user (ex: registration staff, pharmacist, nurses, doctors, etc) 
 * The user can be a careprovider (doctor) or a clinical staff or an administrative staff
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module User 
 */


// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

var UserAddressSchema = new Schema({
    address: String,
    area: String,
    areauid: { type: Schema.ObjectId, ref: 'Area' },
    city: String,
    cityuid: { type: Schema.ObjectId, ref: 'City' },
    state: String,
    stateuid: { type: Schema.ObjectId, ref: 'State' },
    country: String,
    countryuid: { type: Schema.ObjectId, ref: 'Country' },
    zipcode: String,
    zipcodeuid: { type: Schema.ObjectId, ref: 'Zipcode' },

});

var UserContactSchema = new Schema({
    workphone: String,
    homephone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String,

});

var UserSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} Defines the Full Name Of user*/
    name: { type: String, required: true, index: true },
    /** lastname {string} defines the last name given to the user -- lname in PROVIDER file*/
    lastname: String,
    /** nationalid {String} -Nationnal ID -- cid in PROVIDER file*/
    nationalid: String,
    /** dateofbirth  {Date} - Date of birth -- birth in PROVIDER file*/
    dateofbirth: Date,
    /** providertypeuid {ObjectId} - referencedomain code : PROVIDERTYPE -- providertype in PROVIDER file*/
    providertypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the user */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the user. Can be null for active departments. */
    activeto: Date,
    /** titleuid {ObjectId} - reference value for the 'TITLE'*/
    titleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** genderuid {ObjectId} - reference value for the 'GENDER'*/
    genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** qualification {String} - field for storing the qualification details. Can be printed in documents*/
    qualification: String,
    /** licensenumber {String} - the practising license number for the doctors*/
    licensenumber: String,
    /** licenseissuedate {Date} - the practising license issue date for the doctors*/
    licenseissuedate: Date,
    /** licenseexpirtydate {Date} - the practising license expiry date for the doctors*/
    licenseexpirtydate: Date,
    /** primarydeptuid {ObjectId} - Main department of the doctor*/
    primarydeptuid: { type: Schema.ObjectId, ref: 'Department' },
    /** doctorfeetypeuid {ObjectId} - reference value for the 'Doctor Fee type' - code DFFEET*/
    doctorfeetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** iscareprovider {Boolean} - whether the user is  a doctor */
    iscareprovider: Boolean,
    /** isopconsultant {Boolean} - whether the OPD patients can be registered for this doctor  */
    isopconsultant: Boolean,
    /** isadmitconsultant {Boolean} - whether the IPD patients can be admitted for this doctor  */
    isadmitconsultant: Boolean,
    /** issurgeon {Boolean} - whether the surgery booking / records can be made for this doctor  */
    issurgeon: Boolean,
    /** isanaesthetist {Boolean} - whether the doctor is an anaesthetist  */
    isanaesthetist: Boolean,
    /** isradiologist {Boolean} - whether the doctor is an radiologist  */
    isradiologist: Boolean,
    /** islaboratorist {Boolean} - whether is an islaboratorist  */
    islaboratorist: Boolean,
    /** isgeneratedoctorinvoice {Boolean} - whether is an isgeneratedoctorinvoice  */
    isgeneratedoctorinvoice: Boolean,
    /** address {UserAddressSchema} - address of the User */
    address: UserAddressSchema,
    /** contact {UserContactSchema} - contact details of the user such as phone, weburl, etc */
    contact: UserContactSchema,
    /** isgstregistered {Boolean} - whether the doctor is tax registered */
    isgstregistered: Boolean,
    /** gstregno {String} - tax registration number */
    gstregno: String,
    /** businessregno {String} - business registration number */
    businessregno: String,
    /** companyname {String} - company name used for tax registration purposes */
    companyname: String,
    /** companyaddress {String} - address of the company */
    companyaddress: String,
    /** activefrom {Date} - start date for the gst */
    gstactivefrom: Date,
    /** activeto {Date} - end date or expiry date for the gst. Can be null for active departments. */
    gstactiveto: Date,
    /** userimageuid {ObjectId} - link to the photograph of the doctor*/
    userimageuid: { type: Schema.ObjectId, ref: 'UserImage' },
    /** visitingorgs {[ObjectId]} - various organisations in this group in which the doctor consults*/
    visitingorgs: [{
        name: String,
        uid: { type: Schema.ObjectId, ref: 'Organisation' },
        activefrom: Date,
        activeto: Date
    }],
    /** defaultorguid {ObjectId} the default organisation to log in */
    defaultorguid: { type: Schema.ObjectId, ref: 'Organisation' },
    /** unused field. It is used only in the authentication method */
    parentorguid: { type: Schema.ObjectId, ref: 'Organisation' },
    /** alldepartments {Boolean} - whether the user can see access all department data*/
    alldepartments: Boolean,
    /** userdepartments {[ObjectId]} - specific departments that the user is associated with*/
    userdepartments: [{
        name: String,
        uid: { type: Schema.ObjectId, ref: 'Department' },
        activefrom: Date,
        activeto: Date
    }],
    /** defaultdepartment {ObjectId} - default department to be used when the user logs in*/
    defaultdepartment: {
        name: String,
        uid: { type: Schema.ObjectId, ref: 'Department' },
        activefrom: Date,
        activeto: Date
    },
    /** allwards {Boolean} - whether the user can see access all wards data*/
    allwards: Boolean,
    /** userwards {[ObjectId]} - specific wards that the user is associated with*/
    userwards: [{
        name: String,
        uid: { type: Schema.ObjectId, ref: 'Ward' },
        activefrom: Date,
        activeto: Date
    }],
    /** haslogin {Boolean} - whether the user needs login to the system*/
    haslogin: Boolean,
    /** loginid {String} - loginid of the user */
    loginid: { type: String },
    /** password {String} - password of the user in MD5 encrypted format */
    password: String,
    /** islocked {Boolean} - whether the user is automatically locked due to too many invalid login attempts */
    islocked: Boolean,
    /** noofinvalidlogins {Number} - record of number of invalid login attempts */
    noofinvalidlogins: Number,
    /** lastlogindate {Date} - last successful login date */
    lastlogindate: Date,
    /** changepasswordatnextlogin {Boolean} - whether to force the user to change password on next login */
    changepasswordatnextlogin: Boolean,
    /** userwards {[ObjectId]} - specific wards that the user is associated with*/
    roles: [{
        name: String,
        uid: { type: Schema.ObjectId, ref: 'Role' }
    }],
    /** defaultrole {ObjectId} - default role to select while login*/
    defaultrole: {
        name: String,
        uid: { type: Schema.ObjectId, ref: 'Role' }
    }

});
/** plugin the framework attributes like createdat, createdby, etc. */
UserSchema.plugin(resuable);

module.exports = mongoose.model('User', UserSchema);