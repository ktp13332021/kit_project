/**
 * Schema representing Forms in EMR details.
 * The Forms  contains filled up and completed form template of the patient.
 * See {@tutorial form-tutorial} for an overview.
 *
 * @module PatientForm
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var FormAttributeSchema = new Schema({
       /** attributeuid {ObjectId} - reference to data attribute */
       attributeuid : {type:Schema.ObjectId, required:true},
       /** name given to the section */
       name : {type: String, required : true},
       /**datavalue {String} - the data entered by the user. It can be date, boolean or text. All stored as string */
       datavalue : String,
       /** additionalvalue {String} - any additional data can be stored here in comma separated */
       additionalvalue : String
    });

// define schema
var PrefilledFormSchema = new Schema({
        /** careprovideruid {ObjectId} - reference to the patient schema */
        careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true, index: true },
       /** departmentuid {ObjectId} - the department from the patient visit */
        departmentuid: { type: Schema.ObjectId, ref: 'Department' },
       /** templateuid {ObjectId} - the reference to the Form template */
        templateuid: { type: Schema.ObjectId, ref: 'FormTemplate', required:true},
       /** formdate {Date} - date of the certificate */
        formdate : {type:Date, required:true},
       /** templateversion {Number} - versionnumber of Form template*/
       templateversion : Number, 
        /** Name {string} defines the  name given for the prefilled form*/
       name : {type :String,required:true, index: true},
      
      /** AttributeValues  {FormAttributeSchema}] - array of form attributes. */
      attributevalues : [FormAttributeSchema]
});  

PrefilledFormSchema.plugin(resuable);

module.exports = mongoose.model('PrefilledForm', PrefilledFormSchema);