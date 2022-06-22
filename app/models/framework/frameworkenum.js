var medicalHistoryType = {
    pastHistory: 'EMR.PASTHISTORY',
    familyHistory: 'EMR.FAMILYHISTORY',
    personalHistory: 'EMR.PERSONALHISTORY'
};
medicalHistoryType.default = medicalHistoryType.personalHistory;
exports.medicalHistoryType = medicalHistoryType;

var emrTabs = {
    freeText: 'COMMON.FREETEXT',
    previousData: 'COMMON.PREVIOUSDATA',
    search: 'COMMON.SEARCH',
    ticksheet: 'COMMON.TICKSHEET',
    favouriteTicksheet: 'COMMON.FAVOURITETICKSHEET',
    favouriteNote: 'COMMON.FAVOURITENOTE',
    template: 'COMMON.TEMPLATE',
    annotation: 'COMMON.ANNOTATION',
    form: 'COMMON.FORM',
};
emrTabs.default = emrTabs.freeText;
exports.emrTabs = emrTabs;

var batchjobs = {
    closeOpdVisits: 'BATCHJOB.CLOSEOPDVISITS',
    closeEpisodes: 'BATCHJOB.CLOSEEPISODES',
    closeAppointments: 'BATCHJOB.CLOSEAPPOINTMENTS',
    generateBedCharges: 'BATCHJOB.GENERATEBEDCHARGES',
    dailyBedOccupancy: 'BATCHJOB.DAILYBEDOCCUPANCY',
};
exports.batchjobs = batchjobs;

var jobruntypes = {
    daily: 'COMMON.DAILY',
    weekly: 'COMMON.WEEKLY'
};
exports.jobruntypes = jobruntypes;