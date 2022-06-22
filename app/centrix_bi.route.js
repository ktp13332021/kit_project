var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
// var md5 = require('md5');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;
// var insert = require('./insert');
// var Q = require('q');
// user: "incusdba",
// pass: "incus@123",
// var dbpath = 'mongodb://incusdba:incus%40123@192.168.9.22,192.168.9.23,192.168.9.24/arcusairdb?authMechanism=SCRAM-SHA-1&authSource=arcusairdb';
exports.visitcount = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.relatedvalue": "OPD"
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": { "$year": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$startdate", 420 * 60 * 1000] } }

                    },
                    "first": { "$min": "$startdate" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "visitdate": "$first",
                    "count": "$count"
                }
            },
            {
                "$sort": {
                    "visitdate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ opdvisithourcounts: docs });
            db.close();
        });
    });
}
exports.visithourcount = function (req, res) {
    var mongoose = require('mongoose')
    var visitdate = req.body.visitdate;
    var startof = moment(visitdate).startOf('day').toISOString();
    var endof = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",

                    "startdate": {
                        $gte: new Date(startof),
                        $lte: new Date(endof)
                    }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.relatedvalue": "OPD"
                }
            },
            {
                "$project": {
                    "startdate": 1
                }
            },
            {
                "$sort": {
                    "startdate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            docs = init(docs);
            res.status(200).json({ opdvisithourcounts: docs });

            db.close();
        });
    });
    function init(docs) {
        var results = [];
        var groupPeriod = [];
        docs.forEach(function (doc) {
            var hour = parseInt(moment(doc.startdate).format('HH'));
            var minute = parseInt(moment(doc.startdate).format('mm'));
            groupPeriod.push({
                startdate: doc.startdate,
                period: hour + "-" + (hour + 1)
            });
        }, this);
        var sumcount = 0;
        var groupPeriod = _.groupBy(groupPeriod, function (result) { return result.period; });
        if (groupPeriod) {
            Object.keys(groupPeriod).forEach(function (period) {
                results.push({
                    period: period,
                    count: groupPeriod[period].length
                });
                sumcount += groupPeriod[period].length;
            });
        }
        // console.log(sumcount);
        return results;
    }
}
exports.ward = function (req, res) {
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "enddate": { $eq: null }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "entypeuid"
                }
            },
            { "$unwind": "$entypeuid" },
            {
                "$match": {
                    "entypeuid.valuecode": "ENTYPE2"
                }
            },
            { "$unwind": "$bedoccupancy" },
            {
                "$lookup": {
                    "from": "wards",
                    "localField": "bedoccupancy.warduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.warduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.warduid"
            },
            {
                "$match": {
                    $and: [
                        { "bedoccupancy.isactive": true },
                        { "bedoccupancy.enddate": null }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": "beds",
                    "localField": "bedoccupancy.beduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.beduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.beduid"
            },
            {
                "$match":
                    { "bedoccupancy.beduid.bedcategoryuid": { $ne: mongoose.Types.ObjectId("57f4aa78e311c733215e6580") } },

            },
            {
                "$match": {
                    $or: [
                        { "bedoccupancy.beduid.activeto": null },
                        { "bedoccupancy.beduid.activeto": { $gte: new Date() } }
                    ]
                }
            },
            {
                "$group": {
                    "_id": { warduid: "$bedoccupancy.warduid._id", "ward": "$bedoccupancy.warduid.name" },
                    "count": { $sum: 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "ward": "$_id.ward",
                    "count": "$count"
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
        });
    });
}
exports.warddetail = function (req, res) {
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("beds").aggregate([
            {
                "$match": {
                    // "bedcategoryuid": { "$ne":ObjectId("57f4aa78e311c733215e6580") },
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    "bedcategoryuid": { "$ne": mongoose.Types.ObjectId("57f4aa78e311c733215e6580") },
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",

                    $or: [
                        { activeto: null },
                        { activeto: { $gte: new Date() } }
                    ],
                }
            },
            {
                "$group": {
                    "_id": { warduid: "$warduid" },
                    "warduid": { "$first": "$warduid" },
                    "count": { $sum: 1 }
                }
            },
            {
                "$lookup": {
                    "from": "wards",
                    "localField": "warduid",
                    "foreignField": "_id",
                    "as": "ward"
                }
            },
            {
                "$unwind": "$ward"
            },
            {
                $project: {
                    wardname: "$ward.name",
                    wardcode: "$ward.code",
                    warddesc: "$ward.description",
                    bedcount: "$count",
                    displayorder: "$ward.displayorder",
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.departmentcount = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$unwind": "$department"
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.valuedescription": "Outpatient"
                }
            },
            {
                "$group": {
                    "_id": {
                        "department": "$department.name",
                        "year": { "$year": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$startdate", 420 * 60 * 1000] } }
                    },
                    "first": { "$min": "$startdate" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "department": "$_id.department",
                    "visitdate": "$first",
                    "count": "$count"
                }
            },
            {
                "$sort": {
                    "visitdate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ opddepartmentcounts: docs });
            db.close();
        });
    });
}
exports.find_site = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("organisations").aggregate([
            {
                "$match": {
                    "_id": mongoose.Types.ObjectId(req.body.orguid),
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
exports.revenuesplit = function (req, res) {
    res.setTimeout(0);
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').startOf('month').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientbills").aggregate([
            {
                $match: {
                    "orguid": mongoose.Types.ObjectId(orguid),
                    statusflag: 'A',
                    iscancelled: { $ne: true },
                    isrefund: false,
                    billdate: {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate),
                    }
                }
            },
            { $lookup: { from: "patientvisits", foreignField: "_id", localField: "patientvisituid", as: "patientvisituid" } },
            { $unwind: { path: '$patientvisituid', preserveNullAndEmptyArrays: true } },

            { $lookup: { from: "payors", foreignField: "_id", localField: "patientvisituid.visitpayors.payoruid", as: "payoruid" } },

            { $lookup: { from: "referencevalues", foreignField: "_id", localField: "patientvisituid.entypeuid", as: "patientvisituid.entypeuid" } },
            { $unwind: { path: '$patientvisituid.entypeuid', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$patientvisituid.entypeuid.relatedvalue",
                    "patientbills": { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    "patientbills": {
                        billdate: 1,
                        totalbillamount: 1,
                        patientvisituid: { visitpayors: { orderofpreference: 1, payoruid: 1 } },
                        payoruid: { _id: 1, code: 1, name: 1 },
                        patientuid: 1
                    }
                }
            }
        ], { allowDiskUse: true }).toArray((err, docs) => {
            console.log(docs);
            var result = init(docs);
            res.status(200).json({ revenue: result });
            db.close();
        });
    });
    function init(docs) {
        var result = {};
        docs.forEach(function (doc) {
            var type = doc._id.toLowerCase();
            result[type] = [];

            var groupDate = _.groupBy(doc.patientbills, function (item) { return moment(item.billdate).utcOffset(420).format("YYYY-MM-DD") });
            Object.keys(groupDate).forEach(function (key) {
                var group = groupDate[key];

                var revenue = {};
                revenue.revenuedate = _.min(group.map(function (g) { return moment(g.billdate); }));
                // revenue.patientuc = 0;
                // revenue.patientnonuc = 0;
                // revenue.revenueuc = 0;
                // revenue.revenuenonuc = 0;
                revenue.revenuetotal = 0;
                var patientall = [];
                // var patientuclist = [];
                // var patientnonuclist = [];
                group.forEach(function (patientbill) {

                    revenue.revenuetotal += patientbill.totalbillamount;

                    // var primaryPayor = null;
                    // if (patientbill.patientvisituid && patientbill.patientvisituid.visitpayors && patientbill.patientvisituid.visitpayors.length > 0) {
                    //     var sortPayors = _.sortBy(patientbill.patientvisituid.visitpayors, function (s) { return s.orderofpreference; });
                    //     if (sortPayors && sortPayors.length > 0) {
                    //         primaryPayor = sortPayors[0];
                    //     }
                    // }
                    // if (primaryPayor && patientbill.payoruid && patientbill.payoruid.length > 0) {
                    //     var payor = patientbill.payoruid.find(function (payor) { return payor._id.toJSON() == primaryPayor.payoruid.toJSON(); });
                    //     if ((req.session.ucpayors || []).includes(payor.code)) {
                    //         patientuclist.push(patientbill.patientuid.toJSON());
                    //         revenue.revenueuc += patientbill.totalbillamount;
                    //     } else {
                    //         patientnonuclist.push(patientbill.patientuid.toJSON());
                    //         revenue.revenuenonuc += patientbill.totalbillamount;
                    //     }
                    // }
                });

                // revenue.patientuc = patientuclist.length;
                // revenue.patientnonuc = patientnonuclist.length;
                // revenue.total = revenue.revenueuc + revenue.revenuenonuc;
                result[type].push(revenue);
            }, this);


        }, this);
        return result;
    }
}
exports.opddaily = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').startOf('month').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.relatedvalue": "OPD"
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": { "$year": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$startdate", 420 * 60 * 1000] } }

                    },
                    "first": { "$min": "$startdate" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "visitdate": "$first",
                    "count": "$count"
                }
            },
            {
                "$sort": {
                    "visitdate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ opdcase: docs });
            db.close();
        });
    });
}
exports.admissioncount = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').startOf('month').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.valuecode": "ENTYPE2"
                }
            },
            // { "$lookup": { from: "payors", foreignField: "_id", localField: "visitpayors.payoruid", as: "visitpayors.payoruid" } },
            {
                "$group": {
                    "_id": {
                        "year": { "$year": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$startdate", 420 * 60 * 1000] } }
                    },
                    // "visitpayors": { "$push": "$visitpayors" },
                    "first": { "$min": "$startdate" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    // "visitpayors": { payoruid: { code: 1, name: 1 } },
                    "visitdate": "$first",
                    "admitcount": "$count"
                }
            },
            {
                "$sort": {
                    "visitdate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            // docs = init(docs);
            res.status(200).json({ admissioncount: docs });
            db.close();
        });
    });

}
exports.dischargecount = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').startOf('month').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("dischargeprocesses").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "dischargestage": 4,
                    "planneddischargedate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            { "$lookup": { from: "patientvisits", foreignField: "_id", localField: "patientvisituid", as: "patientvisituid" } },
            { "$unwind": { path: '$patientvisituid', preserveNullAndEmptyArrays: true } },

            // { "$lookup": { from: "payors", foreignField: "_id", localField: "patientvisituid.visitpayors.payoruid", as: "visitpayors.payoruid" } },
            {
                "$group": {
                    "_id": {
                        "year": { "$year": [{ "$add": ["$planneddischargedate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$planneddischargedate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$planneddischargedate", 420 * 60 * 1000] } }
                    },
                    // "visitpayors": { "$push": "$visitpayors" },
                    "first": { "$min": "$planneddischargedate" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    // "visitpayors": { payoruid: { code: 1, name: 1 } },
                    "dischargedate": "$first",
                    "dischargecount": "$count"
                }
            },
            {
                "$sort": {
                    "planneddischargedate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            // docs = init(docs);
            res.status(200).json({ dischargecount: docs });
            db.close();
        });
    });

}
exports.findbedoccupancy = function (req, res) {
    var fromdate = moment(req.body.mdate).startOf('day').startOf('month').toISOString();
    var todate = moment(req.body.mdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("dailybedoccupancies").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "dateofoccupancy": {
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
exports.compare_opd = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').startOf('month').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": 'A',
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$lookup": {
                    "from": "payors",
                    "localField": "visitpayors.payoruid",
                    "foreignField": "_id",
                    "as": "payor"
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "entypeuid"
                }
            },

            {
                "$group": {
                    "_id": {
                        "year": { "$year": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$startdate", 420 * 60 * 1000] } }
                    },
                    "first": { "$min": "$startdate" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "visitdate": "$first",
                    "total": "$count"
                }
            },
            {
                "$sort": {
                    "visitdate": 1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ opd_daily: docs });
            db.close();
        });
    })
}
