// var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectId;
// var moment = require('moment');
// var mongoose = require('mongoose');
// var async = require('async');
// var _ = require('underscore');
var dbpath = require('../config/db').dbpath;
var DoctorNote = require('../app/models/emr/doctornote.js');
// var PatientVisit = require('../app/models/patient/patientvisit');
var emrenum = require('../app/models/emr/emrenum.js');

var auditlog = require('../app/models/framework/auditlog.js');

exports.createorupdate = function(req, res) {
    var newauditlog = {
        useruid: req.body.useruid,
        modifiedat: Date.now(),
    };

    var newDoctorNote = {};
    newDoctorNote.notetext = req.body.notetext;
    newDoctorNote.modifiedby = req.body.useruid;
    newDoctorNote.modifiedat = Date.now();

    var query = {
        patientuid: req.body.patientuid,
        patientvisituid: req.body.patientvisituid,
        orguid: req.body.orguid,
        statusflag: 'A'
    };

    if (req.body.departmentuid && !req.body.commonForAllDept)
        query.departmentuid = req.body.departmentuid;
    else
        newDoctorNote.departmentuid = req.body.departmentuid;

    if (req.body.careprovideruid && req.body.CPbasedsearch === true) {
        query.careprovideruid = req.body.careprovideruid;
    }

    if (req.body.careprovideruid && req.body.iscareprovider === true) {
        query.careprovideruid = req.body.careprovideruid;
    }

    if (req.body.updatebyuid) {
        query._id = req.body.updatebyuid;
    }

    if (req.body.careprovideruid) {
        newDoctorNote.careprovideruid = req.body.careprovideruid;
    }

    DoctorNote.findOneAndUpdate(query, newDoctorNote, {
        upsert: true,
        new: true
    }, function(err, docs) {
        if (err) {
            return res.status(500).json({ error: 'ERRORS.CREATEERROR' });
        }

        if (!docs.createdby || !docs.createdat) {
            // new record so need to update createdby and createdat
            docs.createdby = req.body.useruid;
            docs.createdat = Date.now();
        }

        if (!docs.auditlog || !docs.auditlog.length) {
            newauditlog.status = emrenum.auditstatus.CREATED;
        } else {
            newauditlog.status = emrenum.auditstatus.UPDATED;
        }

        docs.auditlog.push(newauditlog);
        updateaudit(docs, req, res);
        // auditlog.logaudit(req, docs.patientuid, 'DoctorNote', docs._id, null, docs);
    });
}

function updateaudit(doc, req, res) {
    doc.save(function(err) {
        if (!err) {
            // getdetail(req, res, doc._id);
        } else {
            res.status(500).json({ error: 'ERRORS.CREATEERROR' });
        }
    });
}