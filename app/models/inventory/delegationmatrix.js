/**
 * Schema representing delegation matrix  document.
 * The delegation matrix document containts the details for delegation from one user to another.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module contract
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DelegationMatrixSchema = new Schema({
    /** approveruid {String} - the user who approves */
    approveruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
     /** delegateduseruid {String} - the user to whom it is delegated */
     delegateduseruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** activefrom {Date} - start date for the delegation */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the delegation. Can be null for active delegations. */
    activeto: Date,
    /** comments */
    comments : String,
    /** receivedby {String} - the user who created this record */
    delegationsetupby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** receivedate {Date} - date in which this record was created*/
    delegationsetupdate: Date

});

DelegationMatrixSchema.plugin(resuable);

module.exports = mongoose.model('DelegationMatrix', DelegationMatrixSchema);
