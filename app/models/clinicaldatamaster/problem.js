
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var ProblemSchema = new Schema({
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
      /** isnotifiable {Boolean} - whether the problem is notifiable - default false */
      isnotifiable : Boolean,
      /** ischapter {Boolean} - whether the problem is ICD 10 parent chapter - default false*/
      ischapter : Boolean,
      /** bodysites [{ObjectId}] - if the problem is restricted to certain body sites*/
      bodysites : [{type: Schema.ObjectId, ref: 'ReferenceValue' }],
      /** parentproblemuid {ObjectId} - reference to the parent problem */
      parentproblemuid : { type: Schema.ObjectId, ref: 'Problem' },
      /** aliasnames {String} - alternative names for searching. defaults to empty - Chips control*/
      aliasnames : [{type: String}],
  });
  
 ProblemSchema.plugin(resuable);
 
 module.exports = mongoose.model('Problem', ProblemSchema);
