const jwt = require('jsonwebtoken');
const dbConn = require('../config/dbConn');
const oracledb = require('oracledb');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(`
            SELECT * FROM trainingapp.users aa 
            LEFT JOIN trainingapp.users_pass bb on aa.id = bb.id
            WHERE bb.REFRESH_TOKEN = :REFRESH_TOKEN
            `, [refreshToken], {outFormat: oracledb.OUT_FORMAT_OBJECT})
        if (results.rows.length < 1) return res.sendStatus(403);
        const roles = (await conn.execute(
            `SELECT role_id FROM trainingapp.users_roles
             WHERE id = :id`, [results.rows[0]['ID']])).rows.flat()
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || results.rows[0]['EMAIL'] !== decoded.email) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "email": decoded.email,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
                res.json({ roles, accessToken })
            }
        );
        if(conn) conn.close();
    } catch (err) {
        console.log(err)
    }

}

module.exports = { handleRefreshToken }