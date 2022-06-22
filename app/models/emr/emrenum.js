var auditstatus = {
    CREATED: 'COMMON.CREATED',
    UPDATED: 'COMMON.UPDATED',
    DELETED: 'COMMON.DELETED'
};
exports.auditstatus = auditstatus;

var auditstatusenum = [];
for (var i in auditstatus) {
    auditstatusenum.push(auditstatus[i]);
}

exports.auditstatusenum = auditstatusenum;