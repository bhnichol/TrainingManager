const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(
            `SELECT aa.email, bb.pass_hash, aa.id FROM trainingapp.users aa
             LEFT JOIN trainingapp.users_pass bb ON aa.id = bb.id 
             WHERE aa.email = :email`, [email], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (results.rows.length < 1) {
            console.log("User does not exist.")
            return res.sendStatus(401)
        }
        const roles = (await conn.execute(
            `SELECT role_id FROM trainingapp.users_roles
             WHERE id = :id`, [results.rows[0]['ID']])).rows.flat()
        const match = await bcrypt.compare(pwd, results.rows[0]['PASS_HASH']);
        if (match) {

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": results.rows[0]['EMAIL'],
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "email": results.rows[0]['EMAIL'] },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            await conn.execute(
                `UPDATE trainingapp.users_pass 
                SET REFRESH_TOKEN = :token
                WHERE id = :id`, [refreshToken, results.rows[0]['ID']], { autoCommit: true })
            console.log(`Email, ${email} successfully logged in!`)
            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            // Send authorization roles and access token to user
            res.json({roles, accessToken });
            if(conn) conn.close();
        }
        else {
            console.log("Incorrect Password")
            res.sendStatus(401)
        }
    } catch (err) {
        console.log(err.message)
        res.sendStatus(401)
    }
}

module.exports = { handleLogin };

// if (match) {
//     const roles = Object.values(foundUser.roles).filter(Boolean);
//     // create JWTs
//     const accessToken = jwt.sign(
//         {
//             "UserInfo": {
//                 "username": foundUser.username,
//                 "roles": roles
//             }
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '10s' }
//     );
//     const refreshToken = jwt.sign(
//         { "username": foundUser.username },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: '1d' }
//     );
//     // Saving refreshToken with current user
//     foundUser.refreshToken = refreshToken;
//     const result = await foundUser.save();
//     console.log(result);
//     console.log(roles);

//     // Creates Secure Cookie with refresh token
//     res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

//     // Send authorization roles and access token to user
//     res.json({ roles, accessToken });

// } else {
//     res.sendStatus(401);
// }