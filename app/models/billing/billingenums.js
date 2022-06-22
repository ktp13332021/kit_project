var params = {
    roundOffAt: {
        billLevel: 'BILLINGENUMS.BILLLEVELROUNDOFF',
        billingGroupLevel: 'BILLINGENUMS.BILLINGGROUPLEVELROUNDOFF'
    },
    roundOffLevel: {
        floor: 'BILLINGENUMS.ROUNDOFFFLOOR',
        ceil: 'BILLINGENUMS.ROUNDOFFCEIL',
        midPoint: 'BILLINGENUMS.ROUNDOFFMIDPOINT'
    },
    roundOffMidPoints: {
        _25: 'BILLINGENUMS.ROUNDOFF25MIDPOINT',
        _50: 'BILLINGENUMS.ROUNDOFF50MIDPOINT'
    }
};
params.roundOffAt.default = params.roundOffAt.billLevel;
params.roundOffLevel.default = params.roundOffLevel.midPoint;
params.roundOffMidPoints.default = params.roundOffMidPoints._50;
exports.params = params;

var depositTypes = {
    general: 'BILLINGENUMS.DEPTYPEGENERAL',
    encounter: 'BILLINGENUMS.DEPTYPEENCOUNTER',
    department: 'BILLINGENUMS.DEPTYPEDEPARTMENT',
    billingGroup: 'BILLINGENUMS.DEPTYPEBILLINGGROUP'
};
depositTypes.default = depositTypes.general;
exports.depositTypes = depositTypes;

var chargeCodeTypes = {
    patientPackage: 'PATIENTPACKAGE',
    patientOrder: 'PATIENTORDER'
};
chargeCodeTypes.default = chargeCodeTypes.patientOrder;
exports.chargeCodeTypes = chargeCodeTypes;

var billTypes = {
    invoice: 'BILLINGENUMS.BILLTYPEINVOICE',
    receipt: 'BILLINGENUMS.BILLTYPERECEIPT'
};
billTypes.default = billTypes.receipt;
exports.billTypes = billTypes;

var itemTypes = {
    orderItem: 'BILLINGENUMS.ITEMTYPEORDERITEM',
    orderSet: 'BILLINGENUMS.ITEMTYPEORDERSET'
};
itemTypes.default = itemTypes.orderItem;
exports.itemTypes = itemTypes;

var taxTypes = {
    input: 'BILLINGENUMS.TAXTYPEINPUT',
    output: 'BILLINGENUMS.TAXTYPEOUTPUT'
};
taxTypes.default = taxTypes.input;
exports.taxTypes = taxTypes;