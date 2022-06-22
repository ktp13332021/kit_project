/**
 * Schema representing the Automatic Orders for OPD / ER.
 * The AutoChargeOrder schema stores the encounter type, department and the automatic orders that need to be raised for them.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module AutoChargeOrder
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var AutoChargeOrderSchema = new Schema({
    /** departmentuid {ObjectId} - reference to the department in which the patient is registered */
    departmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** bedcategoryuid {ObjectId} - Reference domain code : BEDCAT - combo box selection*/
    bedcategoryuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** encountertypeuid {ObjectId} - Reference domain code : ENTYPE - combo box selection*/
    encountertypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue',
        required: true
    },
    /** visittypeuid {ObjectId} - reference domain : VSTTYP - combo box selection */
    visittypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** orderitemuid {ObjectId} - reference to the order item that needs to be raised */
    orderitemuid: {
        type: Schema.ObjectId,
        ref: 'OrderItem',
        required: true
    },
    /** starttime {Date} - the start time (only time part) for this autocharge */
    starttime: Date,
    /** endtime {Date} - the end time (only time part) for this autocharge */
    endtime: Date,
    /** comments {string} - comments or text with additional details */
    comments: String,
    /** activefrom {Date}  - start date for the autocharge */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the autocharge. */
    activeto: Date
});

AutoChargeOrderSchema.plugin(resuable);

module.exports = mongoose.model('AutoChargeOrder', AutoChargeOrderSchema);