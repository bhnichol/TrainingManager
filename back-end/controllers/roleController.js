const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getUserRoles = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'id required' });
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(`SELECT aa.*, bb.ID FROM trainingapp.roles aa LEFT JOIN trainingapp.users_roles bb ON aa.role_id = bb.role_id AND bb.id = :id`,[req.params.id],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        console.log(err)
        res.send(err);
    }
}

module.exports = {getUserRoles};