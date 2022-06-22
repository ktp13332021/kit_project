/**
 * Schema representing data for the inventory Item Master. 
 * The item master defines the attributes of the order item.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module inventorystore
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
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


var ItemMasterSchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given to the department*/
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** notes {string} - comments or text with additional details */
    notes: String,
    /** orderitemuid {ObjectId} - reference to the order item  - autocomplete*/
    orderitemuid: {
        type: Schema.ObjectId,
        ref: 'OrderItem'
    },
    /** activefrom {Date} - start date for the department */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the department. Can be null for active departments. */
    activeto: Date,
    /** baseuomuid {ObjectId} - reference domain code : INVUOM */
    baseuomuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** purchasinguomuid {ObjectId} - reference domain code : INVUOM */
    purchasinguomuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** externalcode {string} - code used by the state, suppliers, etc */
    externalcode: {
        type: String
    },
    /** shortname {string} - short name to print in barcode, etc */
    shortname: {
        type: String
    },
    /** isnoninventoryitem {Boolean} - whether the item is non inventory (only used for purchasing, such as TV, Computer,etc) - defaults to false */
    isnoninventoryitem: Boolean,
    /** isbatchidmandatory {Boolean} - enabled only for inventory items.  defaults false*/
    isbatchidmandatory: Boolean,
    /** isexpirydatemandatory {Date} - enabled only for inventory items. defaults to true */
    isexpirydatemandatory: Boolean,
    /** stockauditgroup {ObjectId} - the associated groups for freezing and auditing : STKAUD*/
    stockauditgroup: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** allowconsignmentstock {Boolean} - whether this allows consignment stocks */
    allowconsignmentstock: Boolean,
    /** allowfractions {Boolean} - whether to support fractional quantity dispensing */
    allowfractions: Boolean,
    /** allownegativestock {Boolean} - whether to dispense below zero level */
    allownegativestock: Boolean,
    /** taxcodeuid {ObjectId} - reference to the GST Tax Code */
    taxcodeuid: {
        type: Schema.ObjectId,
        ref: 'TaxMaster'
    },
    /** manufacturedby {ObjectId} - reference to the vendor master */
    manufacturedby: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    /** distributedby {ObjectId} - reference to the vendor master */
    distributedby: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    /** itemtypeuid {ObjectID} - reference value for the item type : ITMTYP*/
    itemtypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** storageinstructionuid {ObjectId} - instructions for storing the item : STGINS */
    storageinstructionuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** handlingstores {ObjectId} - list of inventory stores using this item*/
    handlingstores: [{
        storeuid: {
            type: Schema.ObjectId,
            ref: 'InventoryStore'
        },
        binuid: {
            type: Schema.ObjectId,
            ref: 'InventoryStore.storebins'
        },
        isstockitem: Boolean
    }],
    /** reorderdetails [{}] - details for reorderlevels for different stores*/
    reorderdetails: [{
        storeuid: {
            type: Schema.ObjectId,
            ref: 'InventoryStore'
        },
        minstocklevel: Number,
        maxstocklevel: Number,
        refilltomaxlevel: Boolean,
        eoq: Number,
        reorderlevel: Number,
        reorderquantity: Number,
        reorderlevelformula: String,
        reorderqtyformula: String
    }],
    /** alternativeitems -  list of alternative items that can be used*/
    alternativeitems: [{
        type: Schema.ObjectId,
        ref: 'ItemMaster'
    }],
    /** allowrepacking - whether to allow repacking of items */
    allowrepacking: Boolean,
    /** itemimageuid {Photo} - the photograph of the item */
    itemimageuid: {
        type: Schema.ObjectId,
        ref: 'ItemImage'
    },
    /** ismanufacturingitem - whether the item is manufactured locally such as topical creams, etc */
    ismanufacturingitem: Boolean,
    /** isautobatch - whether the manufactured item use auto batchid */
    isautobatch: Boolean,
    /** expiryaftermanufacture - Day of Expiry after manufacturing */
    expiryaftermanufacture: Number,
    /** manufacturequantity - output quantity manufactured based on the formula */
    manufacturequantity: Number,
    /** manufactureminquantity - minimum output quantity for manufacture */
    manufactureminquantity: Number,
    /** manufacturemaxquantity - maximum output quantity for manufacture */
    manufacturemaxquantity: Number,
    /** manufactureformula [{}] - formula used for manufacturing */
    manufactureformula: [{
        ingredient: {
            type: Schema.ObjectId,
            ref: 'ItemMaster'
        },
        inputquantity: Number
    }],
    /** auditlog {AuditLog} - details of the audit changes */
    auditlog: [AuditLog],
    /**  */
    vendordetails: [{
        vendoruid: { type: Schema.ObjectId, ref: 'Vendor', required: true },
        orderofpreference: { type: Number, required: true }
    }],
    /** abcanalysisuid {ObjectId} - reference domaincode : ABCANL   Label : ABC Analysis */
    abcanalysisuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** venanalysisuid {ObjectId} - reference domaincode : VENANL   Label : VEN Analysis */
    venanalysisuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    }

});

/** plugin the framework attributes like createdat, createdby, etc. */
ItemMasterSchema.plugin(resuable);
module.exports = mongoose.model('ItemMaster', ItemMasterSchema);