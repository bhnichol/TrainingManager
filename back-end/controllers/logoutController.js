const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');
const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(`
            SELECT * FROM trainingapp.users aa 
            LEFT JOIN trainingapp.users_pass bb on aa.id = bb.id
            WHERE bb.REFRESH_TOKEN = :REFRESH_TOKEN
            `, [refreshToken], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (results.rows.length < 1) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
            return res.sendStatus(204);
        }

        // Delete refreshToken in db
        await conn.execute(
            `UPDATE trainingapp.users_pass 
            SET REFRESH_TOKEN = ''
            WHERE id = :id`, [results.rows[0]['ID']], { autoCommit: true })
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
        res.sendStatus(204);
        if(conn) conn.close();

    } catch (err) {
        console.log(err)
    }
}

module.exports = { handleLogout }