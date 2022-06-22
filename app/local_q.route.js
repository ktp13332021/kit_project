var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;
exports.savedep = function (req, res) {
    if (req.body.department && req.body.department != '') {
        var mongoose = require('mongoose')
        MongoClient.connect(dbpath, (connectErr, db) => {
            if (req.body != null) {
                var dbo = db;
                dbo.collection("plugin_Q_department").find({
                    department: req.body.department,
                }).toArray((err, docs) => {
                    if (docs.length == 0) {
                        var newva = {};
                        newva.department = req.body.department;
                        newva.pwd = req.body.pwd;
                        newva.group = req.body.group;
                        newva.displayorder = parseInt(req.body.displayorder);
                        newva.orguid = req.body.orguid;
                        newva.statusflag = 'A';
                        dbo.collection("plugin_Q_department").save(newva, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({
                                    va: newva
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
                        var updateitem = doc;
                        updateitem.department = req.body.department;
                        updateitem.pwd = req.body.pwd;
                        updateitem.group = req.body.group;
                        updateitem.displayorder = parseInt(req.body.displayorder);
                        updateitem.orguid = req.body.orguid;
                        updateitem.statusflag = 'A';
                        dbo.collection("plugin_Q_department").update({
                            _id: mongoose.Types.ObjectId(ID),
                        }, updateitem, function (Innererr) {
                            if (!Innererr) {
                                res.status(200).json({
                                    va: updateitem
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
}
exports.finddepartment = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_department").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
            }
        },
        {
            $addFields: {
                show: true
            }
        },
        {
            "$sort": {
                "displayorder": 1.0
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
exports.delete_department = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_department").find({
                _id: mongoose.Types.ObjectId(req.body.ID),
            }).toArray((err, docs) => {
                if (docs.length == 0) {

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var newsetup = doc;
                    newsetup.statusflag = "D";
                    dbo.collection("plugin_Q_department").update({
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
exports.saveroom = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_room").find({
                $and: [{
                    department: req.body.department
                },
                {
                    room: req.body.room
                }
                ]
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    var newva = {};
                    newva.department = req.body.department;
                    newva.room = req.body.room;

                    newva.orguid = req.body.orguid;
                    newva.statusflag = 'A';
                    dbo.collection("plugin_Q_room").save(newva, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                va: newva
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
                    var updateitem = doc;
                    updateitem.department = req.body.department;
                    updateitem.room = req.body.room;

                    updateitem.orguid = req.body.orguid;
                    updateitem.statusflag = 'A';

                    dbo.collection("plugin_Q_room").update({
                        _id: mongoose.Types.ObjectId(ID),
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                va: updateitem
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
exports.findroom = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_room").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
            }
        },
        {
            $addFields: {
                show: true
            }
        },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.findroom_bydep = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_room").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
                "department": req.body.department,
            }
        },
        {
            "$sort": {
                "room": 1.0
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
exports.update_room = function (req, res) {
    var {
        patient,
        room
    } = req.body;
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    res.status(500).json({
                        error: 'ERRORS.CREATEERROR'
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var updateitem = doc;

                    var found = updateitem.tracking.find(elem => elem.screen == patient.currenttracking.screen && elem.stop == "");
                    console.log('found', found);
                    if (found) {
                        found.room = room;
                    }

                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.delete_room = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_room").find({
                _id: mongoose.Types.ObjectId(req.body.ID),
            }).toArray((err, docs) => {
                if (docs.length == 0) {

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var newsetup = doc;
                    newsetup.statusflag = "D";
                    dbo.collection("plugin_Q_room").update({
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
// -------------------------------------
exports.savetransaction = function (req, res) {
    var {
        patient,
        department,
        orguid,
    } = req.body;
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    var newitem = {};
                    newitem.department = department;
                    newitem.HN = patient.HN;
                    newitem.AN = patient.AN;
                    newitem.name = patient.name;
                    newitem.patientvisituid = patient.patientvisituid;
                    newitem.payor = patient.payor;
                    newitem.careprovider = patient.careprovider;
                    newitem.registdate = new Date(patient.startdate);
                    newitem.orguid = orguid;

                    newitem.tracking = [{
                        status: 'รอเรียกคิว',
                        start: new Date(),
                        stop: '',
                        screen: department,
                        room: ''
                    }]

                    newitem.statusflag = 'A';
                    dbo.collection("plugin_Q_transaction").save(newitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: newitem
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
                    var updateitem = doc;
                    updateitem.department = department;
                    updateitem.HN = patient.HN;
                    updateitem.AN = patient.AN;
                    updateitem.name = patient.name;
                    updateitem.patientvisituid = patient.patientvisituid;
                    updateitem.payor = patient.payor;
                    updateitem.careprovider = updateitem.careprovider;
                    updateitem.registdate = new Date(patient.startdate);
                    updateitem.orguid = orguid;

                    updateitem.tracking = updateitem.tracking || [];
                    var found = updateitem.tracking.find(elem => elem.screen == department);
                    if (found) {
                        found.status = 'รอเรียกคิว';
                    } else {
                        updateitem.tracking.push({
                            status: 'รอเรียกคิว',
                            start: new Date(),
                            stop: '',
                            screen: department,
                            room: ''
                        });
                    }

                    updateitem.statusflag = 'A';
                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.transaction_finalstage = function (req, res) {
    var {
        patient,
        status,
        department
    } = req.body;

    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    res.status(500).json({
                        error: 'ERRORS.CREATEERROR'
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var updateitem = doc;

                    var foundCurrent = updateitem.tracking.find(elem => elem.screen == patient.currenttracking.screen && elem.stop == '');
                    if (foundCurrent) {
                        foundCurrent.status = status;
                        foundCurrent.stop = new Date();
                    }

                    var foundNextDept = updateitem.tracking.find(elem => elem.screen == department);
                    if (foundNextDept) {
                        foundNextDept.status = 'รอเรียกคิว';
                    } else {
                        updateitem.tracking.push({
                            screen: department,
                            start: new Date(),
                            stop: '',
                            status: 'รอเรียกคิว'
                        });
                    }

                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.transaction_consult = function (req, res) { // consult between opd
    var {
        patient,
        department
    } = req.body;

    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    res.status(500).json({
                        error: 'ERRORS.CREATEERROR'
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var updateitem = doc;

                    updateitem.tracking = updateitem.tracking || [];
                    // var found = updateitem.tracking.find(elem => elem.screen == department);
                    // if (found) {
                    //     found.status = 'รอเรียกคิว';
                    // }
                    // else {
                    //     updateitem.tracking.push({
                    //         status: 'รอเรียกคิว',
                    //         start: new Date(),
                    //         stop: '',
                    //         screen: department,
                    //         room: ''
                    //     });
                    // }
                    var foundCurrent = updateitem.tracking.find(elem => elem.screen == patient.currenttracking.screen);
                    if (foundCurrent) {
                        foundCurrent.stop = new Date();
                    }

                    // var foundNextDept = updateitem.tracking.find(elem => elem.screen == department);
                    // if (foundNextDept) {
                    //     foundNextDept.status = 'รอเรียกคิว';
                    // }
                    // else {
                    updateitem.tracking.push({
                        screen: department,
                        start: new Date(),
                        stop: '',
                        status: 'รอเรียกคิว'
                    });
                    // }
                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.transaction_end = function (req, res) { //close at cashier and pharmacy
    var {
        patient,
        status,
        department
    } = req.body;

    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    res.status(500).json({
                        error: 'ERRORS.CREATEERROR'
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var updateitem = doc;

                    var foundCurrent = updateitem.tracking.find(elem => elem.screen == patient.currenttracking.screen && elem.stop == '');
                    if (foundCurrent) {
                        foundCurrent.status = "เสร็จสิ้น";
                        foundCurrent.stop = new Date();
                    }

                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.findtransaction = function (req, res) { //use in regist
    var fromdate = moment(req.body.registdate).startOf('day').toISOString();
    var todate = moment(req.body.registdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_transaction").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
                "registdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
//----------------------------------------
exports.q_bydepartment = function (req, res) {
    var fromdate = moment(req.body.registdate).startOf('day').toISOString();
    var todate = moment(req.body.registdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_transaction").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
                "registdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                },
                "tracking.screen": req.body.department,
            }
        },
        {
            $addFields: {
                currenttracking: {
                    $last: {
                        $filter: {
                            input: '$tracking',
                            as: "item",
                            cond: {
                                $eq: ['$$item.screen', req.body.department]
                            }
                        }
                    }
                }
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


exports.savestatus = function (req, res) {
    var {
        patient,
        status,
        orguid,
        department
    } = req.body;
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    res.status(500).json({
                        error: 'ERRORS.CREATEERROR'
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var updateitem = doc;

                    var found = updateitem.tracking.find(elem => elem.screen == patient.currenttracking.screen);
                    if (found) {
                        found.status = status;
                    }

                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.findtransactionER = function (req, res) { //use in ER
    var fromdate = moment(req.body.registdate).startOf('day').toISOString();
    var todate = moment(req.body.registdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_transaction").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
                "registdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                },
                "dep": "ER",
            }
        },
        {
            $addFields: {
                currenttracking: {
                    $last: {
                        $filter: {
                            input: '$tracking',
                            as: "item",
                            cond: {
                                $eq: ['$$item.screen', req.body.department]
                            }
                        }
                    }
                }
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
exports.savetransactionER = function (req, res) {
    var {
        patient,
        department,
        orguid,
    } = req.body;
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    var newitem = {};
                    newitem.department = department;
                    newitem.HN = patient.HN;
                    newitem.AN = patient.AN;
                    newitem.name = patient.name;
                    newitem.patientvisituid = patient.patientvisituid;
                    // newitem.payor = patient.payor;
                    // newitem.careprovider = patient.careprovider;
                    newitem.registdate = new Date(patient.Visitdate);
                    newitem.orguid = orguid;
                    newitem.dep = "ER";
                    newitem.TriageLevel = patient.TriageLevelCode;
                    newitem.recq_er = newitem.recq_er || patient.recq_er;
                    var trackingObj = {
                        status: 'รอเรียกคิว',
                        start: new Date(),
                        stop: '',
                        screen: department,
                        room: ''
                    }

                    if (patient.TriageLevelCode == 'EMELVL1' || patient.TriageLevelCode == 'EMELVL2') {
                        trackingObj.status = 'คิวเรียก';
                    }

                    newitem.tracking = [trackingObj];

                    newitem.statusflag = 'A';
                    dbo.collection("plugin_Q_transaction").save(newitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: newitem
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
                    var updateitem = doc;
                    updateitem.recq_er = updateitem.recq_er || patient.recq_er;

                    if (patient.statusflag != 'T') {
                        var found = updateitem.tracking.find(elem => elem.screen == department);
                        if (found && found.status != 'เสร็จสิ้น') {
                            found.status = "เสร็จสิ้น";
                            found.stop = new Date();
                        }
                        else if (!found) {
                            updateitem.tracking.push({
                                status: 'เสร็จสิ้น',
                                start: new Date(),
                                stop: new Date(),
                                screen: department,
                                room: ''
                            })
                        }
                    }

                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.savestatusER = function (req, res) {
    var {
        patient,
        recq_er,
    } = req.body;
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        if (req.body != null) {
            var dbo = db;
            dbo.collection("plugin_Q_transaction").find({
                AN: patient.AN,
                HN: patient.HN,
            }).toArray((err, docs) => {
                if (docs.length == 0) {
                    res.status(500).json({
                        error: 'ERRORS.CREATEERROR'
                    });

                } else {
                    var doc = docs[0];
                    var ID = doc._id;
                    var updateitem = doc;
                    updateitem.recq_er = recq_er;
                    // var found = updateitem.tracking.find(elem => elem.screen == patient.currenttracking.screen);
                    // if (found) {
                    //     found.status = status;
                    // }

                    dbo.collection("plugin_Q_transaction").update({
                        _id: ID,
                    }, updateitem, function (Innererr) {
                        if (!Innererr) {
                            res.status(200).json({
                                data: updateitem
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
exports.findcase_by4digit = function (req, res) { //use in ER
    var fromdate = moment(req.body.registdate).startOf('day').toISOString();
    var todate = moment(req.body.registdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("plugin_Q_transaction").aggregate([{
            "$match": {
                "statusflag": 'A',
                "orguid": req.body.orguid,
                "registdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                },
                "AN": req.body.fourdigit,
            }
        },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
