
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation


 var NutritionRequirementSchema = new Schema({
       energy : Number,
       fat : Number,
       protein : Number,
       calories : Number,
       carbohydrate : Number
       
    });

// define schema
var PatientDietPlanSchema = new Schema({
  /** patientuid {ObjectId} - reference to the patient schema */
  patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
  /** patientvisituid {ObjectId} - reference to the patient visit schema */
  patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
  /** dieticianuid {ObjectId} - reference to the dietician*/
  dieticianuid : { type: Schema.ObjectId, ref: 'User'},
  /** startdate {Date} - start date of the plan */
  startdate : Date,
  /** dietpreferenceuid {ObjectId} - reference to the patient diet preference - reference value code : DIETPR */
  dietpreferenceuid : { type: Schema.ObjectId, ref: 'ReferenceValue'},
  /** prescribeddietuid [{ObjectId}] - reference to the prescribed diet. multiple selection - reference code : DIETPB */
  prescribeddietuid : [{ type: Schema.ObjectId, ref: 'ReferenceValue'}],
  /** nutritionrequirement {ObjectId} - reference to the nutritionrequirement schema */
  nutritionrequirement : NutritionRequirementSchema,
  /** comments {String} - comments about the plan */
  comments : String
});

PatientDietPlanSchema.plugin(resuable);

module.exports = mongoose.model('PatientDietPlan', PatientDietPlanSchema);
