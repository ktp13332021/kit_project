
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var ProcedureSchema = new Schema({
      /** codingschemeuid {ObjectId} - reference domain - CODISC */
      codingschemeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
       /** Name {string} defines the  name given for the problem*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** locallangdesc {String} - local language for the problem*/
      locallangdesc : String,
       /** activefrom {Date} - start date for the problem*/ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the problem. */ 
      activeto : Date,
      /** planningtypeuid {ObjectId} - reference domain SRGTYP */
      planningtypeuid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** criticalityuid {ObjectId} - reference domain CRITCL */
      criticalityuid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** anaesthesiauid {ObjectId} - reference domain ANESTY*/
      anaesthesiauid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** bodysiteuid {ObjectId} - reference domain BODYSI */
      bodysiteuid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
       /** lateralityuid {ObjectId} - reference domain LATRTY */
      lateralityuid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
       /** standardduration {Number} - Duration in minutes */
      standardduration : Number,
      /** templateuid {ObjectId} - reference to dynamic form uid. Reference domain code 'PRTMPL' */
      /** values - PreOp Check List, PostOp Check List, Anaesthesia Check List, Surgeon Notes */ 
      templates : [{templatetypeuid :{ type: Schema.ObjectId, ref: 'ReferenceValue' },
                    templateuid : { type: Schema.ObjectId, ref: 'FormTemplate' } }]
  });
  
 ProcedureSchema.plugin(resuable);
 
 module.exports = mongoose.model('Procedure', ProcedureSchema);
