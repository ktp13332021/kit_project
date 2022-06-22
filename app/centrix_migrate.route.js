var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var moment = require("moment");
var mongoose = require("mongoose");
var async = require("async");
// var md5 = require('md5');
var _ = require("underscore");
var dbpath = require("../config/db").dbpath;

exports.list_notetypeuid = function (req, res) {
    MongoClient.connect(dbpath, function (err, db) {
        var dbo = db;
        dbo
            .collection("referencevalues")
            .aggregate([
                {
                    $match: {
                        // "orguid": mongoose.Types.ObjectId(req.body.orguid),
                        statusflag: "A",
                        domaincode: "FORMTY",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        valuedescription: 1,
                    },
                },
            ])
            .toArray((err, docs) => {
                if (docs && docs.length > 0) {
                    console.log(docs);

                    res.status(200).json({
                        data: docs,
                    });
                    dbo.close();
                } else {
                    res.status(200).json({
                        data: [],
                    });
                    console.log("nodata");
                }
            });
    });
};
exports.list_dbdetail = function (req, res) {
    var mfile = req.body.mfile;
    // const databasename = "centrixdb_demo";

    MongoClient.connect(dbpath, function (err, db) {
        var dbo = db;
        // MongoClient.connect(dbpath, (connectErr, db) => {
        //     var dbo = db;
        dbo
            .collection(mfile)
            .aggregate([
                {
                    $match: {
                        orguid: mongoose.Types.ObjectId(req.body.orguid),
                        statusflag: "A",
                    },
                },
                {
                    $unwind: {
                        path: "$cchpilist",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "cchpimasters",
                        localField: "cchpilist.cchpimasteruid",
                        foreignField: "_id",
                        as: "cchpimasteruid",
                    },
                },
                {
                    $unwind: {
                        path: "$cchpimasteruid",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        cchpilist: "$cchpilist.chiefcomplaint",
                        cchpilist2: "$cchpimasteruid.name",
                        code: 1,
                        name: 1,
                        useruid: 1,
                    },
                },
            ])
            .toArray((err, docs) => {
                if (docs && docs.length > 0) {
                    console.log(docs);
                    var ret = [];
                    for (i = 0; i < docs.length; i++) {
                        console.log(docs[i].ReferralDate);
                        if (docs[i].cchpilist) {
                            var mcchpi = docs[i].cchpilist;
                        } else {
                            var mcchpi = docs[i].cchpilist2;
                        }
                        ret.push({
                            cchpi: mcchpi,
                            code: docs[i].code,
                            name: docs[i].name,
                            useruid: docs[i].useruid,
                        });
                    }

                    console.log(ret);
                    res.status(200).json({
                        data: ret,
                    });
                    dbo.close();
                } else {
                    res.status(200).json({
                        data: [],
                    });
                    console.log("nodata");
                }
                // console.log(docs);
                // res.status(200).json({
                //     data: docs
                // });
                // dbo.close();
            });
    });
};
exports.save_cchpi = function (req, res) {
    var mfile = req.body.mfile;
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo
                .collection(mfile)
                .find({
                    useruid: mongoose.Types.ObjectId(req.body.useruid),
                })
                .toArray((err, docs) => {
                    if (docs.length == 0) {
                        // if (doc && doc.length > 0) {
                        var newitem = {};

                        var newcchpilist = [];
                        var array = req.body.cchpilist;
                        for (let index = 0; index < array.length; index++) {
                            const m_cchpilist = array[index].chiefcomplaint;
                            newcchpilist.push({
                                chiefcomplaint: m_cchpilist,
                                _id: ObjectId(),
                            });
                        }
                        newitem.cchpilist = newcchpilist;
                        newitem.code = req.body.code;
                        newitem.name = req.body.name;
                        newitem.orguid = mongoose.Types.ObjectId(req.body.orguid);
                        newitem.useruid = mongoose.Types.ObjectId(req.body.useruid);
                        newitem.createdby = mongoose.Types.ObjectId(req.body.useruid);
                        newitem.modifiedby = mongoose.Types.ObjectId(req.body.useruid);
                        newitem.createdat = new Date();
                        newitem.modifiedat = new Date();
                        newitem.statusflag = "A";
                        newitem.__v = 0;
                        dbo.collection(mfile).save(newitem, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({
                                    va: newitem,
                                });
                            } else {
                                res.status(500).json({
                                    error: "ERRORS.CREATEERROR",
                                });
                            }
                        });
                    } else {
                        var doc = docs[0];
                        var ID = doc._id;
                        var newitem = doc;
                        var newcchpilist = newitem.cchpilist;
                        var array = req.body.cchpilist;
                        for (let index = 0; index < array.length; index++) {
                            const m_cchpilist = array[index].chiefcomplaint;
                            newcchpilist.push({
                                chiefcomplaint: m_cchpilist,
                                _id: ObjectId(),
                            });
                        }
                        newitem.modifiedby = req.body.useruid;
                        newitem.modifiedat = new Date();
                        newitem.cchpilist = newcchpilist;
                        dbo.collection(mfile).update(
                            {
                                _id: ID,
                            },
                            newitem,
                            function (Innererr) {
                                if (!Innererr) {
                                    res.status(200).json({
                                        va: newitem,
                                    });
                                } else {
                                    res.status(500).json({
                                        error: "ERRORS.CREATEERROR",
                                    });
                                }
                            }
                        );
                    }
                });
        } else {
            res.status(500).json({
                error: "ERRORS.CODEINUSE",
            });
        }
    });
};
exports.find_lastcode = function (req, res) {
    MongoClient.connect(dbpath, function (err, db) {
        var dbo = db;
        dbo
            .collection("favouritenotes")
            .aggregate([
                {
                    $match: {
                        // "orguid": mongoose.Types.ObjectId(req.body.orguid),
                        statusflag: "A",
                    },
                },
                {
                    $lookup: {
                        from: "referencevalues",
                        localField: "notetypeuid",
                        foreignField: "_id",
                        as: "notetypeuid",
                    },
                },
                { $unwind: { path: "$notetypeuid", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        // "notetypeuid": "$notetypeuid._id",
                        notetype: "$notetypeuid.valuedescription",
                        code: 1,
                        name: 1,
                    },
                },
                {
                    $addFields: {
                        codeint: { $toInt: "$code" },
                    },
                },
                {
                    $sort: {
                        codeint: -1,
                    },
                },
            ])
            .toArray((err, docs) => {
                if (docs && docs.length > 0) {
                    console.log(docs);

                    res.status(200).json({
                        data: docs,
                    });
                    dbo.close();
                } else {
                    res.status(200).json({
                        data: [],
                    });
                    console.log("nodata");
                }
            });
    });
};
exports.save_note = function (req, res) {
    var mfile = req.body.mfile;
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            var newitem = {};
            newitem.notetext = req.body.notetext;
            newitem.notetypeuid =mongoose.Types.ObjectId(req.body.notetypeuid); 
            newitem.code = req.body.code;
            newitem.name = req.body.name;
            newitem.orguid = mongoose.Types.ObjectId(req.body.orguid);
            newitem.useruid = mongoose.Types.ObjectId(req.body.useruid);
            newitem.createdby = mongoose.Types.ObjectId(req.body.useruid);
            newitem.modifiedby = mongoose.Types.ObjectId(req.body.useruid);
            newitem.createdat = new Date();
            newitem.modifiedat = new Date();
            newitem.statusflag = "A";
            newitem.__v = 0;
            dbo.collection(mfile).save(newitem, function (Innererr) {
                if (!Innererr) {
                    res.status(200).json({
                        va: newitem,
                    });
                } else {
                    res.status(500).json({
                        error: "ERRORS.CREATEERROR",
                    });
                }
            });
        } else {
            res.status(500).json({
                error: "ERRORS.CODEINUSE",
            });
        }
    });
};

