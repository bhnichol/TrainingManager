const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllEmployees = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('SELECT * FROM trainingapp.employees WHERE INACTIVE_IND != 1',[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createEmployee = async (req, res) => {
    const {employees} = req.body;
    let err = false;
    const timestamp = new Date();
    const NoIndexEmps = employees.map((emp) => {if(!emp.effective_pay || !emp.f_name || !emp.l_name || !emp.org_code) {err = true} return ({"EFFECTIVE_PAY":Number(emp.effective_pay), "F_NAME":emp.f_name, "L_NAME":emp.l_name, "ORG_CODE":emp.org_code, "CREATE_DATE":timestamp})})
     // let query = '';
    if (!employees || err)  return res.status(400).json({ 'message': 'missing employees' });
    // employees.forEach(emp => {
    //     query = query + `INSERT INTO trainingapp.employees (EFFECTIVE_PAY, F_NAME, L_NAME, ORG_CODE, INACTIVE_IND) VALUES (${emp.effective_pay}, '${emp.f_name}', '${emp.l_name}', '${emp.org_code}', 0)\n`
    // })
    // query = query + 'SELECT * FROM DUAL\nCOMMIT'
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.executeMany('INSERT INTO trainingapp.employees (EFFECTIVE_PAY, F_NAME, L_NAME, ORG_CODE, INACTIVE_IND, CREATE_DATE) VALUES (:EFFECTIVE_PAY, :F_NAME, :L_NAME, :ORG_CODE, 0, :CREATE_DATE)',[...NoIndexEmps],
            {autoCommit: true,    
            bindDefs: {
            EFFECTIVE_PAY: { type: oracledb.NUMBER },
            F_NAME: { type: oracledb.STRING, maxSize: 50},
            L_NAME: { type: oracledb.STRING, maxSize: 50},
            ORG_CODE: { type: oracledb.STRING, maxSize: 50},
            CREATE_DATE: {type: oracledb.DATE}
        }});
        res.status(201).json({'message': `employees successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.empid) return res.status(400).json({ "message": 'empid required' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('UPDATE trainingapp.employees SET INACTIVE_IND = 1, DELETE_DATE = :DELETE_DATE WHERE EMPID = :EMPID', [timestamp, req.body.empid],{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports = {getAllEmployees, deleteEmployee, createEmployee};