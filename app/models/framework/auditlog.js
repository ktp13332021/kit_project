var AuditLog = require('../framework/auditlog'); // refre the Model Exported Object schema
var mongoose = require('mongoose');
// var utils = require('../apputil'); // Refer the Utilitis method to handle error or as common
// var winston = require('winston');
var mongoose = require('mongoose');
var moment = require('moment');
var resuable = require('../framework/reusableobjects');
var async = require("async");
// var apputils = require("../apputil");

exports.logaudit = function(req, patientuid, dataset, datasetuid, preaudit, postaudit, patientvisituid) {
    var newAuditLog = new AuditLog();

    if (req == null)
        return;
        
    newAuditLog.useruid = req.session.useruid;
    newAuditLog.username = req.session.username;
    newAuditLog.url = req.url;
    newAuditLog.auditdate = Date.now();
    if (patientuid != null || patientuid != undefined) {
        newAuditLog.patientuid = patientuid;
    }
    if (dataset != null || dataset != undefined) {
        newAuditLog.dataset = dataset;
    }
    if (datasetuid != null || datasetuid != undefined) {
        newAuditLog.datasetuid = datasetuid;
    }
    if (preaudit != null || preaudit != undefined) {
        newAuditLog.preaudit = JSON.stringify(preaudit);
    }
    if (postaudit != null || postaudit != undefined) {
        newAuditLog.postaudit = JSON.stringify(postaudit);
    }
    if (patientvisituid != null || patientvisituid != undefined) {
        newAuditLog.patientvisituid = patientvisituid;
    }

    if (req.session.useruid != null) {
        newAuditLog.createdby = req.session.useruid;
    } else {
        newAuditLog.createdby = 1;
    }
    newAuditLog.createdat = Date.now();
    if (req.session.useruid != null) {
        newAuditLog.modifiedby = req.session.useruid;
    } else {
        newAuditLog.modifiedby = 1;
    }
    newAuditLog.modifiedat = Date.now();
    newAuditLog.statusflag = "A";
    newAuditLog.orguid = req.session.orguid;

    newAuditLog.save(function(Innererr) {
        if (!Innererr) {

        } else {
            winston.error(Innererr, { timestamp: Date.now(), pid: process.pid, url: req.url });
        }
    });
}

exports.getdetail = function(req, res) {
    var auditid = req.params.id;

    AuditLog.findById(auditid, function(err, docs) {
        if (!err) {
            res.status(200).json({
                auditlog: docs
            });
        } else {
            winston.error(err, {
                timestamp: Date.now(),
                pid: process.pid,
                url: req.url
            });
            res.status(500).json({
                error: 'ERRORS.RECORDNOTFOUND'
            });
        }
    });
}

///framework/auditlog/search/:from/:to/:useruid/:patientuid/:page
exports.search = function(req, res) {
    var useruid = req.body.useruid;
    var fromdate = req.body.fromdate;
    var todate = req.body.todate;
    var patientuid = req.body.patientuid;
    var patientvisituid = req.body.patientvisituid;
    var datasetuid = req.body.datasetuid;
    var dataset = req.body.dataset;

    var pageSize = req.body.limit || req.session.pagesize;
    var pagev = req.body.pagenumber;
    var skipv = (pagev - 1) * pageSize;
    if (skipv < 0)
        skipv = 0;

    var searchCriteria = {
        statusflag: 'A'
    };
    if (!!fromdate && !!todate) {
        searchCriteria = {
            auditdate: {
                $gt: fromdate,
                $lt: todate
            }
        }
    }
    var query = AuditLog.find(searchCriteria, 'useruid username dataset url auditdate patientuid patientname postaudit preaudit createdat');
    query.where('orguid').equals(req.session.orguid);
    if (useruid != null && useruid.length > 0) {
        query.where('useruid').equals(useruid);
    }
    if (patientuid != null && patientuid.length > 0) {
        query.where('patientuid').equals(patientuid);
    }
    if (patientvisituid != null && patientvisituid.length > 0) {
        query.where('patientvisituid').equals(patientvisituid);
    }
    if (datasetuid != null && datasetuid.length > 0) {
        query.where('datasetuid').equals(mongoose.Types.ObjectId(datasetuid));
    }
    //  if (dataset != null && dataset.length > 0);
    //    query.where('dataset').equals(dataset);
    query.sort({
        auditdate: 'desc'
    });
    query.limit(pageSize);
    query.skip(skipv);
    query.populate('useruid', 'code name');
    query.populate('patientuid', 'firstname middlename lastname mrn');
    query.lean().exec(function(err, docs) {
        if (!err) {
            // console.log('Page ' + pagev + ' returns ' + docs.length + 'from ' + fromdate + ' to ' + todate);
            res.status(200).json({
                auditlogs: docs
            });
        } else {
            winston.error(err, {
                timestamp: Date.now(),
                pid: process.pid,
                url: req.url
            });
            res.status(500).json({
                error: 'ERRORS.RECORDNOTFOUND'
            });
        }
    });
}

exports.getdetailedlog = function(req, res) {
    var mainquery = AuditLog.findById(req.params.id);
    mainquery.populate("useruid", "name");
    mainquery.populate("patientuid", "firstname middlename lastname mrn");
    mainquery.populate("patientvisituid", "visitid");
    mainquery.lean().exec((err, doc) => {
      if (err) {
        winston.error(err, {
          timestamp: Date.now(),
          pid: process.pid,
          url: req.url
        });
        res.status(500).json({ error: "ERRORS.RECORDNOTFOUND" });
        return;
      }
  
      if (!doc || !doc._id) {
        res.status(500).json({ error: "ERRORS.RECORDNOTFOUND" });
        return;
      }
  
      if (!doc.dataset || !doc.datasetuid || !doc.auditdate) {
        setDiffOverData(doc, null, res);
        return;
      }
  
      var query = AuditLog.findOne({
        dataset: doc.dataset,
        datasetuid: doc.datasetuid,
        statusflag: "A",
        orguid: req.session.orguid,
        auditdate: { $lt: doc.auditdate }
      });
      query.populate("useruid", "name");
      query.sort("-auditdate");
      query.lean().exec((preerr, predoc) => {
        if (preerr) {
          winston.error(preerr, {
            timestamp: Date.now(),
            pid: process.pid,
            url: req.url
          });
          res.status(500).json({ error: "ERRORS.RECORDNOTFOUND" });
          return;
        }
  
        setDiffOverData(doc, predoc, res);
      });
    });
  };

  exports.getdetailedloginfo = function(req, res) {

    var mainquery = AuditLog.find({
        patientuid: new mongoose.Types.ObjectId(req.body.patientuid),
        patientvisituid: new mongoose.Types.ObjectId(req.body.patientvisituid),
        statusflag: 'A',
        orguid: new mongoose.Types.ObjectId(req.session.orguid),
        dataset : req.body.dataset
    });
    
    mainquery.populate('useruid', 'name');
    mainquery.populate('patientuid', 'firstname middlename lastname mrn');
    mainquery.lean().exec(function(err, doc) {
        var selectedauditlog = {};
        if (err) {
            winston.error(err, { timestamp: Date.now(), pid: process.pid, url: req.url });
            return res.status(500).json({ error: 'ERRORS.RECORDNOTFOUND' });
        }
  
        if (!doc || !doc[0])
            return res.status(500).json({ error: 'ERRORS.RECORDNOTFOUND' });
  
        for(var i in doc) {
            var parsedpostaudit = parseAuditLog(doc[i]);
            if(!!parsedpostaudit && !!req.body.modifiedat && !!req.body.auditlogid) {
                if(parsedpostaudit._id == req.body.objectid && parsedpostaudit.modifiedat == req.body.modifiedat 
                    && !!parsedpostaudit.auditlog && parsedpostaudit.auditlog.length > 0) {
                    for(var j in parsedpostaudit.auditlog) {
                        if(parsedpostaudit.auditlog[j]._id == req.body.auditlogid) {
                            selectedauditlog = doc[i];
                            break;
                        }
                    }
                    if(!!selectedauditlog) {
                        break;
                    }
                }
            }
        }
  
        if (!selectedauditlog.dataset || !selectedauditlog.datasetuid || !selectedauditlog.auditdate)
            return setDiffOverData(selectedauditlog, null, res);
  
        var query = AuditLog.findOne({
            dataset: selectedauditlog.dataset,
            datasetuid: selectedauditlog.datasetuid,
            statusflag: 'A',
            orguid: req.session.orguid,
            auditdate: { $lt: selectedauditlog.auditdate }
        });
        query.populate('useruid', 'name');
        query.populate('patientuid', 'firstname middlename lastname mrn');
        query.sort('-auditdate');
        query.lean().exec(function(preerr, predoc) {
            if (preerr) {
                winston.error(preerr, { timestamp: Date.now(), pid: process.pid, url: req.url });
                return res.status(500).json({ error: 'ERRORS.RECORDNOTFOUND' });
            }
  
            setDiffOverData(selectedauditlog, predoc, res);
        });
    });
  }
  
  function parseAuditLog(auditlog) {
    if (!auditlog || !auditlog.postaudit)
        return '';
  
    try {
        return JSON.parse(auditlog.postaudit);
    } catch (e) {
        winston.error(e, { timestamp: Date.now(), pid: process.pid, url: req.url });
        return ''
    }
  }

  var fieldsToIgnore = [
    "_id",
    "__v",
    "id",
    "auditlog",
    "auditlogs",
    "textauditlog",
    "patientorderlogs",
    "modifiedby",
    "modifiedat"
  ];
  var valueToSelect = {
    ReferenceValue: "valuedescription",
    Patient: "mrn",
    PatientVisit: "visitid"
  };

  function setDiffOverData(postauditdoc, preauditdoc, res) {
    var postaudit = parseAuditLog(postauditdoc);
    var preaudit = parseAuditLog(preauditdoc);
    postauditdoc.postaudit = postaudit;
    if (preauditdoc) preauditdoc.postaudit = preaudit;
  
    var matched = datasetToCollectionMapping.find(
      item => item.dataset === postauditdoc.dataset
    );
  
    if (!matched) {
      res.status(200).json({ postaudit: postauditdoc, preaudit: preauditdoc });
      return;
    }
  
    var mongooseSchema = null;
    try {
      mongooseSchema = require(matched.schemapath);
    } catch (e) {
      winston.error(e, {
        timestamp: Date.now(),
        pid: process.pid,
        url: req.url
      });
      res.status(500).json({ error: "ERRORS.RECORDNOTFOUND", actualerror: e });
      return;
    }
  
    if (!mongooseSchema || !mongooseSchema.schema) {
      res.status(200).json({ postaudit: postauditdoc, preaudit: preauditdoc });
      return;
    }
  
    async.parallel(
      [
        function(callback) {
          populateOtherData(postaudit, mongooseSchema, callback);
        },
        function(callback) {
          populateOtherData(preaudit, mongooseSchema, callback);
        }
      ],
      (err, results) => {
        if (err) {
          winston.error(err, {
            timestamp: Date.now(),
            pid: process.pid,
            url: req.url
          });
          res.status(500).json({ error: "ERRORS.RECORDNOTFOUND" });
          return;
        }
  
        if (!results || results.length !== 0) {
          res
            .status(200)
            .json({ postaudit: postauditdoc, preaudit: preauditdoc });
          return;
        }
  
        [preauditdoc.postaudit] = results;
        if (preauditdoc) [, preauditdoc.postaudit] = results;
        res
          .status(200)
          .json({ postaudit: postauditdoc, preaudit: preauditdoc });
      }
    );
  }

  function populateOtherData(auditlog, mongooseSchema, callback) {
    if (!auditlog) {
      callback(null, auditlog);
      return;
    }
    var tree = (mongooseSchema.schema && mongooseSchema.schema.tree) || null;
    if (!tree) {
      callback(null, auditlog);
      return;
    }
    var fieldToPopulate = [];
  
    function recurse(obj, schemaFields, parentField) {
      Object.keys(obj).forEach(auditf => {
        if (!obj[auditf]) return;
        if (fieldsToIgnore.indexOf(auditf) > -1) {
          obj[auditf] = undefined;
          return;
        }
  
        var fieldProperties = null;
        Object.keys(schemaFields).every(field => {
          if (!schemaFields[field]) return true;
          if (auditf === field) {
            fieldProperties = schemaFields[field];
            return false;
          }
          return true;
        });
  
        if (!fieldProperties) return;
        if (Array.isArray(obj[auditf])) {
          if (obj[auditf].length === 0) obj[auditf] = [];
  
          for (var i = 0; i < obj[auditf].length; i++) {
            if (fieldProperties[0].tree) {
              recurse(
                obj[auditf][i],
                fieldProperties[0].tree,
                `${parentField + auditf}.`
              );
            } else if (fieldProperties[0].ref || fieldProperties[0].type) {
              recurse(obj[auditf][i], fieldProperties, parentField + auditf);
            } else {
              recurse(
                obj[auditf][i],
                fieldProperties[0],
                `${parentField + auditf}.`
              );
            }
          }
          return;
        }
        if (
          mongooseSchema.schema.nested &&
          mongooseSchema.schema.nested[auditf]
        ) {
          for (var i = 0; i < fieldProperties.length; i++) {
            recurse(obj[auditf], fieldProperties, `${auditf}.`);
          }
          return;
        }
  
        if (
          fieldProperties.name === "Date" ||
          (fieldProperties.type && fieldProperties.type.name === "Date") ||
          auditf === "modifiedat" ||
          auditf === "createdat"
        ) {
          var clientDate =
            (obj[auditf] &&
              utils.getMomentBasedOnServerTimeZone(obj[auditf])) ||
            null;
          obj[auditf] =
            (clientDate && clientDate.format("DD-MM-YYYY HH:mm")) ||
            obj[auditf];
        } else if (fieldProperties.ref) {
          if (fieldProperties.ref.indexOf(".") === -1) {
            var select = valueToSelect[fieldProperties.ref];
            select = select || "name";
            var path = parentField;
            if (isNaN(auditf)) path += auditf;
            fieldToPopulate.push({
              path,
              model: fieldProperties.ref,
              select
            });
          }
        } else if(apputils.isValidObjectId(obj[auditf])) {
          obj[auditf] = undefined;
        }   
      });
    }
  
    recurse(auditlog, tree, "");
  
    if (!fieldToPopulate.length) {
      callback(null, auditlog);
      return;
    }
  
    mongooseSchema.populate(auditlog, fieldToPopulate, (err, doc) => {
      if (err || !doc) {
        winston.error(err, {
          timestamp: Date.now(),
          pid: process.pid,
          url: req.url
        });
        callback(null, auditlog);
        return;
      }
  
      callback(null, doc);
    });
  }

  var datasetToCollectionMapping = [
    { dataset: "OrRecord", schemapath: "../models/operatingroom/orrecord" },
    { dataset: "ANCRecord", schemapath: "../models/anclr/ancrecord" },
    { dataset: "FatherDetail", schemapath: "../models/anclr/fatherdetail" },
    { dataset: "NewbornDetail", schemapath: "../models/anclr/newborndetail" },
    {
      dataset: "CurrencyExchangeRate",
      schemapath: "../models/billing/currencyexchangerate"
    },
    {
      dataset: "FinancialCounselling",
      schemapath: "../models/billing/financialcounselling"
    },
    { dataset: "Deposit", schemapath: "../models/billing/deposit" },
    { dataset: "CCHPI", schemapath: "../models/clinicaldatamaster/cchpimaster" },
    {
      dataset: "CCHPISET",
      schemapath: "../models/clinicaldatamaster/cchpimasterset"
    },
    {
      dataset: "CertTemplate",
      schemapath: "../models/clinicaldatamaster/certtemplate"
    },
    {
      dataset: "FavouriteCchpi",
      schemapath: "../models/clinicaldatamaster/favouritecchpi"
    },
    {
      dataset: "FavouriteProblem",
      schemapath: "../models/clinicaldatamaster/favouriteproblem"
    },
    {
      dataset: "FavouriteProcedure",
      schemapath: "../models/clinicaldatamaster/favouriteprocedure"
    },
    {
      dataset: "FormTemplate",
      schemapath: "../models/clinicaldatamaster/formtemplate"
    },
    {
      dataset: "ImageLibrary",
      schemapath: "../models/clinicaldatamaster/imagelibrary"
    },
    {
      dataset: "MedicalHistorySet",
      schemapath: "../models/clinicaldatamaster/medicalhistoryset"
    },
    {
      dataset: "NoteTemplate",
      schemapath: "../models/clinicaldatamaster/notetemplate"
    },
    {
      dataset: "PrefilledForm",
      schemapath: "../models/clinicaldatamaster/prefilledform"
    },
    { dataset: "Problem", schemapath: "../models/clinicaldatamaster/problem" },
    {
      dataset: "ProblemSet",
      schemapath: "../models/clinicaldatamaster/problemset"
    },
    {
      dataset: "RadiologyTemplate",
      schemapath: "../models/clinicaldatamaster/radiologytemplate"
    },
    {
      dataset: "TaskMaster",
      schemapath: "../models/clinicaldatamaster/taskmaster"
    },
    {
      dataset: "TaskMasterSet",
      schemapath: "../models/clinicaldatamaster/taskmasterset"
    },
    { dataset: "ChangePassword", schemapath: "../models/enterprise/user" },
    { dataset: "Logout", schemapath: "../models/framework/loginsessions" },
    { dataset: "CssdProcess", schemapath: "../models/cssd/cssdprocess" },
    { dataset: "TrayRequest", schemapath: "../models/cssd/trayrequests" },
    { dataset: "TrayReturn", schemapath: "../models/cssd/trayreturns" },
    { dataset: "Trays", schemapath: "../models/cssd/trays" },
    { dataset: "TrayStock", schemapath: "../models/cssd/traystock" },
    {
      dataset: "PatientDietPlan",
      schemapath: "../models/dietary/patientdietplan"
    },
    {
      dataset: "PatientFeedingStatus",
      schemapath: "../models/dietary/patientfeedingstatus"
    },
    {
      dataset: "AmbulanceRequest",
      schemapath: "../models/emergency/ambulancerequest"
    },
    {
      dataset: "EmergencyDetail",
      schemapath: "../models/emergency/emergencydetail"
    },
    { dataset: "Patient", schemapath: "../models/patient/patient" },
    { dataset: "PatientVisit", schemapath: "../models/patient/patientvisit" },
    { dataset: "ErDischarge", schemapath: "../models/emergency/erdischarge" },
    { dataset: "TriageDetail", schemapath: "../models/emergency/triagedetail" },
    { dataset: "Alert", schemapath: "../models/emr/alert" },
    { dataset: "Annotation", schemapath: "../models/emr/annotation" },
    { dataset: "ClinicalNote", schemapath: "../models/emr/clinicalnote" },
    { dataset: "Diagnosis", schemapath: "../models/emr/diagnosis" },
    { dataset: "DoctorNote", schemapath: "../models/emr/doctornote" },
    {
      dataset: "DoctorRecommendation",
      schemapath: "../models/emr/doctorrecommendation"
    },
    { dataset: "DrugAllergy", schemapath: "../models/emr/allergy" },
    { dataset: "NoKnownDrugAllergy", schemapath: "../models/emr/allergy" },
    { dataset: "FoodAllergy", schemapath: "../models/emr/allergy" },
    { dataset: "OtherAllergy", schemapath: "../models/emr/allergy" },
    { dataset: "Examination", schemapath: "../models/emr/examination" },
    {
      dataset: "MedicalCertificate",
      schemapath: "../models/emr/medicalcertificate"
    },
    { dataset: "MedicalHistory", schemapath: "../models/emr/medicalhistory" },
    {
      dataset: "MedicationHistory",
      schemapath: "../models/emr/medicationhistory"
    },
    { dataset: "ObHistory", schemapath: "../models/emr/obhistory" },
    { dataset: "Observation", schemapath: "../models/emr/observation" },
    { dataset: "PatientConsult", schemapath: "../models/patient/patientconsult" },
    { dataset: "PatientForm", schemapath: "../models/emr/patientform" },
    { dataset: "PatientProcedure", schemapath: "../models/emr/patientprocedure" },
    {
      dataset: "PatientReferralOut",
      schemapath: "../models/patient/patientreferralout"
    },
    {
      dataset: "PersonalizedEmrWidget",
      schemapath: "../models/patient/personalizedemrwidget"
    },
    { dataset: "ScannedDocument", schemapath: "../models/emr/scanneddocument" },
    { dataset: "TeleConsult", schemapath: "../models/emr/teleconsult" },
    { dataset: "VaccineChart", schemapath: "../models/emr/vaccinechart" },
    {
      dataset: "AppointmentSchedule",
      schemapath: "../models/enterprise/appointmentschedule"
    },
    {
      dataset: "FUTUREORDER",
      schemapath: "../models/ordermanagement/patientfutureorder"
    },
    { dataset: "Department", schemapath: "../models/enterprise/department" },
    { dataset: "Location", schemapath: "../models/enterprise/location" },
    { dataset: "Ward", schemapath: "../models/enterprise/ward" },
    { dataset: "Bed", schemapath: "../models/enterprise/bed" },
    { dataset: "Organisation", schemapath: "../models/enterprise/organisation" },
    {
      dataset: "SequenceNumber",
      schemapath: "../models/framework/sequencenumber"
    },
    {
      dataset: "OrganisationImage",
      schemapath: "../models/enterprise/organisationimage"
    },
    {
      dataset: "ReferringOrg",
      schemapath: "../models/enterprise/referralmaster"
    },
    { dataset: "Task", schemapath: "../models/enterprise/task" },
    { dataset: "TaskDocument", schemapath: "../models/enterprise/taskdocument" },
    { dataset: "User", schemapath: "../models/enterprise/user" },
    { dataset: "UserImage", schemapath: "../models/enterprise/userimage" },
    { dataset: "Country", schemapath: "../models/framework/country" },
    { dataset: "State", schemapath: "../models/framework/state" },
    { dataset: "City", schemapath: "../models/framework/city" },
    { dataset: "Area", schemapath: "../models/framework/area" },
    { dataset: "ANCSetting", schemapath: "../models/framework/ancsetting" },
    {
      dataset: "DoctorWorkbenchSetting",
      schemapath: "../models/framework/doctorworkbenchsetting"
    },
    { dataset: "EMARSetting", schemapath: "../models/framework/emarsetting" },
    {
      dataset: "EmergencySetting",
      schemapath: "../models/framework/emergencysetting"
    },
    { dataset: "EMRSetting", schemapath: "../models/framework/emrsetting" },
    {
      dataset: "LabAndDiagnosticsSetting",
      schemapath: "../models/framework/labanddiagnosticssetting"
    },
    {
      dataset: "MedicalDictionary",
      schemapath: "../models/framework/medicaldictionary"
    },
    { dataset: "OrderSetting", schemapath: "../models/framework/ordersetting" },
    {
      dataset: "RadiologySetting",
      schemapath: "../models/framework/radiologysetting"
    },
    {
      dataset: "ReferenceDomain",
      schemapath: "../models/framework/referencevalue"
    },
    {
      dataset: "RegistrationSetting",
      schemapath: "../models/framework/registrationsetting"
    },
    { dataset: "Role", schemapath: "../models/framework/role" },
    { dataset: "Permission", schemapath: "../models/framework/permission" },
    { dataset: "SecuredItem", schemapath: "../models/framework/secureditem" },
    {
      dataset: "SecurityPolicy",
      schemapath: "../models/framework/securitypolicy"
    },
    { dataset: "SMSSetting", schemapath: "../models/framework/smssetting" },
    {
      dataset: "AdmissionRequest",
      schemapath: "../models/inpatient/admissionrequest"
    },
    { dataset: "BedTransfer", schemapath: "../models/inpatient/bedtransfer" },
    {
      dataset: "DischargeProcess",
      schemapath: "../models/inpatient/dischargeprocess"
    },
    { dataset: "HandoverNotes", schemapath: "../models/inpatient/handovernote" },
    {
      dataset: "HousekeepingTask",
      schemapath: "../models/inpatient/housekeepingtask"
    },
    { dataset: "IpdConsult", schemapath: "../models/inpatient/ipdconsult" },
    { dataset: "ReserveBed", schemapath: "../models/inpatient/reservebed" },
    { dataset: "UPDATEWAC", schemapath: "../models/inventory/wac" },
    { dataset: "UPDATESTKLEDGER", schemapath: "../models/inventory/stockledger" },
    { dataset: "LabMaster", schemapath: "../models/lab/labmaster" },
    { dataset: "Specimen", schemapath: "../models/lab/specimen" },
    { dataset: "TestCodeMapping", schemapath: "../models/lab/testcodemapping" },
    { dataset: "TestSpecimen", schemapath: "../models/lab/testspecimen" },
    { dataset: "IssueFolder", schemapath: "../models/mrd/folderissue" },
    { dataset: "FolderRequest", schemapath: "../models/mrd/folderrequest" },
    { dataset: "MRDFolder", schemapath: "../models/mrd/mrdfolder" },
    { dataset: "MrdCoding", schemapath: "../models/mrd/mrdcoding" },
    { dataset: "FolderReturn", schemapath: "../models/mrd/folderreturns" },
    { dataset: "MRDStorage", schemapath: "../models/mrd/mrdstorage" },
    {
      dataset: "PatientVisitCancel",
      schemapath: "../models/mrd/patientvisitcancel"
    },
    { dataset: "OrSchedule", schemapath: "../models/operatingroom/orschedule" },
    { dataset: "OrSession", schemapath: "../models/operatingroom/orsessions" },
    {
      dataset: "SurgeryRequest",
      schemapath: "../models/operatingroom/surgeryrequest"
    },
    {
      dataset: "Glassprescription",
      schemapath: "../models/ophthalmology/glassprescription"
    },
    { dataset: "Refraction", schemapath: "../models/ophthalmology/refraction" },
    { dataset: "AgeMaster", schemapath: "../models/ordermanagement/agemaster" },
    {
      dataset: "FrequencyMaster",
      schemapath: "../models/ordermanagement/frequency"
    },
    {
      dataset: "MedReconcile",
      schemapath: "../models/ordermanagement/medreconcile"
    },
    { dataset: "MedReview", schemapath: "../models/ordermanagement/medreview" },
    {
      dataset: "MEDSADMINTASK",
      schemapath: "../models/ordermanagement/medsadmin"
    },
    {
      dataset: "OrderCategory",
      schemapath: "../models/ordermanagement/ordercategory"
    },
    { dataset: "OrderItem", schemapath: "../models/ordermanagement/orderitem" },
    {
      dataset: "OrderResultItem",
      schemapath: "../models/ordermanagement/orderresultitem"
    },
    {
      dataset: "OrderRouteMap",
      schemapath: "../models/ordermanagement/orderroute"
    },
    { dataset: "OrderSet", schemapath: "../models/ordermanagement/orderset" },
    { dataset: "SigCode", schemapath: "../models/ordermanagement/sigcode" },
    {
      dataset: "Translation",
      schemapath: "../models/ordermanagement/translation"
    },
    { dataset: "DeathRecord", schemapath: "../models/patient/deathrecord" },
    {
      dataset: "GlScannedDoc",
      schemapath: "../models/patient/glscanneddocument"
    },
    { dataset: "PayorGL", schemapath: "../models/patient/payorguaranteevarter" },
    { dataset: "DrugGroup", schemapath: "../models/pharmacymaster/druggroup" },
    { dataset: "DrugMaster", schemapath: "../models/pharmacymaster/drugmaster" },
    {
      dataset: "PharmacySetting",
      schemapath: "../models/pharmacymaster/pharmacysetting"
    },
    {
      dataset: "VaccineSchedule",
      schemapath: "../models/pharmacymaster/vaccineschedule"
    },
    {
      dataset: "RadiologySchedule",
      schemapath: "../models/radiology/radiologyschedule"
    },
    {
      dataset: "RadiologySession",
      schemapath: "../models/radiology/radiologysessions"
    },
    {
      dataset: "PatientAdditionalDetail",
      schemapath: "../models/patient/patientadditonaldetails"
    },
    {
      dataset: "PatientDocument",
      schemapath: "../models/patient/patientdocument"
    },
    { dataset: "PatientEpisode", schemapath: "../models/patient/patientepisode" },
    { dataset: "PatientImage", schemapath: "../models/patient/patientimage" },
    {
      dataset: "AUTOPRINT",
      schemapath: "../models/reporting/printerconfiguration"
    },
    {
      dataset: "ReportConfigurations",
      schemapath: "../models/reporting/reportconfiguration"
    },
    { dataset: "ChiefComplaints", schemapath: "../models/emr/cchpi" },
    {
      dataset: "DispenseReturn",
      schemapath: "../models/inventory/dispensereturn"
    },
    {
      dataset: "PatientOrder",
      schemapath: "../models/ordermanagement/patientorder"
    },
    { dataset: "MedsAdmin", schemapath: "../models/ordermanagement/medsadmin" },
    {
      dataset: "OperatingRoomSetting",
      schemapath: "../models/framework/operatingroomsetting"
    },
    {
      dataset: "PatientDietAssessment",
      schemapath: "../models/dietary/patientdietassessment"
    },
    {
      dataset: "ServiceMaster",
      schemapath: "../models/enterprise/servicemaster"
    },
    { dataset: "Claim", schemapath: "../models/eclaims/claim" },
    { dataset: "claimActivity", schemapath: "../models/eclaims/claimactivity" }
  ];
  