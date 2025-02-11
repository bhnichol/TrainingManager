const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllOrgs = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('SELECT * FROM trainingapp.organizations WHERE INACTIVE_IND <> 1',[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createOrg = async (req, res) => {
    const {org_code, org_title, org_desc} = req.body;
    if (!org_code || !org_title || !org_desc)  return res.status(400).json({ 'message': 'missing org details' });
    const timestamp = new Date();
    try {

        const conn = await oracledb.getConnection(dbConn);
        const org_codes_used = await conn.execute(`SELECT COUNT(*) FROM trainingapp.organizations WHERE org_code = '${org_code}' AND INACTIVE_IND != 1`)
        if(org_codes_used.rows[0] > 0){
           return res.sendStatus(409)
        }

        const results = await conn.execute('INSERT INTO trainingapp.organizations (ORG_CODE, ORG_TITLE, ORG_DESC, INACTIVE_IND, CREATE_DATE) VALUES (:ORG_CODE, :ORG_TITLE, :ORG_DESC, 0, :CREATE_DATE)', [org_code, org_title, org_desc, timestamp],{autoCommit: true});
        res.status(201).json({'message': `Organization successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const deleteOrg = async (req, res) => {
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

module.exports = {getAllOrgs, deleteOrg, createOrg};