/**
 * Schema representing master data for defining a Organisation (ex: Hospital, Primary, etc) 
 * The organisation can be defined within the hospital group
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module Organisation
 */

// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;

var EnterpriseAddressSchema = new Schema({
        address : String,
        area : String,
        areauid : { type: Schema.ObjectId, ref: 'Area' },
        city : String,
        cityuid : { type: Schema.ObjectId, ref: 'City' },
        state : String,
        stateuid : { type: Schema.ObjectId, ref: 'State' },
        country : String,
        countryuid : { type: Schema.ObjectId, ref: 'Country' },
        zipcode : String,
        zipcodeuid : { type: Schema.ObjectId, ref: 'Zipcode' }
        
    });

    var EnterpriseContactSchema = new Schema({
        workphone : String,
        homephone : String,
        mobilephone : String,
        alternatephone : String,
        emailid : String,
        weburl : String
       
    });

  var OrganisationSchema = new Schema({
    /** uid {Number} has to be unique for an organisation */
    uid : { type : Number},
    /** Code {string} has to be unique */
    code : {type : String, required:true, index: true},
    /** Name {string} defines the  name given to the organisation*/
    name : {type : String, required:true, index: true},
    /** description {string} - comments or text with additional details */
    description : String,
    /** activefrom {Date} - start date for the organisation */ 
    activefrom : Date,
    /** activeto {Date} - end date or expiry date for the organisation . Can be null for active organisations. */ 
    activeto : Date,
    levelcode : String,
    /** parentorguid {ObjectId} - parent of this organisation in a hospital group*/
    parentorguid : { type: Schema.ObjectId, ref: 'Organisation' },
    /** orgtypeuid {ObjectId} - type of the organisation such as primary care, acute care, etc*/
    orgtypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isgstregistered {Boolean} - whether the hospital is tax registered */
    isgstregistered : Boolean,
    /** gstregno {String} - tax registration number */
    gstregno : String,
    /** businessregno {String} - business registration number */
    businessregno: String,
    /** companyname {String} - company name used for tax registration purposes */
    companyname : String,
     /** address {EnterpriseAddressSchema} - address of the hospital */
    address : EnterpriseAddressSchema,
    /** contact {EnterpriseContactSchema} - contact details of the hospital such as phone, weburl, etc */
    contact : EnterpriseContactSchema,
    /** organisationimageuid {ObjectId} - link to the photograph of the oranisation*/
    organisationimageuid : { type: Schema.ObjectId, ref: 'OrganisationImage' },
    /** Organisation Code {string} link to interface government*/
    organisationcode: String
  });
  
OrganisationSchema.plugin(resuable);
module.exports = mongoose.model('Organisation', OrganisationSchema);

