const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllPlans = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('SELECT * FROM trainingapp.plans WHERE INACTIVE_IND <> 1',[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createPlan = async (req, res) => {
    const { plan_title, plan_FY } = req.body;
    if (!plan_title || !plan_FY)  return res.status(400).json({ 'message': 'missing plan details' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('INSERT INTO trainingapp.plans (TITLE, FISCAL_YEAR, CREATE_DATE, INACTIVE_IND, APPROVAL_IND) VALUES (:TITLE, :FY, :CREATE_DATE, 0, 0)', [plan_title, plan_FY, timestamp],{autoCommit: true});
        res.status(201).json({'message': `Plan successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

const deletePlan = async (req, res) => {
    if (!req?.body?.planId) return res.status(400).json({ "message": 'PLANID required' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('UPDATE trainingapp.plans SET INACTIVE_IND = 1, DELETE_DATE = :DELETE_DATE WHERE PLAN_ID = :PLANID', [timestamp, req.body.planId],{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports = {getAllPlans, deletePlan, createPlan};