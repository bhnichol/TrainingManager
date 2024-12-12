const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllUsers = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('SELECT * FROM trainingapp.users');
        res.send(results);
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