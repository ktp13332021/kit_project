var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var md5 = require('md5');
var dbpath = require('../config/db').dbpath;
exports.search_hn = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {


        if (req.body.choice == 1) {
            var matchpt = {
                "statusflag": "A",
                "mrn": req.body.params,
            }
        } else if (req.body.choice == 2) {
            var matchpt = {
                "statusflag": "A",
                "_id": mongoose.Types.ObjectId(req.body.params),
            }
        // } else if (req.body.choice == 3) {
        //     var matchpt = {
        //         "statusflag": "A",
        //         "mrn": req.body.hn,
        //     }
        } else {
        }
        var dbo = db;
        dbo.collection("patients").aggregate([
            // {
            //     "$match": {
            //         // "orguid": mongoose.Types.ObjectId(req.body.orguid),
            //         "statusflag": "A",
            //         "mrn": req.body.hn,
            //     }
            // },
            { $match: matchpt },
            { $lookup: { from: 'referencevalues', localField: 'titleuid', foreignField: '_id', as: 'patienttitle' } },
            { $unwind: { path: '$patienttitle', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'referencevalues', localField: 'genderuid', foreignField: '_id', as: 'genderuid' } },
            { $lookup: { from: "patientimages", foreignField: "_id", localField: "patientimageuid", as: "patientimageuid" } },
            { $lookup: { from: 'patientvisits', localField: '_id', foreignField: 'patientuid', as: 'patientvisituid' } },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.search_patientuid = function (req, res) {
    
    MongoClient.connect( dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "_id": mongoose.Types.ObjectId(req.body.params),
                    "statusflag": "A",
                }
            },
            ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.search_referencevalues = function (req, res) {
    
    MongoClient.connect( dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("referencevalues").aggregate([
            {
                "$match": {
                    "_id": mongoose.Types.ObjectId(req.body.params),
                    "statusflag": "A",
                    "activeto" : null,
                }
            },
            ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.search_referencevalues_domain = function (req, res) {
    
    MongoClient.connect( dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("referencevalues").aggregate([
            {
                "$match": {
                    "domaincode" : req.body.params,
                    "statusflag": "A",
                    "activeto" : null,
                }
            },
            ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.search_user = function (req, res) {
    
    MongoClient.connect( dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([
            {
                "$match": {
                    "_id": mongoose.Types.ObjectId(req.body.params),
                    "statusflag": "A",
                }
            },
            ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.search_orgall = function (req, res) {
    
    MongoClient.connect( dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection(req.body.mfile).aggregate([
            {
                "$match": {
                    // "_id": mongoose.Types.ObjectId(req.body.params),
                    "statusflag": "A",
                }
            },
            ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.search_org = function (req, res) {
    
    MongoClient.connect( dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection(req.body.mfile).aggregate([
            {
                "$match": {
                    "_id": mongoose.Types.ObjectId(req.body.params),
                    "statusflag": "A",
                }
            },
            ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}

