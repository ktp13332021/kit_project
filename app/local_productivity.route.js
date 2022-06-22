var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;
exports.savepro = function (req, res) {
    console.log(req.body.date);
    var fromdate = moment(req.body.date).startOf('day').toISOString();
    var todate = moment(req.body.date).endOf('day').toISOString();
    console.log(fromdate);
    console.log(todate);
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_productivity").find({
                "recdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                },
                "statusflag": "A",
                "depuid" : req.body.depuid,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    var newsetup = {};
                    newsetup.depuid = req.body.depuid;
                    newsetup.department = req.body.department;
                    newsetup.recdate = new Date(req.body.date);
                    newsetup.orguid = req.body.orguid;
                    newsetup.a_m = req.body.a_m;
                    newsetup.b_m = req.body.b_m;
                    newsetup.c_m = req.body.c_m;
                    newsetup.d_m = req.body.d_m;
                    newsetup.e_m = req.body.e_m;
                    newsetup.rn_m = req.body.rn_m;
                    newsetup.pn_m = req.body.pn_m;
                    newsetup.na_m = req.body.na_m;
                    newsetup.a_e = req.body.a_e;
                    newsetup.b_e = req.body.b_e;
                    newsetup.c_e = req.body.c_e;
                    newsetup.d_e = req.body.d_e;
                    newsetup.e_e = req.body.e_e;
                    newsetup.rn_e = req.body.rn_e;
                    newsetup.pn_e = req.body.pn_e;
                    newsetup.na_e = req.body.na_e;
                    newsetup.a_n = req.body.a_n;
                    newsetup.b_n = req.body.b_n;
                    newsetup.c_n = req.body.c_n;
                    newsetup.d_n = req.body.d_n;
                    newsetup.e_n = req.body.e_n;
                    newsetup.rn_n = req.body.rn_n;
                    newsetup.pn_n = req.body.pn_n;
                    newsetup.na_n = req.body.na_n;
                    newsetup.cal_1 = req.body.cal_1;
                    newsetup.cal_2 = req.body.cal_2;
                    newsetup.cal_3 = req.body.cal_3;
                    newsetup.cal_4 = req.body.cal_4;
                    newsetup.cal_5 = req.body.cal_5;
                    newsetup.pt_m = req.body.pt_m;
                    newsetup.pt_e = req.body.pt_e;
                    newsetup.pt_n = req.body.pt_n;
                    newsetup.staff_m = req.body.staff_m;
                    newsetup.staff_e = req.body.staff_e;
                    newsetup.staff_n = req.body.staff_n;
                    newsetup.pro_m = req.body.pro_m;
                    newsetup.pro_e = req.body.pro_e;
                    newsetup.pro_n = req.body.pro_n;
                    newsetup.pro_ex = req.body.pro_ex;
                    newsetup.productivity = req.body.productivity;
                    newsetup.statusflag = "A";
                    dbo.collection("plugin_productivity").save(newsetup, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                pro: newsetup
                            });
                        } else {
                            res.status(500).json({
                                error: 'ERRORS.CREATEERROR'
                            });
                        }
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var newsetup = doc;
                    newsetup.depuid = req.body.depuid;
                    newsetup.department = req.body.department;
                    newsetup.recdate = new Date(req.body.date);
                    newsetup.orguid = req.body.orguid;
                    newsetup.a_m = req.body.a_m;
                    newsetup.b_m = req.body.b_m;
                    newsetup.c_m = req.body.c_m;
                    newsetup.d_m = req.body.d_m;
                    newsetup.e_m = req.body.e_m;
                    newsetup.rn_m = req.body.rn_m;
                    newsetup.pn_m = req.body.pn_m;
                    newsetup.na_m = req.body.na_m;
                    newsetup.a_e = req.body.a_e;
                    newsetup.b_e = req.body.b_e;
                    newsetup.c_e = req.body.c_e;
                    newsetup.d_e = req.body.d_e;
                    newsetup.e_e = req.body.e_e;
                    newsetup.rn_e = req.body.rn_e;
                    newsetup.pn_e = req.body.pn_e;
                    newsetup.na_e = req.body.na_e;
                    newsetup.a_n = req.body.a_n;
                    newsetup.b_n = req.body.b_n;
                    newsetup.c_n = req.body.c_n;
                    newsetup.d_n = req.body.d_n;
                    newsetup.e_n = req.body.e_n;
                    newsetup.rn_n = req.body.rn_n;
                    newsetup.pn_n = req.body.pn_n;
                    newsetup.na_n = req.body.na_n;
                    newsetup.cal_1 = req.body.cal_1;
                    newsetup.cal_2 = req.body.cal_2;
                    newsetup.cal_3 = req.body.cal_3;
                    newsetup.cal_4 = req.body.cal_4;
                    newsetup.cal_5 = req.body.cal_5;
                    newsetup.pt_m = req.body.pt_m;
                    newsetup.pt_e = req.body.pt_e;
                    newsetup.pt_n = req.body.pt_n;
                    newsetup.staff_m = req.body.staff_m;
                    newsetup.staff_e = req.body.staff_e;
                    newsetup.staff_n = req.body.staff_n;
                    newsetup.pro_m = req.body.pro_m;
                    newsetup.pro_e = req.body.pro_e;
                    newsetup.pro_n = req.body.pro_n;
                    newsetup.pro_ex = req.body.pro_ex;
                    newsetup.productivity = req.body.productivity;
                    newsetup.statusflag = "A";
                    dbo.collection("plugin_productivity").update({
                        _id: mongoose.Types.ObjectId(ID),
                    }, newsetup, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                pro: newsetup
                            });
                        } else {
                            res.status(500).json({
                                error: 'ERRORS.CREATEERROR'
                            });
                        }
                    });

                }

            });
        } else {
            res.status(500).json({
                error: 'ERRORS.CODEINUSE'
            });
        }
    });
}
exports.findpro = function (req, res) {
    var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    var todate = moment(req.body.todate).endOf('day').toISOString();
    console.log(fromdate);
    console.log(todate);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_productivity").aggregate([{
                "$match": {
                    "depuid": req.body.depuid,
                    "statusflag": "A",
                    "recdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$sort": {
                    "recdate": 1
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.deletepro = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_productivity").find({
                _id: mongoose.Types.ObjectId(req.body.ID),
            }).toArray((err, docs) => {
                if (docs.length == 0) {

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var newsetup = doc;
                    newsetup.statusflag = "D";
                    dbo.collection("plugin_productivity").update({
                        _id: mongoose.Types.ObjectId(ID),
                    }, newsetup, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                pro: newsetup
                            });
                        } else {
                            res.status(500).json({
                                error: 'ERRORS.CREATEERROR'
                            });
                        }
                    });

                }

            });
        } else {
            res.status(500).json({
                error: 'ERRORS.CODEINUSE'
            });
        }
    });
}
exports.savesetup = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_productivity_setup").find({
                department: req.body.department,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    var newsetup = {};
                    newsetup.department = req.body.department;
                    newsetup.recdate = new Date(req.body.date);
                    newsetup.orguid = req.body.orguid;
                    newsetup.a = req.body.a;
                    newsetup.b = req.body.b;
                    newsetup.c = req.body.c;
                    newsetup.d = req.body.d;
                    newsetup.e = req.body.e;
                    newsetup.staffhour_m = req.body.staffhour_m;
                    newsetup.staffhour_e = req.body.staffhour_e;
                    newsetup.staffhour_n = req.body.staffhour_n;
                    newsetup.numtype = req.body.numtype;
                    newsetup.statusflag = "A";
                    newsetup.pwd = req.body.pwd;

                    dbo.collection("plugin_productivity_setup").save(newsetup, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                pro: newsetup
                            });
                        } else {
                            res.status(500).json({
                                error: 'ERRORS.CREATEERROR'
                            });
                        }
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var newsetup = doc;
                    newsetup.department = req.body.department;
                    newsetup.recdate = new Date(req.body.date);
                    newsetup.orguid = req.body.orguid;
                    newsetup.a = req.body.a;
                    newsetup.b = req.body.b;
                    newsetup.c = req.body.c;
                    newsetup.d = req.body.d;
                    newsetup.e = req.body.e;
                    newsetup.staffhour_m = req.body.staffhour_m;
                    newsetup.staffhour_e = req.body.staffhour_e;
                    newsetup.staffhour_n = req.body.staffhour_n;
                    newsetup.numtype = req.body.numtype;
                    newsetup.statusflag = "A";
                    newsetup.pwd = req.body.pwd;
                    dbo.collection("plugin_productivity_setup").update({
                        _id: mongoose.Types.ObjectId(ID),
                    }, newsetup, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                pro: newsetup
                            });
                        } else {
                            res.status(500).json({
                                error: 'ERRORS.CREATEERROR'
                            });
                        }
                    });

                }

            });
        } else {
            res.status(500).json({
                error: 'ERRORS.CODEINUSE'
            });
        }
    });
}
exports.listsetup = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_productivity_setup").aggregate([{
            "$match": {
                "statusflag": "A",
            }
        }, ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.deletesetup = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_productivity_setup").find({
                _id: mongoose.Types.ObjectId(req.body.ID),
            }).toArray((err, docs) => {
                if (docs.length == 0) {

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var newsetup = doc;
                    newsetup.statusflag = "D";
                    dbo.collection("plugin_productivity_setup").update({
                        _id: mongoose.Types.ObjectId(ID),
                    }, newsetup, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                pro: newsetup
                            });
                        } else {
                            res.status(500).json({
                                error: 'ERRORS.CREATEERROR'
                            });
                        }
                    });

                }

            });
        } else {
            res.status(500).json({
                error: 'ERRORS.CODEINUSE'
            });
        }
    });
}
exports.sumdata = function (req, res) {
    var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    var todate = moment(req.body.todate).endOf('day').toISOString();
    // console.log(fromdate);
    // console.log(todate);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_productivity").aggregate([{
                "$match": {
                    "statusflag": "A",
                    // depuid: "6198a2c7d8c1860980fc72b0",
                    // "recdate": { $gte: ISODate("2021-01-01T00:00:00.000+07:00"), $lte: ISODate("2021-12-31T23:59:59.000+07:00") },

                    "depuid": req.body.depuid,
                    "recdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    recdate: 1,
                    pro_m: 1,
                    pro_ex: 1,
                    productivity: 1,
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": {
                            "$year": [{
                                "$add": ["$recdate", 420 * 60 * 1000]
                            }]
                        },
                        "month": {
                            "$month": [{
                                "$add": ["$recdate", 420 * 60 * 1000]
                            }]
                        },
                    },
                    "pro_m": {
                        "$push": "$pro_m"
                    },
                    "pro_ex": {
                        "$push": "$pro_ex"
                    },
                    "productivity": {
                        "$push": "$productivity"
                    },
                    "count": {
                        "$sum": 1
                    }
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            var ret = [];
            Object.keys(docs).forEach(function (key) {
                var eachkey = docs[key];
                var mpro_m=0;
                for (let index = 0; index < eachkey.pro_m.length; index++) {
                    mpro_m = mpro_m+parseFloat(eachkey.pro_m[index]);
                }
                var mpro_ex=0;
                var counte=0;
                for (let index = 0; index < eachkey.pro_ex.length; index++) {
                    if (parseFloat(eachkey.pro_ex[index]) != 0) {
                        mpro_ex = mpro_ex+parseFloat(eachkey.pro_ex[index]);
                        counte=counte+1;
                    }
                  
                }
                var mmo=findmonth(eachkey._id.month);
                var vpro_m=parseInt(mpro_m/eachkey.count);
                var vpro_ex=parseInt(mpro_ex/counte);
                console.log(mpro_ex);
                if (mpro_ex==0) {
                    vpro_ex=0;
                    mproductivity=vpro_m;
                } else {
                    mproductivity=(vpro_m+vpro_ex)/2;
                }
                ret.push({
                    No:eachkey._id.month,
                    date: eachkey._id.month+'/'+eachkey._id.year,
                    month:mmo,
                    year:eachkey._id.year+543,
                    pro_m: vpro_m,
                    pro_ex: vpro_ex,
                    productivity:mproductivity,
                });
            });
            var ret = _.sortBy(ret, 'No');
            // console.log('ret',ret);
            res.status(200).json({
                data: ret
            });
            db.close();
        });
        function findmonth(item) {
            switch (item) {
    
                case 1:
                    var mtime = 'มกราคม'
                    break;
                case 2:
                    var mtime = 'กุมภาพันธ์'
                    break;
                case 3:
                    var mtime = 'มีนาคม'
                    break;
                case 4:
                    var mtime = 'เมษายน'
                    break;
                case 5:
                    var mtime = 'พฤษภาคม'
                    break;
                case 6:
                    var mtime = 'มิถุนายน'
                    break;
                case 7:
                    var mtime = 'กรกฎาคม'
                    break;
                case 8:
                    var mtime = 'สิงหาคม'
                    break;
                case 9:
                    var mtime = 'กันยายน'
                    break;
                case 10:
                    var mtime = 'ตุลาคม'
                    break;
                case 11:
                    var mtime = 'พฤศจิกายน'
                    break;
                case 12:
                    var mtime = 'ธันวาคม'
                    break;
                default:
                    break;
            }
            return mtime;
        }
    });
}