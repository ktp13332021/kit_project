/**
 * Schema representing data for the daily bed occupancy snapshot. 
 * The snapshot is taken at mid night and mainly used for audit purposes.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module dailybedoccupancy
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the dailybedoccupancy.
 * 
 */
var DailyBedOccupancySchema = new Schema({
    /** dateofoccupancy {Date} - the date of occupancy */
    dateofoccupancy: Date,
    /** occupancedetails [] - details about the bed occupancy */
    occupancydetails: [{
        /** warduid {ObjectId} - optional ward to reserve */
        warduid: { type: Schema.ObjectId, ref: 'Ward', required: true, index: true },
        /** beduid {ObjectId} - optional bed to reserve */
        beduid: { type: Schema.ObjectId, ref: 'Bed', required: true, index: true },
        /** patientuid {ObjectId} - reference to the patient schema */
        patientuid: { type: Schema.ObjectId, ref: 'Patient' },
        /** patientvisituid {ObjectId} - reference to the patient visit schema */
        patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit' },
        /** occupieddate {Date} - date of patient occupancy */
        occupieddate: Date,
        /** visitstatusuid {ObjectId} - status of the visit - referencedomain code : VSTSTS */
        visitstatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** istemporarybed {Boolean} - whether temp bed or basinet */
        istemporarybed: Boolean,
        /** parentbeduid {ObjectId} - parent beduid in case of temporary bed */
        parentbeduid: { type: Schema.ObjectId, ref: 'Bed' },
        /** isbedundercleaning {Boolean}  - whether the bed is under clearning */
        isbedundercleaning: Boolean,
        /** isbedundermaintenance {Boolean}  - whether the bed is under fumigation or renovation */
        isbedundermaintenance: Boolean
    }]
});

/** plugin the framework attributes like createdat, createdby, etc. */
DailyBedOccupancySchema.plugin(resuable);
module.exports = mongoose.model('DailyBedOccupancy', DailyBedOccupancySchema);