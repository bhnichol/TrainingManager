const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllPlanCourses = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(`
             SELECT aa.*, bb.F_NAME || ' ' || bb.L_NAME AS EMP_NAME, cc.TITLE FROM trainingapp.plan_courses aa
             LEFT JOIN trainingapp.employees bb on aa.emp_id = bb.empid
             LEFT JOIN trainingapp.courses cc on aa.COURSE_ID = cc.COURSEID
             WHERE aa.INACTIVE_IND <> 1`
             ,[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        console.log(err)
        res.send(err);
    }
}

const createPlanCourses = async (req, res) => {
    const {plans} = req.body;
    if (!plans)  return res.status(400).json({ 'message': 'missing plan details' });
    const timestamp = new Date();
    const flatPlans = plans.map((emp) => {
        return (emp.COURSES.map((course) => {
            return {"EMP_ID": emp.EMP.EMPID, "COURSE_ID": course.COURSEID, "COURSEHOURS": course.COURSEHOURS, "TUITION": course.TUITION, "TRAVELHOURS": course.TRAVELHOURS, "TRAVELCOST": course.TRAVEL, "CREATE_DATE": timestamp, "PLAN_ID": emp.PLAN_ID}
        }))
    }).flat()
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.executeMany('INSERT INTO trainingapp.plan_courses (EMP_ID, COURSE_ID, COURSEHOURS, TUITION, TRAVELHOURS, TRAVEL, CREATE_DATE, INACTIVE_IND, PLAN_ID) VALUES (:EMP_ID, :COURSE_ID, :COURSEHOURS, :TUITION, :TRAVELHOURS, :TRAVELCOST, :CREATE_DATE, 0, :PLAN_ID)',[...flatPlans],
            {autoCommit: true,    
            bindDefs: {
            EMP_ID: { type: oracledb.NUMBER },
            COURSE_ID: { type: oracledb.NUMBER},
            COURSEHOURS: { type: oracledb.NUMBER},
            TUITION: { type: oracledb.NUMBER},
            TRAVELHOURS: {type: oracledb.NUMBER},
            TRAVELCOST: {type: oracledb.NUMBER},
            CREATE_DATE: {type: oracledb.DATE},
            PLAN_ID: {type: oracledb.NUMBER}
        }});
        res.status(201).json({'message': `courses successfully added to plan.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

const deletePlanCourse = async (req, res) => {
    if (!req?.body?.org_code) return res.status(400).json({ "message": 'Org Code required' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('UPDATE trainingapp.organizations SET INACTIVE_IND = 1, DELETE_DATE = :DELETE_DATE WHERE ORG_CODE = :ORG_CODE', [timestamp, req.body.org_code],{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports = {getAllPlanCourses, deletePlanCourse, createPlanCourses};