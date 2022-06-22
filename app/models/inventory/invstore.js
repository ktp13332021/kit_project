/**
 * Schema representing data for the inventory store (warehouse) parameters. 
 * The store (warehouse) has parameters necessary for the inventory transactions
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module inventorystore
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
var invEnums = require('./inventoryenums');
/**
 * Schema defining the inventorystore.
 * 
 */

/** schema for item master audit log change */
var AuditLog = new Schema({
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: Date,
    /** modifiedby {ObjectId} - the logged in user who made the chagne to the patient */
    modifiedby: { type: Schema.ObjectId, ref: 'User' },
    /** organisationuid {ObjectId} - the organisation of the logged in user who made the chagne to the patient */
    organisationuid: { type: Schema.ObjectId, ref: 'Organisation' },
    /** postaudit {String} - diff from previous to current*/
    postaudit: String
});

var InventoryStoreSchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given to the department */
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the department */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the department. Can be null for active departments. */
    activeto: Date,
    /** departmentuid {ObjectId} - reference to the department owning the department */
    departmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** parentstoreuid {ObjectId} - reference to the parent store if this is a substore */
    parentstoreuid: {
        type: Schema.ObjectId,
        ref: 'InventoryStore'
    },
    /** allocatepolicy - the policy used for allocation of stock */
    allocatepolicy: {
        type: String,
        enum: [
            invEnums.allocatePolicy.fifo,
            invEnums.allocatePolicy.fefo
        ]
    },
    /** druglicensenumber {String} - the drug license number for the store */
    druglicensenumber: String,
    /** preventsameitemstockrequest {Number} - the configurable days within which stock request of any of the items will not be allowed, if there is already an outsanding stock request for same item. */
    preventsameitemstockrequest: Number,
    /** isgstregistered {Boolean} - whether the doctor is tax registered */
    isgstregistered: Boolean,
    /** gstregno {String} - tax registration number */
    gstregno: String,
    /** companyname {String} - company name used for tax registration purposes */
    companyname: String,
    /** companyaddress {String} - address of the company */
    companyaddress: String,
    /** supportallfunctions {Boolean} - whether to support all functions or restrict */
    supportallfunctions: Boolean,
    /** restrictfunctions - the list of transations supported by the store */
    restrictfunctions: [{
        type: String,
        enum: [
            invEnums.restrictStoreFunctions.purchaseOrder,
            invEnums.restrictStoreFunctions.purchaseReq,
            invEnums.restrictStoreFunctions.goodsReceive,
            invEnums.restrictStoreFunctions.stockReq,
            invEnums.restrictStoreFunctions.stockTransfer,
            invEnums.restrictStoreFunctions.stockDispense,
            invEnums.restrictStoreFunctions.vendorReturn
        ]
    }],
    /** approvalreqdforgrn {Boolean} - need approval for goods receive */
    approvalreqdforgrn: Boolean,
    /** approvalreqdfortransferin {Boolean} - approval required for transfer in */
    approvalreqdfortransferin: Boolean,
    /** approvalreqdforstockrequest {Boolean} - approval required for stock request */
    approvalreqdforstockrequest: Boolean,
    /** restrictusers [{ObjectId}] - the users who can transact with the store */
    restrictusers: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    /** storebins [{String}] - the name of the bins within the store */
    storebins: [{
        name: String
    }],
    /** Store level reorder details - Will be used only if not defined for an item.*/
    reorderlevelformula: String,
    reorderquantityformula: String,
    /** Receive item from any vendor */
    receiveitemfromanyvendor: Boolean,
    /** approvalmatrix - to be done */
    /** auditlog {AuditLog} - details of the audit changes */
    auditlog: [AuditLog],
    /** To display default average cost for item */
    displayitemavgcost: Boolean,
    /** whether the store is autodispense store */
    autodispensestore: Boolean,
    /** expiry warning period (in days) */
    expirywarningdays : Number

});

/** plugin the framework attributes like createdat, createdby, etc. */
InventoryStoreSchema.plugin(resuable);
module.exports = mongoose.model('InventoryStore', InventoryStoreSchema);