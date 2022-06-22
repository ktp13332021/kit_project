module.exports = function (app) {
    // var local_host = require('./local_host.route.js');
    // app.post('/local_host/findconsent', local_host.findconsent);
    // app.post('/local_host/saveconsent', local_host.saveconsent);
    app.get('/org-config', function (req, res) {
        if (!process.env.ORG) {
            return res.status(500).json({ error: 'no organistion config' })
        }

        return res.status(200).json({ org: process.env.ORG })
    })

    var security = require('./utils/security');
    app.get('/security/login/:username/:shake128/:md5?', security.login);

    var centrix_bi = require('./centrix_bi.route.js');
    app.post('/centrix_bi/visithourcount', centrix_bi.visithourcount);
    app.post('/centrix_bi/visitcount', centrix_bi.visitcount);
    app.post('/centrix_bi/ward', centrix_bi.ward);
    app.post('/centrix_bi/warddetail', centrix_bi.warddetail);
    app.post('/centrix_bi/departmentcount', centrix_bi.departmentcount);
    app.post('/centrix_bi/revenuesplit', centrix_bi.revenuesplit);
    app.post('/centrix_bi/opddaily', centrix_bi.opddaily);
    app.post('/centrix_bi/admissioncount', centrix_bi.admissioncount);
    app.post('/centrix_bi/dischargecount', centrix_bi.dischargecount);
    app.post('/centrix_bi/findbedoccupancy', centrix_bi.findbedoccupancy);
    app.post('/centrix_bi/compare_opd', centrix_bi.compare_opd);
    app.post('/centrix_bi/find_site', centrix_bi.find_site);
    var centrix_edoc = require('./centrix_edoc.route.js');
    app.post('/centrix_edoc/find_getmed_today', centrix_edoc.find_getmed_today);
    app.post('/centrix_edoc/findxray_byPTVUID', centrix_edoc.findxray_byPTVUID);
    app.post('/centrix_edoc/findlab_byvisitID', centrix_edoc.findlab_byvisitID);
    app.post('/centrix_edoc/getdetailbyHN', centrix_edoc.getdetailbyHN);
    app.post('/centrix_edoc/find_mdname', centrix_edoc.find_mdname);
    app.post('/centrix_edoc/find_department', centrix_edoc.find_department);
    app.post('/centrix_edoc/find_user_all', centrix_edoc.find_user_all);
    app.post('/centrix_edoc/emr_subnode_allergy', centrix_edoc.emr_subnode_allergy);
    app.post('/centrix_edoc/emr_medhx', centrix_edoc.emr_medhx);
    app.post('/centrix_edoc/emr_eye', centrix_edoc.emr_eye);
    app.post('/centrix_edoc/find_getmed_today', centrix_edoc.find_getmed_today);
    app.post('/centrix_edoc/getdetailbyHN_org', centrix_edoc.getdetailbyHN_org);
    app.get('/centrix_edoc/getobservationslist/:orderitemcode/:hn/:fromdate?/:todate?', centrix_edoc.getobservationslist);

    app.post('/centrix_edoc/emr_eye_bymd', centrix_edoc.emr_eye_bymd);
    app.post('/centrix_edoc/get_ICD10_allvisit', centrix_edoc.get_ICD10_allvisit);
    app.post('/centrix_edoc/emr_findvisit_byHNdate', centrix_edoc.emr_findvisit_byHNdate);
    app.post('/centrix_edoc/emr_diagnosis', centrix_edoc.emr_diagnosis);
    app.post('/centrix_edoc/get_vitalsign', centrix_edoc.get_vitalsign);
    app.post('/centrix_edoc/findlabcumu_bypatientuid', centrix_edoc.findlabcumu_bypatientuid);
    app.post('/centrix_edoc/opd_bymd', centrix_edoc.opd_bymd);
    app.post('/centrix_edoc/get_va', centrix_edoc.get_va);
    app.post('/centrix_edoc/emr_edoc', centrix_edoc.emr_edoc);
    app.post('/centrix_edoc/find_procedure_byPTUID', centrix_edoc.find_procedure_byPTUID);
    app.post('/centrix_edoc/find_procedure_byPTVUID', centrix_edoc.find_procedure_byPTVUID);
    app.post('/centrix_edoc/labcumu', centrix_edoc.labcumu);
    app.post('/centrix_edoc/find_icduse', centrix_edoc.find_icduse);
    app.post('/centrix_edoc/emr_findvisit_by_date', centrix_edoc.emr_findvisit_by_date);
    app.post('/centrix_edoc/find_appointment_dr', centrix_edoc.find_appointment_dr);
    app.post('/centrix_edoc/find_clinicalnote', centrix_edoc.find_clinicalnote);
    app.post('/centrix_edoc/find_orschedule', centrix_edoc.find_orschedule);
    app.post('/centrix_edoc/find_user_byorg', centrix_edoc.find_user_byorg);
    app.post('/centrix_edoc/getCareprovider', centrix_edoc.getCareprovider);
    app.post('/centrix_edoc/find_annotation', centrix_edoc.find_annotation);
    app.post('/centrix_edoc/getnotCareprovider', centrix_edoc.getnotCareprovider);
    app.post('/centrix_edoc/getexistingHN', centrix_edoc.getexistingHN);
    app.post('/centrix_edoc/find_getother_today', centrix_edoc.find_getother_today);
    app.post('/centrix_edoc/emr_eye_bydepartment', centrix_edoc.emr_eye_bydepartment);

    var centrix_edoc = require('./centrix_edocnew.route.js');
    app.post('/centrix_edocnew/getdetailbyHN', centrix_edoc.getdetailbyHN);
    app.post('/centrix_edocnew/emr_allergy', centrix_edoc.emr_allergy);
    app.post('/centrix_edocnew/emr_medhx', centrix_edoc.emr_medhx);
    app.post('/centrix_edocnew/find_mdname', centrix_edoc.find_mdname);
    app.post('/centrix_edocnew/find_department', centrix_edoc.find_department);
    app.post('/centrix_edocnew/emr_eye', centrix_edoc.emr_eye);
    app.post('/centrix_edocnew/find_appointment_dr', centrix_edoc.find_appointment_dr);
    app.post('/centrix_edocnew/find_orschedule', centrix_edoc.find_orschedule);
    app.post('/centrix_edocnew/findlabcumu_bypatientuid', centrix_edoc.findlabcumu_bypatientuid);


    var centrix_ipd01 = require('./centrix_ipd01.route.js');
    app.post('/centrix_ipd01/getvisit', centrix_ipd01.getvisit);
    app.post('/centrix_ipd01/find_currentmed', centrix_ipd01.find_currentmed);
    app.post('/centrix_ipd01/get_ICD10_byvisit', centrix_ipd01.get_ICD10_byvisit);
    app.post('/centrix_ipd01/get_progressnote', centrix_ipd01.get_progressnote);
    app.post('/centrix_ipd01/this_progressnote', centrix_ipd01.this_progressnote);
    app.post('/centrix_ipd01/this_orders', centrix_ipd01.this_orders);
    app.post('/centrix_ipd01/this_xray', centrix_ipd01.this_xray);
    app.post('/centrix_ipd01/this_lab', centrix_ipd01.this_lab);
    app.post('/centrix_ipd01/get_io', centrix_ipd01.get_io);
    // app.post('/centrix_ipd01/find_getmed_today', centrix_ipd01.find_getmed_today);
    // app.post('/centrix_ipd01/get_progressnote', centrix_ipd01.get_progressnote);
    // app.post('/centrix_ipd01/get_vitalsign', centrix_ipd01.get_vitalsign);
    // app.post('/centrix_ipd01/find_currentmed', centrix_ipd01.find_currentmed);
    // app.post('/centrix_ipd01/get_ICD10_byvisit', centrix_ipd01.get_ICD10_byvisit);
    // app.post('/centrix_ipd01/get_io', centrix_ipd01.get_io);
    // app.post('/centrix_ipd01/find_procedure_byPTVUID', centrix_ipd01.find_procedure_byPTVUID);
    // app.post('/centrix_ipd01/get_uid', centrix_ipd01.get_uid);

    var centrix_search = require('./centrix_search.route.js');
    app.post('/centrix_search/search_hn', centrix_search.search_hn);
    app.post('/centrix_search/search_patientuid', centrix_search.search_patientuid);
    app.post('/centrix_search/search_referencevalues', centrix_search.search_referencevalues);
    app.post('/centrix_search/search_referencevalues_domain', centrix_search.search_referencevalues_domain);
    app.post('/centrix_search/search_user', centrix_search.search_user);
    app.post('/centrix_search/search_orgall', centrix_search.search_orgall);
    app.post('/centrix_search/search_org', centrix_search.search_org);

    var centrix_db = require('./centrix_db.route.js');
    app.post('/centrix_db/findicd9', centrix_db.findicd9);
    app.post('/centrix_db/findicd10', centrix_db.findicd10);
    app.post('/centrix_db/or', centrix_db.or);

    var centrix_va = require('./centrix_va.route.js');
    app.post('/centrix_va/opdcase', centrix_va.opdcase);
    app.post('/centrix_va/findopd_byHN', centrix_va.findopd_byHN);
    var local_va = require('./local_va.route.js');
    app.post('/local_va/saveva', local_va.saveva);
    app.post('/local_va/findva', local_va.findva);
    app.post('/local_va/savetn', local_va.savetn);
    app.post('/local_va/findtn', local_va.findtn);
    app.post('/local_va/findva_byvisit', local_va.findva_byvisit);
    app.post('/local_va/findtn_byvisit', local_va.findtn_byvisit);
    app.post('/local_va/findva_byvisitall', local_va.findva_byvisitall);
    app.post('/local_va/findtn_byvisitall', local_va.findtn_byvisitall);
    app.post('/local_va/findva_byhn', local_va.findva_byhn);
    app.post('/local_va/findtn_byhn', local_va.findtn_byhn);
    var sql = require('./sql.route.js');
    app.post('/sql/episode', sql.episode);
    app.post('/sql/medday', sql.medday);
    app.post('/sql/lab', sql.lab);
    app.post('/sql/cc', sql.cc);
    app.post('/sql/diag', sql.diag);
    app.post('/sql/xray', sql.xray);
    app.post('/sql/dermo', sql.dermo);
    app.post('/sql/allergy', sql.allergy);
    app.post('/sql/episode_timeline', sql.episode_timeline);

    var centrix_interphase = require('./centrix_interphase.route.js');
    app.post('/centrix_interphase/createorupdate', centrix_interphase.createorupdate);
    // app.post('/centrix_interphase/findopd_byHN', centrix_interphase.findopd_byHN);
    var centrix_report = require('./centrix_report.route.js');
    app.post('/centrix_report/getvisitbyptuid', centrix_report.getvisitbyptuid);
    app.post('/centrix_report/find_diag', centrix_report.find_diag);
    app.post('/centrix_report/find_cchpi', centrix_report.find_cchpi);
    app.post('/centrix_report/find_pasthx', centrix_report.find_pasthx);
    app.post('/centrix_report/find_allergy', centrix_report.find_allergy);
    app.post('/centrix_report/find_exam', centrix_report.find_exam);
    app.post('/centrix_report/find_ix', centrix_report.find_ix);
    app.post('/centrix_report/find_med', centrix_report.find_med);
    app.post('/centrix_report/find_appointment', centrix_report.find_appointment);
    // app.post('/centrix_report/get_diag', centrix_report.get_diag);
    // app.post('/centrix_report/get_diag', centrix_report.get_diag);
    var local_productivity = require('./local_productivity.route.js');
    app.post('/local_productivity/savepro', local_productivity.savepro);
    app.post('/local_productivity/findpro', local_productivity.findpro);
    app.post('/local_productivity/savesetup', local_productivity.savesetup);
    app.post('/local_productivity/listsetup', local_productivity.listsetup);
    app.post('/local_productivity/deletesetup', local_productivity.deletesetup);
    app.post('/local_productivity/deletepro', local_productivity.deletepro);
    app.post('/local_productivity/sumdata', local_productivity.sumdata);

    var centrix_q = require('./centrix_q.route.js');
    app.post('/centrix_q/q_regist', centrix_q.q_regist);
    app.post('/centrix_q/finddepartments', centrix_q.finddepartments);
    app.post('/centrix_q/findopd_byHN', centrix_q.findopd_byHN);
    app.post('/centrix_q/findcaseor', centrix_q.findcaseor);
    app.post('/centrix_q/q_ertriage', centrix_q.q_ertriage);

    var local_q = require('./local_q.route.js');
    app.post('/local_q/savedep', local_q.savedep);
    app.post('/local_q/finddepartment', local_q.finddepartment);
    app.post('/local_q/delete_room', local_q.delete_room);
    app.post('/local_q/delete_department', local_q.delete_department);
    app.post('/local_q/savetransaction', local_q.savetransaction);
    app.post('/local_q/findtransaction', local_q.findtransaction);
    app.post('/local_q/q_bydepartment', local_q.q_bydepartment);
    app.post('/local_q/savestatus', local_q.savestatus);
    app.post('/local_q/transaction_consult', local_q.transaction_consult);
    app.post('/local_q/transaction_finalstage', local_q.transaction_finalstage);
    app.post('/local_q/transaction_end', local_q.transaction_end);
    app.post('/local_q/saveroom', local_q.saveroom);
    app.post('/local_q/findroom', local_q.findroom);
    app.post('/local_q/findroom_bydep', local_q.findroom_bydep);
    app.post('/local_q/update_room', local_q.update_room);
    app.post('/local_q/findtransactionER', local_q.findtransactionER);
    app.post('/local_q/savetransactionER', local_q.savetransactionER);
    app.post('/local_q/findcase_by4digit', local_q.findcase_by4digit);
    app.post('/local_q/savestatusER', local_q.savestatusER);
    // app.post('/local_q/q_opd', local_q.q_opd);
    // app.post('/local_q/transaction_opdtocx', local_q.transaction_opdtocx);
    // app.post('/local_q/transaction_opdrefer', local_q.transaction_opdrefer);
    // app.post('/local_q/q_cashier', local_q.q_cashier);
    // app.post('/local_q/savestatusopd', local_q.savestatusopd);
    // app.post('/local_q/savestatuscx', local_q.savestatuscx);
    // app.post('/local_q/transaction_endpx', local_q.transaction_endpx);

    var centrix_api_kdms = require('./centrix_api_kdms.route.js');
    app.post('/centrix_api_kdms/api1', centrix_api_kdms.api1);
    app.post('/centrix_api_kdms/userlogin/', centrix_api_kdms.userlogin);
    app.post('/centrix_api_kdms/afterregistration', centrix_api_kdms.afterregistration);
    app.post('/centrix_api_kdms/v1/afterregistration', centrix_api_kdms.afterregistrationV1);
    app.post('/centrix_api_kdms/v1/xrayresults', centrix_api_kdms.xrayResult);
    app.post('/centrix_api_kdms/patientlogin', centrix_api_kdms.patientlogin);
    app.post('/centrix_api_kdms/usertable', centrix_api_kdms.usertable);

    var centrix_webservice = require('./centrix_webservice.route.js');
    app.post('/centrix_webservice/usertable', centrix_webservice.usertable);

    var centrix_util = require('./centrix_util.route.js');
    app.post('/centrix_util/search_pt_by_dep', centrix_util.search_pt_by_dep);
    app.post('/centrix_util/form_template', centrix_util.form_template);
    app.post('/centrix_util/find_allform', centrix_util.find_allform);
    app.post('/centrix_util/pt_tracking', centrix_util.pt_tracking);

    var centrix_migrate = require('./centrix_migrate.route.js');
    app.post('/centrix_migrate/list_dbdetail', centrix_migrate.list_dbdetail);
    app.post('/centrix_migrate/save_cchpi', centrix_migrate.save_cchpi);
    app.post('/centrix_migrate/list_notetypeuid', centrix_migrate.list_notetypeuid);
    app.post('/centrix_migrate/find_lastcode', centrix_migrate.find_lastcode);
    app.post('/centrix_migrate/save_note', centrix_migrate.save_note);
}
