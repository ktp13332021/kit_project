
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var AlertSchema = new Schema({
        /** patientuid {ObjectId} - reference to the patient schema */
        patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
        /** patientvisituid {ObjectId} - reference to the patient visit schema */
        patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
        /** departmentuid {ObjectId} - the department of the logged in user */
        departmentuid: { type: Schema.ObjectId, ref: 'Department' },
        /** alerts - links to the alerts */
        alerts: [{
                /** referencedomain code : ALRTYP */
                alerttypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
                startdate: Date,
                enddate: Date,
                /** True or False */
                isactive: Boolean,
                alertmessage: String,
                alldepartments: Boolean,
                restrictdepartments: [{
                        departmentuid: { type: Schema.ObjectId, ref: 'Department' }
                }],
                createdby: { type: Schema.ObjectId, ref: 'User', required: true },
                createdat: { type: Date, required: true },
                auditlog : [{
                        useruid : {type:Schema.ObjectId, ref:'User'},
                        activestatus : Boolean,
                        modifiedat : Date,
                        alertmessage : String    
                }],
                acknowledgedby : [{
                        useruid : {type:Schema.ObjectId, ref:'User'},
                        acknowledgedate : Date,

                }]
        }]
});

AlertSchema.plugin(resuable);

module.exports = mongoose.model('Alert', AlertSchema);