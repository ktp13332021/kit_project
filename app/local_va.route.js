var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var dbpath = require('../config/db').dbpath;
exports.saveva = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_VA").find(
                {
                    patientuid : req.body.patientuid,
                    patientvisituid : req.body.patientvisituid,
                }).toArray((err, docs) => {
                    if (docs.length == 0) {
                        var newva = {};
                        newva.HN = req.body.HN;
                        newva.name = req.body.name;
                        newva.orguid = req.body.orguid;
                        newva.patientuid = req.body.patientuid;
                        newva.patientvisituid = req.body.patientvisituid;
                        newva.recdate = new Date();
                        newva.vare = req.body.vare;
                        newva.vale = req.body.vale;
                        newva.vareg = req.body.vareg;
                        newva.valeg = req.body.valeg;
                        newva.varep = req.body.varep;
                        newva.valep = req.body.valep;
                        newva.va_r = req.body.va_r;
                        newva.va_l = req.body.va_l;
                        dbo.collection("plugin_VA").save(newva, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({ va: newva });
                            } else {
                                res.status(500).json({ error: 'ERRORS.CREATEERROR' });
                            }
                        });

                    } else {
                        var doc = docs[0];
                        var ID = doc._id;
                        var newva = doc;
                        newva.HN = req.body.HN;
                        newva.name = req.body.name;
                        newva.orguid = req.body.orguid;
                        newva.patientuid = req.body.patientuid;
                        newva.patientvisituid = req.body.patientvisituid;
                        newva.recdate = new Date();
                        newva.vare = req.body.vare;
                        newva.vale = req.body.vale;
                        newva.vareg = req.body.vareg;
                        newva.valeg = req.body.valeg;
                        newva.varep = req.body.varep;
                        newva.valep = req.body.valep;
                        newva.va_r = req.body.va_r;
                        newva.va_l = req.body.va_l;
                        dbo.collection("plugin_VA").update({
                            _id: ID,
                        }, newva, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({ va: newva });
                            } else {
                                res.status(500).json({ error: 'ERRORS.CREATEERROR' });
                            }
                        });
                      
                    }

                });
        } else {
            res.status(500).json({ error: 'ERRORS.CODEINUSE' });
        }
    });
}
exports.findva = function (req, res) {
    var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_VA").aggregate([
            {
                "$match": {
                    "orguid": req.body.orguid,
                    "recdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.savetn = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_TN").find(
                {
                    patientuid : req.body.patientuid,
                    patientvisituid : req.body.patientvisituid,
                }).toArray((err, docs) => {
                    if (docs.length == 0) {
                        var newtn = {};
                        newtn.HN = req.body.HN;
                        newtn.name = req.body.name;
                        newtn.orguid = req.body.orguid;
                        newtn.patientuid = req.body.patientuid;
                        newtn.patientvisituid = req.body.patientvisituid;
                        newtn.recdate = new Date();
                        newtn.tnre = req.body.tnre;
                        newtn.tnle = req.body.tnle;
                        newtn.tntextre = req.body.tntextre;
                        newtn.tntextle = req.body.tntextle;

                        dbo.collection("plugin_TN").save(newtn, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({ tn: newtn });
                            } else {
                                res.status(500).json({ error: 'ERRORS.CREATEERROR' });
                            }
                        });

                    } else {
                          var doc = docs[0];
                        var ID = doc._id;
                        var newtn = doc;
                        newtn.HN = req.body.HN;
                        newtn.name = req.body.name;
                        newtn.orguid = req.body.orguid;
                        newtn.patientuid = req.body.patientuid;
                        newtn.patientvisituid = req.body.patientvisituid;
                        newtn.recdate = new Date();
                        newtn.tnre = req.body.tnre;
                        newtn.tnle = req.body.tnle;
                        newtn.tntextre = req.body.tntextre;
                        newtn.tntextle = req.body.tntextle;
                        dbo.collection("plugin_TN").update({
                            _id: ID,
                        }, newtn, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({ tn: newtn });
                            } else {
                                res.status(500).json({ error: 'ERRORS.CREATEERROR' });
                            }
                        });
                    }

                });
        } else {
            res.status(500).json({ error: 'ERRORS.CODEINUSE' });
        }
    });
}
exports.findtn = function (req, res) {
    var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_TN").aggregate([
            {
                "$match": {
                    "orguid": req.body.orguid,
                    "recdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.findva_byvisit = function (req, res) {
    var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_VA").aggregate([
            {
                "$match": {
                    "patientvisituid": req.body.patientvisituid,
                    "orguid": req.body.orguid,
                    "recdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.findva_byvisitall = function (req, res) {
    // var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    // var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_VA").aggregate([
            {
                "$match": {
                    "patientvisituid": req.body.patientvisituid,
                    "orguid": req.body.orguid,
                    // "recdate": {
                    //     $gte: new Date(fromdate),
                    //     $lte: new Date(todate)
                    // }
                }
            },
           
        ]).limit(1).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.findtn_byvisit = function (req, res) {
    var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_TN").aggregate([
            {
                "$match": {
                    "patientvisituid": req.body.patientvisituid,
                    "orguid": req.body.orguid,
                    "recdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.findtn_byvisitall = function (req, res) {
    // var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    // var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_TN").aggregate([
            {
                "$match": {
                    "patientvisituid": req.body.patientvisituid,
                    "orguid": req.body.orguid,
                    // "recdate": {
                    //     $gte: new Date(fromdate),
                    //     $lte: new Date(todate)
                    // }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.findva_byhn = function (req, res) {
    // var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    // var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_VA").aggregate([
            {
                "$match": {
                    "patientuid": req.body.patientuid,
                    "orguid": req.body.orguid,
                    // "recdate": {
                    //     $gte: new Date(fromdate),
                    //     $lte: new Date(todate)
                    // }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.findtn_byhn = function (req, res) {
    var fromdate = moment(req.body.visitdate).startOf('day').toISOString();
    var todate = moment(req.body.visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_TN").aggregate([
            {
                "$match": {
                    "patientuid": req.body.patientuid,
                    "orguid": req.body.orguid,
                    // "recdate": {
                    //     $gte: new Date(fromdate),
                    //     $lte: new Date(todate)
                    // }
                }
            },
           
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}