var nodejsUtils = require('util');

var allocatePolicy = {
    fifo: 'INVENTORIES.FIFOALLOCATEPOLICY',
    fefo: 'INVENTORIES.FEFOALLOCATEPOLICY'
};
allocatePolicy.default = allocatePolicy.fifo;
exports.allocatePolicy = allocatePolicy;

var restrictStoreFunctions = {
    purchaseOrder: 'INVENTORIES.PURCHASEORDER',
    purchaseReq: 'INVENTORIES.PURCHASEREQ',
    goodsReceive: 'INVENTORIES.GOODSRECEIVE',
    stockReq: 'INVENTORIES.STOCKREQ',
    stockTransfer: 'INVENTORIES.STOCKTRANSFER',
    stockDispense: 'INVENTORIES.STOCKDISPENSE',
    vendorReturn: 'INVENTORIES.VENDORRETURN'
};
exports.restrictStoreFunctions = restrictStoreFunctions;

var ledgerTransactionType = {
    goodsReceive: 'INVENTORIES.GOODSRECEIVE',
    transferOut: 'INVENTORIES.TRANSFEROUT',
    transferIn: 'INVENTORIES.TRANSFERIN',
    cancelTransfer: 'INVENTORIES.CANCELTRANSFER',
    stockIssue: 'INVENTORIES.STOCKISSUE',
    stockDispense: 'INVENTORIES.STOCKDISPENSE',
    IPFill: 'PHARMACYMASTER.IPFILL',
    vendorReturn: 'INVENTORIES.VENDORRETURN',
    stockAdjust: 'INVENTORIES.STOCKADJUST',
    dispenseReturn: 'COMMON.DISPENSERETURN',
    manufacturing: 'INVENTORIES.MANUFACTURING',
    repacking: 'INVENTORIES.REPACKING',
    manufacturingRepacking: 'INVENTORIES.MANUFACUTINGREPACKING',
    adjustData: 'INVENTORIES.ADJUSTDATA',
    cancelDispense: 'PHARMACYMASTER.CANCELDISPENSE'
};
exports.ledgerTransactionType = ledgerTransactionType;

var stockRequestTypes = {
    transfer: 'COMMON.TRANSFER',
    issue: 'COMMON.ISSUE'
};
stockRequestTypes.default = stockRequestTypes.transfer;
exports.stockRequestTypes = stockRequestTypes;

//Copy the values from ledgerTransactionType, to avoid code duplication.
var manufacturingTypes = {
    manufacturing: (nodejsUtils._extend({}, {
        dummy: ledgerTransactionType.manufacturing
    })).dummy,
    repacking: (nodejsUtils._extend({}, {
        dummy: ledgerTransactionType.repacking
    })).dummy,
    manufacturingrepacking: (nodejsUtils._extend({}, {
        dummy: ledgerTransactionType.manufacturingRepacking
    })).dummy
};
exports.manufacturingTypes = manufacturingTypes;
