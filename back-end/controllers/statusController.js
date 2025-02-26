const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllStatus = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(`SELECT STATUS_ID, DESCRIPTION, TO_CHAR(EFFECT_DATE, 'MM-DD-YYYY HH:MI:SS AM') AS EFFECT_DATE, STATUS_TYPE FROM trainingapp.status WHERE INACTIVE_IND <> 1 AND (sysdate < EFFECT_DATE OR STATUS_TYPE = 'error')` ,[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

const createStatus = async (req, res) => {
    const { status_desc, status_type, effect_date } = req.body;
    if (!status_desc || !effect_date)  return res.status(400).json({ 'message': 'missing status details' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('INSERT INTO trainingapp.status (DESCRIPTION, STATUS_TYPE, EFFECT_DATE, CREATE_DATE, INACTIVE_IND) VALUES (:DESCRIPTION, :TYPE, :EFFECT, :CREATE_DATE, 0)', [status_desc, status_type, effect_date, timestamp],{autoCommit: true});
        res.status(201).json({'message': `Status successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteStatus = async (req, res) => {
    if (!req?.body?.statusId) return res.status(400).json({ "message": 'STATUS_ID required' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('UPDATE trainingapp.status SET INACTIVE_IND = 1, DELETE_DATE = :DELETE_DATE WHERE STATUS_ID = :statusId', [timestamp, req.body.statusId],{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports = {getAllStatus, deleteStatus, createStatus};