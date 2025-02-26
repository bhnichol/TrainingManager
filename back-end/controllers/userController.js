const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllUsers = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('SELECT ID, EMAIL, F_NAME, L_NAME, INACTIVE_IND FROM trainingapp.users',[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const deleteUser = async (req, res) => {

}

module.exports = {getAllUsers, deleteUser};